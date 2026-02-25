from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal


class ProductBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    category_id: int
    unit: str = Field(..., max_length=50)  # tablet, bottle, strip, box
    quantity: int = Field(..., ge=0)
    selling_price: Decimal
    purchase_price: Decimal
    is_active: bool = True


    # sku: Optional[str] = Field(None, max_length=100)
    # barcode: Optional[str] = Field(None, max_length=100)


class ProductCreate(ProductBase):
    name: str
    generic_name: str
    description: str
    unit: str = Field(default="tablet", max_length=50 )
    quantity: int = Field(..., ge=0)
    selling_price: Decimal
    purchase_price: Decimal
    is_active: bool

    
    # category_id: int
    # sku: str | None = None
    # barcode: str | None = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    unit: Optional[str] = None
    quantity: Optional[int] = None
    selling_price: Optional[Decimal] = None
    purchase_price: Optional[Decimal] = None
    is_active: Optional[bool] = None

    # sku: Optional[str] = None
    # barcode: Optional[str] = None

from datetime import datetime


class ProductRead(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
    

class ProductListResponse(BaseModel):
    items: list[ProductRead]
    total: int
    page: int
    page_size: int



class ProductFilter(BaseModel):
    search: Optional[str] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = True
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None

