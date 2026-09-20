from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal
from datetime import datetime
from uuid import UUID

class PurchaseItemBase(BaseModel):
    medicine_id: int
    quantity: int
    unit_price: Decimal

    class Config:
        from_attributes = True

class PurchaseItemCreate(PurchaseItemBase):
    batch_number: Optional[str] = None   # If provided, stored on the ProductBatch
    expiry_date: Optional[datetime] = None  # Required to create a ProductBatch

class PurchaseItemRead(PurchaseItemBase):
    id: int
    total_price: Decimal
    medicine_name: str | None = None

    class Config:
        from_attributes = True

class PurchaseBase(BaseModel):
    total_amount: Decimal = Decimal("0.00")
    discount: Decimal = Field(default=Decimal("0.00"), ge=0)
    final_amount: Decimal
    payment_method: str = "cash" # cash, card, mobile_pay
    supplier_name: Optional[str] = None
    supplier_id: Optional[UUID] = None
    status: str = "Completed" # Draft, Completed, Cancelled
    supplier_contact: Optional[str] = None
    supplier_email: Optional[str] = None
    supplier_phone: Optional[str] = None
    expected_delivery: Optional[datetime] = None

class PurchaseCreate(PurchaseBase):
    items: List[PurchaseItemCreate]

class PurchaseUpdate(PurchaseBase):
    pass

class PurchaseRead(PurchaseBase):
    id: int
    created_at: datetime
    tenant_id: int
    user_id: str
    items: List[PurchaseItemRead]

    class Config:
        from_attributes = True

class PurchaseListResponse(BaseModel):
    items: List[PurchaseRead]
    total: int
    page: int
    page_size: int

class PurchaseFilter(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    user_id: Optional[str] = None
    supplier_name: Optional[str] = None
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = "desc"
    page: int = 1
    page_size: int = 10