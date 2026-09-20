from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    credit_limit: Optional[Decimal] = Decimal("0.00")

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    credit_limit: Optional[Decimal] = None

class CustomerRead(CustomerBase):
    id: int
    outstanding_balance: Decimal
    created_at: datetime
    updated_at: datetime
    tenant_id: int

    class Config:
        from_attributes = True

class CustomerPaymentRequest(BaseModel):
    amount: Decimal
    notes: Optional[str] = None
    payment_method: Optional[str] = "cash"
    
class CustomerLedgerRead(BaseModel):
    id: int
    customer_id: int
    reference_type: str
    reference_id: Optional[int] = None
    debit: Decimal
    credit: Decimal
    balance_after: Decimal
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
