from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
from uuid import UUID

class SupplierLedgerBase(BaseModel):
    supplier_id: UUID
    reference_type: str
    reference_id: Optional[int] = None
    debit: Decimal = Decimal("0.00")
    credit: Decimal = Decimal("0.00")
    notes: Optional[str] = None

class SupplierLedgerCreate(SupplierLedgerBase):
    pass

class SupplierLedgerRead(SupplierLedgerBase):
    id: int
    balance_after: Decimal
    tenant_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class SupplierPaymentRequest(BaseModel):
    amount: Decimal = Field(..., gt=0)
    notes: Optional[str] = None
    payment_method: str = "cash"
