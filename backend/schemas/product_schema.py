from pydantic import BaseModel, Field
from typing import Optional, Union
from decimal import Decimal
from datetime import datetime
from uuid import UUID, uuid4
from schemas.category_schema import CategoryRead
from schemas.supplier_schema import SupplierRead

class ProductCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    unit: str = Field(..., max_length=50)  # tablet, bottle, strip, box, liter, kg, piece, etc.
    quantity: int = Field(..., ge=0)
    selling_price: Decimal
    purchase_price: Decimal
    is_active: bool = False
    category_id: Optional[int] = None
    supplier_id: Optional[UUID] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    unit: Optional[str] = None
    quantity: Optional[int] = None
    selling_price: Optional[Decimal] = None
    purchase_price: Optional[Decimal] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None   
    supplier_id: Optional[UUID] = None   


class ProductRead(BaseModel):
    id: int
    name: str 
    description: Optional[str] 
    unit: str 
    quantity: int 
    selling_price: Decimal
    purchase_price: Decimal
    is_active: bool = False
    category_id: Optional[int] = None
    category: Optional[CategoryRead] = None
    supplier_id: Optional[UUID] = None
    supplier: Optional[SupplierRead] = None
    tenant_id: int
    created_at: datetime
    updated_at: datetime


class ProductListResponse(BaseModel):
    items: list[ProductRead]
    total: int
    page: int
    page_size: int


class ProductFilter(BaseModel):
    search: Optional[str] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    sort_by: Optional[str] = "name" # name, price, quantity, created_at
    sort_order: Optional[str] = "asc" # asc, desc
    page: int = 1
    page_size: int = 10