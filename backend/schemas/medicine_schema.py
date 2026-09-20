from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime
from uuid import UUID
from schemas.category_schema import CategoryRead
from schemas.supplier_schema import SupplierRead


class MedicineCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    base_unit: str = Field(default="unit", max_length=50)  # smallest unit: tablet, ml, capsule
    unit: str = Field(..., max_length=50)                   # legacy / display unit
    quantity: int = Field(..., ge=0)
    selling_price: Decimal
    purchase_price: Decimal
    is_active: bool = False
    barcode: Optional[str] = None
    sku: Optional[str] = None
    generic_salt: Optional[str] = None
    reorder_level: int = 0
    target_max_stock: int = 0
    category_id: Optional[int] = None
    supplier_id: Optional[UUID] = None


class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    base_unit: Optional[str] = None
    unit: Optional[str] = None
    quantity: Optional[int] = None
    selling_price: Optional[Decimal] = None
    purchase_price: Optional[Decimal] = None
    is_active: Optional[bool] = None
    barcode: Optional[str] = None
    sku: Optional[str] = None
    generic_salt: Optional[str] = None
    reorder_level: Optional[int] = None
    target_max_stock: Optional[int] = None
    category_id: Optional[int] = None
    supplier_id: Optional[UUID] = None


class MedicineRead(BaseModel):
    id: int
    name: str
    description: Optional[str]
    base_unit: str
    unit: str
    quantity: int
    selling_price: Decimal
    purchase_price: Decimal
    is_active: bool = False
    barcode: Optional[str] = None
    sku: Optional[str] = None
    generic_salt: Optional[str] = None
    reorder_level: int = 0
    target_max_stock: int = 0
    category_id: Optional[int] = None
    supplier_id: Optional[UUID] = None
    category: Optional[CategoryRead] = None
    supplier: Optional["SupplierRead"] = None
    tenant_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MedicineListResponse(BaseModel):
    items: list[MedicineRead]
    total: int
    page: int
    page_size: int


class MedicineFilter(BaseModel):
    search: Optional[str] = None
    barcode: Optional[str] = None          # For barcode scanner lookup
    category_id: Optional[int] = None
    is_active: Optional[bool] = None
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    sort_by: Optional[str] = "name"        # name, price, quantity, created_at
    sort_order: Optional[str] = "asc"      # asc, desc
    page: int = 1
    page_size: int = 10


