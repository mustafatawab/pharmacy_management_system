from sqlmodel import SQLModel, select, func
from models.purchase import Purchase, PurchaseItem
from models.medicine import Medicine
from models.product_batch import ProductBatch
from models.supplier import Supplier
from models.users import User
from schemas.purchase_schema import PurchaseCreate, PurchaseUpdate, PurchaseItemCreate, PurchaseBase
from fastapi import Depends, HTTPException
from sqlmodel import Session
from database import get_session
from auth.dependency import get_current_user
from typing import List, Optional, Any
from datetime import datetime


class PurchaseService:
    def __init__(self):
        pass

    def get_all_purchases(
        self,
        session: Session,
        current_user: User,
        filters: Optional[Any] = None,
    ) -> List[Purchase]:
        query = select(Purchase).where(Purchase.tenant_id == current_user.tenant_id)

        if filters:
            if filters.start_date:
                query = query.where(Purchase.created_at >= filters.start_date)
            if filters.end_date:
                query = query.where(Purchase.created_at <= filters.end_date)
            if filters.supplier_name:
                query = query.where(Purchase.supplier_name.ilike(f"%{filters.supplier_name}%"))

        query = query.order_by(Purchase.created_at.desc())
        purchases = session.exec(query).all()
        return purchases

    def get_purchase_by_id(
        self,
        purchase_id: int,
        session: Session,
        current_user: User,
    ) -> Purchase | None:
        purchase = session.exec(
            select(Purchase).where(
                Purchase.id == purchase_id,
                Purchase.tenant_id == current_user.tenant_id,
            )
        ).first()
        return purchase

    def create_purchase(
        self,
        purchase_data: PurchaseCreate,
        session: Session,
        current_user: User,
    ) -> Purchase:
        """
        Creates a purchase order and:
        1. Validates all medicines belong to this tenant.
        2. Saves the Purchase header and PurchaseItems.
        3. Creates a ProductBatch for each item (batch tracking for FIFO).
        4. Increments medicine.quantity by received quantity.
        """
        # Validate medicines exist for this tenant
        for item in purchase_data.items:
            medicine = session.exec(
                select(Medicine).where(
                    Medicine.id == item.medicine_id,
                    Medicine.tenant_id == current_user.tenant_id,
                )
            ).first()
            if not medicine:
                raise HTTPException(
                    status_code=404,
                    detail=f"Medicine with ID {item.medicine_id} not found",
                )

        # Create Purchase header
        new_purchase = Purchase(
            **purchase_data.model_dump(exclude={"items"}),
            tenant_id=current_user.tenant_id,
            user_id=current_user.id,
        )
        session.add(new_purchase)
        session.commit()
        session.refresh(new_purchase)

        # Create PurchaseItems
        for item_data in purchase_data.items:
            unit_price = item_data.unit_price
            total_price = unit_price * item_data.quantity

            purchase_item = PurchaseItem(
                purchase_id=new_purchase.id,
                medicine_id=item_data.medicine_id,
                quantity=item_data.quantity,
                unit_price=unit_price,
                total_price=total_price,
            )
            session.add(purchase_item)
            
            # Temporary store the extra data on the item so the completion logic can use it
            purchase_item._batch_number = item_data.batch_number if hasattr(item_data, "batch_number") else None
            purchase_item._expiry_date = item_data.expiry_date if hasattr(item_data, "expiry_date") else None

        if new_purchase.status == "Completed":
            self._complete_purchase(new_purchase, session, current_user)

        session.commit()
        session.refresh(new_purchase)
        return new_purchase

    def _complete_purchase(self, purchase: Purchase, session: Session, current_user: User):
        from models.supplier_ledger import SupplierLedger
        
        # 1. Update medicine stock and create batches
        for item in purchase.items:
            medicine = session.exec(
                select(Medicine).where(
                    Medicine.id == item.medicine_id,
                    Medicine.tenant_id == current_user.tenant_id,
                )
            ).first()

            batch_number = getattr(item, "_batch_number", None) or f"PO-{purchase.id}-MED-{medicine.id}"
            expiry_date = getattr(item, "_expiry_date", None)
            
            if expiry_date:
                product_batch = ProductBatch(
                    medicine_id=medicine.id,
                    batch_number=batch_number,
                    quantity=item.quantity,
                    expiry_date=expiry_date,
                    purchase_price=item.unit_price,
                    tenant_id=current_user.tenant_id,
                    is_active=True,
                )
                session.add(product_batch)
            
            # Increment medicine quantity
            medicine.quantity += item.quantity
            medicine.updated_at = datetime.utcnow()
            session.add(medicine)

        # 2. Add Supplier Ledger entry if supplier is linked
        if purchase.supplier_id:
            supplier = session.exec(select(Supplier).where(Supplier.id == purchase.supplier_id)).first()
            if supplier:
                # Add debit to ledger (amount owed)
                supplier.outstanding_balance += purchase.final_amount
                ledger_entry = SupplierLedger(
                    supplier_id=supplier.id,
                    tenant_id=current_user.tenant_id,
                    reference_type="purchase",
                    reference_id=purchase.id,
                    debit=purchase.final_amount,
                    credit=Decimal("0.00"),
                    balance_after=supplier.outstanding_balance,
                    notes=f"Purchase Order {purchase.id}"
                )
                session.add(supplier)
                session.add(ledger_entry)

    def update_purchase(
        self,
        purchase_id: int,
        purchase_data: PurchaseUpdate,
        session: Session,
        current_user: User,
    ) -> Purchase | None:
        purchase = self.get_purchase_by_id(purchase_id, session, current_user)
        if not purchase:
            return None

        update_data = purchase_data.model_dump(exclude_unset=True)
        
        old_status = purchase.status
        new_status = update_data.get("status", old_status)
        
        for key, value in update_data.items():
            setattr(purchase, key, value)
            
        if old_status != "Completed" and new_status == "Completed":
            # Just set batch default stuff since items are already loaded
            for item in purchase.items:
                item._batch_number = f"PO-{purchase.id}-MED-{item.medicine_id}"
                item._expiry_date = None # We don't have it on update currently unless passed in
            self._complete_purchase(purchase, session, current_user)

        session.add(purchase)
        session.commit()
        session.refresh(purchase)
        return purchase

    def delete_purchase(self, purchase_id: int, session: Session, current_user: User) -> bool:
        purchase = self.get_purchase_by_id(purchase_id, session, current_user)
        if not purchase:
            return False

        session.delete(purchase)
        session.commit()
        return True

    def auto_generate_drafts(self, session: Session, current_user: User):
        """Finds medicines below reorder level and creates Draft POs grouped by supplier."""
        medicines = session.exec(
            select(Medicine).where(
                Medicine.tenant_id == current_user.tenant_id,
                Medicine.is_active == True,
                Medicine.quantity < Medicine.reorder_level
            )
        ).all()
        
        if not medicines:
            return []
            
        # Group by supplier_id
        from collections import defaultdict
        grouped = defaultdict(list)
        for med in medicines:
            order_qty = max(1, med.target_max_stock - med.quantity) if med.target_max_stock > med.quantity else med.reorder_level
            grouped[med.supplier_id].append((med, order_qty))
            
        drafts_created = []
        for supplier_id, items in grouped.items():
            supplier = None
            if supplier_id:
                supplier = session.exec(select(Supplier).where(Supplier.id == supplier_id)).first()
                
            total_amount = sum(med.purchase_price * qty for med, qty in items)
            
            draft = Purchase(
                tenant_id=current_user.tenant_id,
                user_id=current_user.id,
                total_amount=total_amount,
                final_amount=total_amount,
                status="Draft",
                supplier_id=supplier.id if supplier else None,
                supplier_name=supplier.company_name if supplier else "Unknown Supplier"
            )
            session.add(draft)
            session.flush() # get ID
            
            for med, qty in items:
                p_item = PurchaseItem(
                    purchase_id=draft.id,
                    medicine_id=med.id,
                    quantity=qty,
                    unit_price=med.purchase_price,
                    total_price=med.purchase_price * qty
                )
                session.add(p_item)
                
            drafts_created.append(draft)
            
        session.commit()
        for d in drafts_created:
            session.refresh(d)
        return drafts_created