from sqlmodel import SQLModel, select
from models.purchase import Purchase, PurchaseItem
from models.medicine import Medicine
from models.supplier import Supplier
from models.users import User
from schemas.purchase_schema import PurchaseCreate, PurchaseUpdate, PurchaseItemCreate, PurchaseBase
from fastapi import Depends, HTTPException
from sqlmodel import Session
from database import get_session
from auth.dependency import get_current_user
from typing import List, Optional, Any


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
        # Validate supplier info - check if supplier exists
        # For now, we'll create the purchase with provided supplier info
        
        # Validate medicines have sufficient stock
        if purchase_data.items:
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
                # Note: Purchase doesn't deduct stock, it adds inventory
                # But we could track purchase price

        new_purchase = Purchase(
            **purchase_data.model_dump(exclude={"items"}),
            tenant_id=current_user.tenant_id,
            user_id=current_user.id,
        )
        
        session.add(new_purchase)
        session.commit()
        session.refresh(new_purchase)
        
        # Create purchase items
        for item_data in purchase_data.items:
            # Get medicine details for pricing
            medicine = session.exec(
                select(Medicine).where(
                    Medicine.id == item_data.medicine_id,
                    Medicine.tenant_id == current_user.tenant_id,
                )
            ).first()
            
            unit_price = item_data.unit_price
            if medicine:
                # Optionally set unit price from medicine selling price
                # unit_price = medicine.selling_price
                pass
            
            total_price = unit_price * item_data.quantity
            
            purchase_item = PurchaseItem(
                purchase_id=new_purchase.id,
                medicine_id=item_data.medicine_id,
                quantity=item_data.quantity,
                unit_price=unit_price,
                total_price=total_price,
            )
            session.add(purchase_item)
        
        session.commit()
        session.refresh(new_purchase)
        return new_purchase

    def update_purchase(
        self,
        purchase_id: int,
        purchase_data: PurchaseBase,
        session: Session,
        current_user: User,
    ) -> Purchase | None:
        purchase = self.get_purchase_by_id(purchase_id, session, current_user)
        if not purchase:
            return None
        
        update_data = purchase_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(purchase, key, value)
        
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