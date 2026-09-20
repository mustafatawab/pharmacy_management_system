from sqlmodel import Session, select
from models.customer import Customer
from models.customer_ledger import CustomerLedger
from models.users import User
from schemas.customer_schema import CustomerCreate, CustomerUpdate, CustomerPaymentRequest
from fastapi import HTTPException
from decimal import Decimal
from datetime import datetime

class CustomerService:
    def get_all(self, session: Session, current_user: User):
        return session.exec(select(Customer).where(Customer.tenant_id == current_user.tenant_id)).all()
        
    def get_by_id(self, id: int, session: Session, current_user: User):
        customer = session.exec(select(Customer).where(Customer.id == id, Customer.tenant_id == current_user.tenant_id)).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer
        
    def create(self, data: CustomerCreate, session: Session, current_user: User):
        new_customer = Customer(
            **data.model_dump(),
            tenant_id=current_user.tenant_id
        )
        session.add(new_customer)
        session.commit()
        session.refresh(new_customer)
        return new_customer
        
    def update(self, id: int, data: CustomerUpdate, session: Session, current_user: User):
        customer = self.get_by_id(id, session, current_user)
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(customer, key, value)
        customer.updated_at = datetime.utcnow()
        session.add(customer)
        session.commit()
        session.refresh(customer)
        return customer
        
    def delete(self, id: int, session: Session, current_user: User):
        customer = self.get_by_id(id, session, current_user)
        session.delete(customer)
        session.commit()
        return {"ok": True}
        
    def get_ledger(self, id: int, session: Session, current_user: User):
        return session.exec(
            select(CustomerLedger).where(
                CustomerLedger.customer_id == id,
                CustomerLedger.tenant_id == current_user.tenant_id
            ).order_by(CustomerLedger.created_at.desc())
        ).all()
        
    def record_payment(self, id: int, payment: CustomerPaymentRequest, session: Session, current_user: User):
        customer = self.get_by_id(id, session, current_user)
        
        customer.outstanding_balance -= payment.amount
        
        ledger_entry = CustomerLedger(
            customer_id=customer.id,
            tenant_id=current_user.tenant_id,
            reference_type="payment",
            debit=Decimal("0.00"),
            credit=payment.amount,
            balance_after=customer.outstanding_balance,
            notes=payment.notes or f"Payment via {payment.payment_method}"
        )
        
        session.add(customer)
        session.add(ledger_entry)
        session.commit()
        session.refresh(ledger_entry)
        
        return ledger_entry
