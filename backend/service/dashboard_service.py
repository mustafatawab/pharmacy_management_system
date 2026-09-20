from sqlmodel import Session, select, col
from models.product_batch import ProductBatch
from models.medicine import Medicine
from models.users import User
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List

class ExpiryAlert(BaseModel):
    batch_id: int
    medicine_name: str
    batch_number: str
    quantity: int
    expiry_date: datetime
    days_to_expiry: int

class DashboardService:
    def get_expiry_alerts(self, session: Session, current_user: User) -> List[ExpiryAlert]:
        now = datetime.utcnow()
        ninety_days = now + timedelta(days=90)
        
        # Get active batches expiring in next 90 days
        query = select(ProductBatch, Medicine.name).join(Medicine).where(
            ProductBatch.tenant_id == current_user.tenant_id,
            ProductBatch.is_active == True,
            ProductBatch.quantity > 0,
            ProductBatch.expiry_date != None,
            ProductBatch.expiry_date <= ninety_days
        ).order_by(col(ProductBatch.expiry_date).asc())
        
        results = session.exec(query).all()
        
        alerts = []
        for batch, medicine_name in results:
            days = (batch.expiry_date - now).days
            alerts.append(ExpiryAlert(
                batch_id=batch.id,
                medicine_name=medicine_name,
                batch_number=batch.batch_number,
                quantity=batch.quantity,
                expiry_date=batch.expiry_date,
                days_to_expiry=days
            ))
            
        return alerts
