from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal


class ProductBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    
    category_id: int
    
    sku: Optional[str] = Field(None, max_length=100)
    barcode: Optional[str] = Field(None, max_length=100)

    unit: str = Field(..., max_length=50)  # tablet, bottle, strip, box
    
    selling_price: Decimal
    purchase_price: Decimal
    
    is_active: bool = True


class ProductCreate(ProductBase):
    name: str
    generic_name: str
    description: str
    # category_id: int
    sku: str | None = None
    barcode: str | None = None
    unit: str = Field(default="tablet", max_length=50 )
    selling_price: Decimal
    purchase_price: Decimal
    is_active: bool


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    sku: Optional[str] = None
    barcode: Optional[str] = None
    unit: Optional[str] = None
    selling_price: Optional[Decimal] = None
    purchase_price: Optional[Decimal] = None
    is_active: Optional[bool] = None

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

