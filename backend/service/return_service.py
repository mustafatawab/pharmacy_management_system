from sqlmodel import Session, select
from models.return_to_supplier import ReturnToSupplier, ReturnToSupplierItem
from models.supplier_ledger import SupplierLedger
from models.supplier import Supplier
from models.product_batch import ProductBatch
from models.medicine import Medicine
from models.users import User
from schemas.return_schema import ReturnToSupplierCreate
from fastapi import HTTPException
from decimal import Decimal
from datetime import datetime

class ReturnService:
    def create_return(self, data: ReturnToSupplierCreate, session: Session, current_user: User):
        supplier = session.exec(
            select(Supplier).where(
                Supplier.id == data.supplier_id,
                Supplier.tenant_id == current_user.tenant_id
            )
        ).first()
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
            
        new_return = ReturnToSupplier(
            supplier_id=supplier.id,
            tenant_id=current_user.tenant_id,
            user_id=current_user.id,
            total_amount=Decimal("0.00"),
            reason=data.reason
        )
        session.add(new_return)
        session.flush() # get return id
        
        total_amount = Decimal("0.00")
        
        for item in data.items:
            batch = session.exec(
                select(ProductBatch).where(
                    ProductBatch.id == item.batch_id,
                    ProductBatch.tenant_id == current_user.tenant_id
                )
            ).first()
            
            if not batch or batch.quantity < item.quantity:
                raise HTTPException(status_code=400, detail=f"Insufficient quantity in batch {item.batch_id}")
                
            total_price = item.unit_price * item.quantity
            total_amount += total_price
            
            return_item = ReturnToSupplierItem(
                return_id=new_return.id,
                batch_id=batch.id,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=total_price
            )
            session.add(return_item)
            
            # Deduct from batch
            batch.quantity -= item.quantity
            if batch.quantity == 0:
                batch.is_active = False
            session.add(batch)
            
            # Deduct from medicine
            medicine = session.exec(select(Medicine).where(Medicine.id == batch.medicine_id)).first()
            medicine.quantity -= item.quantity
            session.add(medicine)
            
        new_return.total_amount = total_amount
        session.add(new_return)
        
        # Credit supplier ledger
        supplier.outstanding_balance -= total_amount
        
        ledger_entry = SupplierLedger(
            supplier_id=supplier.id,
            tenant_id=current_user.tenant_id,
            reference_type="return",
            reference_id=new_return.id,
            debit=Decimal("0.00"),
            credit=total_amount,
            balance_after=supplier.outstanding_balance,
            notes=f"Return to Supplier {new_return.id}"
        )
        session.add(supplier)
        session.add(ledger_entry)
        
        session.commit()
        session.refresh(new_return)
        
        return new_return
