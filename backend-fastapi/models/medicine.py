# 👉 Supplier should link to Purchase Order
# 👉 Purchase Order creates ProductBatch

from typing import Optional
from sqlalchemy.sql import func
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from decimal import Decimal

class Medicine(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    name: str = Field(index=True)
    description: str | None = Field(default=None)

    unit: str = Field(..., max_length=50)  # tablet, bottle, strip, box
    quantity: int = Field(..., ge=0)
    purchase_price: Decimal 
    selling_price: Decimal 
    category: Optional[str] = Field(default=None)

    is_active: bool = Field(default=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # category_id: int = Field(index=True, foreign_key="category.id")
    tenant_id: int = Field(index=True, foreign_key="tenant.id")
    
    # sku: str | None = Field(default=None, unique=True)
    # barcode: str | None = Field(default=None, unique=True)

    # Relationships
    # category: "Category" = Relationship(back_populates="products")
    # batches: list["ProductBatch"] | None = Relationship(back_populates="product")
    

