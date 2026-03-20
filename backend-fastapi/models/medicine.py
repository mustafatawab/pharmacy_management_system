# 👉 Supplier should link to Purchase Order
# 👉 Purchase Order creates ProductBatch

from typing import Optional, TYPE_CHECKING
from sqlalchemy.sql import func
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from decimal import Decimal

# if TYPE_CHECKING:
#     from models.tenant import Tenant
#     from models.category import Category
#     from models.product_batch import ProductBatch

class Medicine(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    name: str = Field(index=True)
    description: str | None = Field(default=None)

    unit: str = Field(..., max_length=50)  # tablet, bottle, strip, box
    quantity: int = Field(..., ge=0)
    purchase_price: Decimal 
    selling_price: Decimal 
    # category: Optional[str] = Field(default=None)

    is_active: bool = Field(default=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    category_id: int | None = Field(default=None, index=True, foreign_key="category.id")
    tenant_id: int = Field(index=True, foreign_key="tenant.id")
    
    # sku: str | None = Field(default=None, unique=True)
    # barcode: str | None = Field(default=None, unique=True)

    # Relationships
    tenant: Optional["Tenant"] = Relationship(back_populates="medicines")
    category: Optional["Category"] = Relationship(back_populates="medicines")
    batches: list["ProductBatch"] = Relationship(back_populates="medicine")
    

