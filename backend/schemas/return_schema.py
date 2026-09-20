from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
from uuid import UUID

class ReturnToSupplierItemBase(BaseModel):
    batch_id: int
    quantity: int = Field(..., gt=0)
    unit_price: Decimal
    
class ReturnToSupplierItemCreate(ReturnToSupplierItemBase):
    pass

class ReturnToSupplierItemRead(ReturnToSupplierItemBase):
    id: int
    return_id: int
    total_price: Decimal
    
    class Config:
        from_attributes = True

class ReturnToSupplierBase(BaseModel):
    supplier_id: UUID
    reason: Optional[str] = None

class ReturnToSupplierCreate(ReturnToSupplierBase):
    items: List[ReturnToSupplierItemCreate]

class ReturnToSupplierRead(ReturnToSupplierBase):
    id: int
    total_amount: Decimal
    tenant_id: int
    user_id: UUID
    created_at: datetime
    items: List[ReturnToSupplierItemRead]
    
    class Config:
        from_attributes = True
