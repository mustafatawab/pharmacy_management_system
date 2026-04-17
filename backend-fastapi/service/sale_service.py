from fastapi import HTTPException, status
from sqlmodel import Session, select, col, func
from models.sale import Sale, SaleItem
from models.medicine import Medicine
from models.users import User
from schemas.sale_schema import SaleCreate, SaleFilter, SaleListResponse
from datetime import datetime

class SaleService:
    def create_sale(self, data: SaleCreate, session: Session, current_user: User) -> Sale:
        # Start transaction logic
        # 1. Validate stock for all items
        sale_items = []
        for item_data in data.items:
            medicine = session.exec(
                select(Medicine).where(
                    Medicine.id == item_data.medicine_id,
                    Medicine.tenant_id == current_user.tenant_id
                )
            ).first()

            if not medicine:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Medicine with ID {item_data.medicine_id} not found"
                )

            if medicine.quantity < item_data.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for {medicine.name}. Available: {medicine.quantity}, Requested: {item_data.quantity}"
                )

            # 2. Prepare SaleItem
            sale_item = SaleItem(
                medicine_id=item_data.medicine_id,
                quantity=item_data.quantity,
                unit_price=item_data.unit_price,
                total_price=item_data.unit_price * item_data.quantity
            )
            sale_items.append(sale_item)

            # 3. Deduct stock
            medicine.quantity -= item_data.quantity
            session.add(medicine)

        # 4. Create Sale
        new_sale = Sale(
            total_amount=data.total_amount,
            discount=data.discount,
            final_amount=data.final_amount,
            payment_method=data.payment_method,
            tenant_id=current_user.tenant_id,
            user_id=current_user.id,
            items=sale_items
        )

        session.add(new_sale)
        session.commit()
        session.refresh(new_sale)
        return new_sale

    def get_all_sales(self, session: Session, current_user: User, filters: SaleFilter) -> SaleListResponse:
        query = select(Sale).where(Sale.tenant_id == current_user.tenant_id)

        # Filtering
        if filters.start_date:
            query = query.where(Sale.created_at >= filters.start_date)
        if filters.end_date:
            query = query.where(Sale.created_at <= filters.end_date)
        if filters.user_id:
            query = query.where(Sale.user_id == filters.user_id)

        # Total count
        total_query = select(func.count()).select_from(query.subquery())
        total = session.exec(total_query).one()

        # Sorting
        sort_column = getattr(Sale, filters.sort_by, Sale.created_at)
        if filters.sort_order == "desc":
            query = query.order_by(col(sort_column).desc())
        else:
            query = query.order_by(col(sort_column).asc())

        # Pagination
        offset = (filters.page - 1) * filters.page_size
        query = query.offset(offset).limit(filters.page_size)

        sales = session.exec(query).all()

        return {
            "items": sales,
            "total": total,
            "page": filters.page,
            "page_size": filters.page_size
        }

    def get_sale_by_id(self, sale_id: int, session: Session, current_user: User) -> Sale:
        sale = session.exec(
            select(Sale).where(
                Sale.id == sale_id,
                Sale.tenant_id == current_user.tenant_id
            )
        ).first()

        if not sale:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sale not found"
            )
        return sale
