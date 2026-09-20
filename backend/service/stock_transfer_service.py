from sqlmodel import Session, select
from fastapi import HTTPException
from models.stock_transfer import StockTransfer, StockTransferItem
from models.product_batch import ProductBatch
from models.medicine import Medicine
from models.users import User
from typing import List

class StockTransferService:
    @staticmethod
    def get_transfers(db: Session, tenant_id: int, type: str = "all"):
        if type == "outbound":
            statement = select(StockTransfer).where(StockTransfer.from_tenant_id == tenant_id)
        elif type == "inbound":
            statement = select(StockTransfer).where(StockTransfer.to_tenant_id == tenant_id)
        else:
            statement = select(StockTransfer).where((StockTransfer.from_tenant_id == tenant_id) | (StockTransfer.to_tenant_id == tenant_id))
        
        transfers = db.exec(statement.order_by(StockTransfer.created_at.desc())).all()
        return transfers

    @staticmethod
    def create_transfer(db: Session, from_tenant_id: int, to_tenant_id: int, created_by: str, items: List[dict], notes: str = None):
        if from_tenant_id == to_tenant_id:
            raise HTTPException(status_code=400, detail="Cannot transfer stock to the same branch")

        user = db.exec(select(User).where(User.id == created_by)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        transfer = StockTransfer(
            from_tenant_id=from_tenant_id,
            to_tenant_id=to_tenant_id,
            created_by=user.id,
            notes=notes,
            status="pending"
        )
        db.add(transfer)
        db.commit()
        db.refresh(transfer)

        for item_data in items:
            medicine_barcode = item_data["medicine_barcode"]
            qty_to_transfer = item_data["quantity"]

            # Validate stock exists in source branch
            medicine = db.exec(select(Medicine).where(
                Medicine.barcode == medicine_barcode,
                Medicine.tenant_id == from_tenant_id
            )).first()

            if not medicine or medicine.quantity < qty_to_transfer:
                db.rollback()
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {medicine_barcode} in source branch")

            # Deduct from source branch
            medicine.quantity -= qty_to_transfer
            db.add(medicine)

            # Deduct from batches using FIFO
            batches = db.exec(
                select(ProductBatch).where(
                    ProductBatch.medicine_id == medicine.id,
                    ProductBatch.quantity > 0
                ).order_by(ProductBatch.expiry_date.asc())
            ).all()

            qty_remaining = qty_to_transfer
            for batch in batches:
                if qty_remaining <= 0:
                    break
                if batch.quantity >= qty_remaining:
                    batch.quantity -= qty_remaining
                    qty_remaining = 0
                else:
                    qty_remaining -= batch.quantity
                    batch.quantity = 0
                db.add(batch)

            if qty_remaining > 0:
                db.rollback()
                raise HTTPException(status_code=400, detail=f"Batch stock mismatch for {medicine.name}")

            # Record transfer item
            transfer_item = StockTransferItem(
                transfer_id=transfer.id,
                medicine_barcode=medicine_barcode,
                medicine_name=medicine.name,
                quantity=qty_to_transfer
            )
            db.add(transfer_item)

        transfer.status = "shipped"
        db.add(transfer)
        db.commit()
        db.refresh(transfer)
        return transfer

    @staticmethod
    def receive_transfer(db: Session, transfer_id: int, to_tenant_id: int):
        transfer = db.exec(select(StockTransfer).where(StockTransfer.id == transfer_id)).first()
        if not transfer:
            raise HTTPException(status_code=404, detail="Transfer not found")
        if transfer.to_tenant_id != to_tenant_id:
            raise HTTPException(status_code=403, detail="Not authorized to receive this transfer")
        if transfer.status != "shipped":
            raise HTTPException(status_code=400, detail="Transfer is not in shipped status")

        # Add stock to destination branch
        for item in transfer.items:
            # Check if medicine exists in destination branch by barcode
            medicine = db.exec(select(Medicine).where(
                Medicine.barcode == item.medicine_barcode,
                Medicine.tenant_id == to_tenant_id
            )).first()

            if not medicine:
                # Need to auto-create medicine in destination branch
                # We'll copy details from source branch's medicine
                source_med = db.exec(select(Medicine).where(
                    Medicine.barcode == item.medicine_barcode,
                    Medicine.tenant_id == transfer.from_tenant_id
                )).first()

                if not source_med:
                    raise HTTPException(status_code=500, detail=f"Source medicine not found for barcode {item.medicine_barcode}")

                medicine = Medicine(
                    name=source_med.name,
                    generic_salt=source_med.generic_salt,
                    category_id=None, # Cannot assume categories match between tenants
                    barcode=source_med.barcode,
                    description=source_med.description,
                    unit=source_med.unit,
                    quantity=0,
                    purchase_price=source_med.purchase_price,
                    selling_price=source_med.selling_price,
                    target_max_stock=source_med.target_max_stock,
                    is_narcotic=source_med.is_narcotic,
                    prescription_required=source_med.prescription_required,
                    tenant_id=to_tenant_id
                )
                db.add(medicine)
                db.flush()

            # Increase quantity
            medicine.quantity += item.quantity
            db.add(medicine)

            # Create a new batch for received stock
            # (In a real system, we might copy the exact expiry date from the source batch, 
            # but for simplicity we'll create a single batch for the received transfer)
            from datetime import datetime, timedelta
            batch = ProductBatch(
                medicine_id=medicine.id,
                batch_number=f"TRF-{transfer.id}",
                purchase_price=medicine.purchase_price,
                quantity=item.quantity,
                expiry_date=datetime.utcnow() + timedelta(days=365), # Generic 1 year expiry
                tenant_id=to_tenant_id
            )
            db.add(batch)

        transfer.status = "received"
        db.add(transfer)
        db.commit()
        db.refresh(transfer)
        return transfer
