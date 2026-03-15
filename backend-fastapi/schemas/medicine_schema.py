from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime


class MedicineCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    category: str
    unit: str = Field(..., max_length=50)  # tablet, bottle, strip, box
    quantity: int = Field(..., ge=0)
    selling_price: Decimal
    purchase_price: Decimal
    is_active: bool = False


    # sku: Optional[str] = Field(None, max_length=100)
    # barcode: Optional[str] = Field(None, max_length=100)




class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    quantity: Optional[int] = None
    selling_price: Optional[Decimal] = None
    purchase_price: Optional[Decimal] = None
    is_active: Optional[bool] = None

    # sku: Optional[str] = None
    # barcode: Optional[str] = None



class MedicineRead(BaseModel):
    id: int
    name: str 
    description: Optional[str] 
    category: str
    unit: str 
    quantity: int 
    selling_price: Decimal
    purchase_price: Decimal
    is_active: bool = False
    created_at: datetime
    updated_at: datetime

    

class MedicineListResponse(BaseModel):
    items: list[MedicineRead]
    total: int
    page: int
    page_size: int



class MedicineFilter(BaseModel):
    search: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = True
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None

