from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal
from datetime import datetime
from uuid import UUID

class SaleItemBase(BaseModel):
    medicine_id: int
    quantity: int
    unit_price: Decimal

class SaleItemCreate(SaleItemBase):
    pass

class SaleItemRead(SaleItemBase):
    id: int
    total_price: Decimal
    
    class Config:
        from_attributes = True

class SaleBase(BaseModel):
    total_amount: Decimal
    discount: Decimal = Decimal("0.00")
    final_amount: Decimal
    payment_method: str = "cash"

class SaleCreate(SaleBase):
    items: List[SaleItemCreate]

class SaleRead(SaleBase):
    id: int
    created_at: datetime
    user_id: UUID
    tenant_id: int
    items: List[SaleItemRead]

    class Config:
        from_attributes = True

class SaleListResponse(BaseModel):
    items: List[SaleRead]
    total: int
    page: int
    page_size: int

class SaleFilter(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    user_id: Optional[UUID] = None
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = "desc"
    page: int = 1
    page_size: int = 10
