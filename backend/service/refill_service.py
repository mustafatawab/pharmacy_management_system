from sqlmodel import Session, select
from models.refill_reminder import RefillReminder
from models.customer import Customer
from models.medicine import Medicine
from models.users import User
from schemas.refill_schema import RefillReminderRead
from fastapi import HTTPException
from datetime import datetime

class RefillService:
    def get_upcoming_refills(self, session: Session, current_user: User):
        # Join with Customer and Medicine to get names
        query = select(RefillReminder, Customer, Medicine).join(
            Customer, Customer.id == RefillReminder.customer_id
        ).join(
            Medicine, Medicine.id == RefillReminder.medicine_id
        ).where(
            RefillReminder.tenant_id == current_user.tenant_id,
            RefillReminder.status == "pending"
        ).order_by(RefillReminder.next_refill_date.asc())
        
        results = session.exec(query).all()
        
        response = []
        for reminder, customer, medicine in results:
            response.append(RefillReminderRead(
                id=reminder.id,
                customer_id=reminder.customer_id,
                medicine_id=reminder.medicine_id,
                sale_id=reminder.sale_id,
                next_refill_date=reminder.next_refill_date,
                status=reminder.status,
                customer_name=customer.name,
                customer_phone=customer.phone,
                medicine_name=medicine.name,
                notes=reminder.notes,
                created_at=reminder.created_at
            ))
            
        return response
        
    def mark_sent(self, id: int, session: Session, current_user: User):
        reminder = session.exec(select(RefillReminder).where(
            RefillReminder.id == id, 
            RefillReminder.tenant_id == current_user.tenant_id
        )).first()
        
        if not reminder:
            raise HTTPException(status_code=404, detail="Reminder not found")
            
        reminder.status = "sent"
        reminder.updated_at = datetime.utcnow()
        session.add(reminder)
        session.commit()
        return {"ok": True}
