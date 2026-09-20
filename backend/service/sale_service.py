from fastapi import HTTPException, status
from sqlmodel import Session, select, col, func
from models.sale import Sale, SaleItem
from models.medicine import Medicine
from models.product_batch import ProductBatch
from models.users import User
from schemas.sale_schema import SaleCreate, SaleFilter, SaleListResponse
from service.unit_conversion_service import UnitConversionService
from datetime import datetime

unit_conversion_service = UnitConversionService()


class SaleService:
    def create_sale(self, data: SaleCreate, session: Session, current_user: User) -> Sale:
        """
        Creates a sale with FIFO batch-based stock deduction.

        For each item:
        1. Resolve dispensed_unit → base units using UnitConversionService.
        2. Validate total stock is sufficient.
        3. Deduct from oldest batches first (FIFO by expiry_date ASC).
        4. Record which batch was used in SaleItem.batch_id for traceability.
        5. Recalculate medicine.quantity = SUM of remaining active batch quantities.
        """
        sale_items = []

        for item_data in data.items:
            # --- 1. Fetch medicine ---
            medicine = session.exec(
                select(Medicine).where(
                    Medicine.id == item_data.medicine_id,
                    Medicine.tenant_id == current_user.tenant_id,
                )
            ).first()

            if not medicine:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Medicine with ID {item_data.medicine_id} not found",
                )

            # --- 2. Resolve quantity to base units ---
            dispensed_unit = item_data.dispensed_unit or medicine.base_unit
            try:
                base_qty = unit_conversion_service.resolve_to_base_units(
                    medicine_id=medicine.id,
                    quantity=item_data.quantity,
                    unit=dispensed_unit,
                    session=session,
                    current_user=current_user,
                )
            except HTTPException:
                # If no conversion defined, treat quantity as base units
                base_qty = item_data.quantity

            # --- 3. Validate total available stock ---
            if medicine.quantity < base_qty:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"Insufficient stock for '{medicine.name}'. "
                        f"Available: {medicine.quantity} {medicine.base_unit}, "
                        f"Requested: {base_qty} {medicine.base_unit}"
                    ),
                )

            # --- 4. FIFO batch deduction ---
            # Fetch active batches ordered by expiry_date ASC (oldest first)
            batches = list(
                session.exec(
                    select(ProductBatch)
                    .where(
                        ProductBatch.medicine_id == medicine.id,
                        ProductBatch.tenant_id == current_user.tenant_id,
                        ProductBatch.is_active == True,
                        ProductBatch.quantity > 0,
                    )
                    .order_by(col(ProductBatch.expiry_date).asc())
                ).all()
            )

            remaining = base_qty
            primary_batch_id: int | None = None  # Record the first (primary) batch used

            for batch in batches:
                if remaining <= 0:
                    break

                deduct = min(batch.quantity, remaining)
                batch.quantity -= deduct
                remaining -= deduct

                if primary_batch_id is None:
                    primary_batch_id = batch.id

                if batch.quantity == 0:
                    batch.is_active = False

                batch.updated_at = datetime.utcnow()
                session.add(batch)

            # This should not happen if stock validation above is correct
            if remaining > 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Stock deduction error for '{medicine.name}'. Please refresh and try again.",
                )

            # --- 5. Recalculate medicine.quantity from remaining active batches ---
            total_remaining = session.exec(
                select(func.sum(ProductBatch.quantity)).where(
                    ProductBatch.medicine_id == medicine.id,
                    ProductBatch.is_active == True,
                )
            ).one() or 0
            medicine.quantity = total_remaining
            medicine.updated_at = datetime.utcnow()
            session.add(medicine)

            # --- 6. Build SaleItem ---
            sale_item = SaleItem(
                medicine_id=item_data.medicine_id,
                batch_id=primary_batch_id,
                quantity=base_qty,
                dispensed_unit=dispensed_unit,
                unit_price=item_data.unit_price,
                total_price=item_data.unit_price * base_qty,
            )
            sale_items.append(sale_item)

        # Phase 3 Checks
        requires_prescription = False
        
        for item_data in data.items:
            medicine = session.exec(select(Medicine).where(Medicine.id == item_data.medicine_id)).first()
            if medicine and (medicine.is_narcotic or medicine.prescription_required):
                requires_prescription = True
                
        if requires_prescription and not (data.prescription_no and data.doctor_name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more items require a prescription. Doctor name and prescription number are mandatory."
            )
            
        from models.customer import Customer
        from models.customer_ledger import CustomerLedger
        from decimal import Decimal
        
        customer = None
        if data.customer_id:
            customer = session.exec(select(Customer).where(Customer.id == data.customer_id, Customer.tenant_id == current_user.tenant_id)).first()
            if not customer:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
                
        if data.payment_method == "credit":
            if not customer:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Customer must be selected for credit sales")
            if customer.outstanding_balance + data.final_amount > customer.credit_limit:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Credit limit exceeded. Available credit: {customer.credit_limit - customer.outstanding_balance}")

        # --- 7. Persist Sale ---
        new_sale = Sale(
            total_amount=data.total_amount,
            discount=data.discount,
            final_amount=data.final_amount,
            payment_method=data.payment_method,
            customer_id=data.customer_id,
            prescription_no=data.prescription_no,
            doctor_name=data.doctor_name,
            insurance_panel_id=data.insurance_panel_id,
            insurance_amount=data.insurance_amount,
            patient_copay=data.patient_copay,
            tenant_id=current_user.tenant_id,
            user_id=current_user.id,
            items=sale_items,
        )

        session.add(new_sale)
        session.flush() # get sale id
        
        # Phase 3 CRM Updates
        if data.payment_method == "credit" and customer:
            customer.outstanding_balance += data.final_amount
            ledger_entry = CustomerLedger(
                customer_id=customer.id,
                tenant_id=current_user.tenant_id,
                reference_type="sale",
                reference_id=new_sale.id,
                debit=data.final_amount,
                credit=Decimal("0.00"),
                balance_after=customer.outstanding_balance,
                notes=f"Credit Sale #{new_sale.id}"
            )
            session.add(customer)
            session.add(ledger_entry)
            
        # Phase 4 Insurance Ledger
        if data.payment_method == "insurance" and data.insurance_panel_id:
            from models.insurance import InsurancePanel, InsuranceLedger
            panel = session.exec(select(InsurancePanel).where(InsurancePanel.id == data.insurance_panel_id, InsurancePanel.tenant_id == current_user.tenant_id)).first()
            if panel and data.insurance_amount:
                panel.receivable_balance += data.insurance_amount
                ins_ledger = InsuranceLedger(
                    panel_id=panel.id,
                    tenant_id=current_user.tenant_id,
                    reference_type="sale",
                    reference_id=new_sale.id,
                    debit=data.insurance_amount,
                    credit=Decimal("0.00"),
                    balance_after=panel.receivable_balance,
                    notes=f"Insurance Claim Sale #{new_sale.id}"
                )
                session.add(panel)
                session.add(ins_ledger)
            
        if data.refill_duration_days and customer:
            from models.refill_reminder import RefillReminder
            from datetime import timedelta
            # We add a reminder for the first medicine in the cart (or all)
            # For simplicity, we just take the first item
            next_date = datetime.utcnow() + timedelta(days=data.refill_duration_days)
            reminder = RefillReminder(
                customer_id=customer.id,
                medicine_id=sale_items[0].medicine_id,
                sale_id=new_sale.id,
                tenant_id=current_user.tenant_id,
                next_refill_date=next_date
            )
            session.add(reminder)
            
        session.commit()
        session.refresh(new_sale)
        return new_sale

    def get_all_sales(self, session: Session, current_user: User, filters: SaleFilter) -> SaleListResponse:
        query = select(Sale).where(Sale.tenant_id == current_user.tenant_id)

        if filters.start_date:
            query = query.where(Sale.created_at >= filters.start_date)
        if filters.end_date:
            query = query.where(Sale.created_at <= filters.end_date)
        if filters.user_id:
            query = query.where(Sale.user_id == filters.user_id)

        total_query = select(func.count()).select_from(query.subquery())
        total = session.exec(total_query).one()

        sort_column = getattr(Sale, filters.sort_by, Sale.created_at)
        if filters.sort_order == "desc":
            query = query.order_by(col(sort_column).desc())
        else:
            query = query.order_by(col(sort_column).asc())

        offset = (filters.page - 1) * filters.page_size
        query = query.offset(offset).limit(filters.page_size)

        sales = session.exec(query).all()

        return {
            "items": sales,
            "total": total,
            "page": filters.page,
            "page_size": filters.page_size,
        }

    def get_sale_by_id(self, sale_id: int, session: Session, current_user: User) -> Sale:
        sale = session.exec(
            select(Sale).where(
                Sale.id == sale_id,
                Sale.tenant_id == current_user.tenant_id,
            )
        ).first()

        if not sale:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sale not found",
            )
        return sale
