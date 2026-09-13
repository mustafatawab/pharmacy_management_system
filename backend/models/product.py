from typing import Optional, TYPE_CHECKING
from sqlalchemy.sql import func
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

if TYPE_CHECKING:
    from models.tenant import Tenant
    from models.category import Category
    from models.supplier import Supplier
    from models.sale import SaleItem

class Product(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    name: str = Field(index=True)
    description: str | None = Field(default=None)

    unit: str = Field(..., max_length=50)  # tablet, bottle, strip, box, liter, kg, piece, etc.
    quantity: int = Field(..., ge=0)
    purchase_price: Decimal 
    selling_price: Decimal 

    is_active: bool = Field(default=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    category_id: int | None = Field(default=None, index=True, foreign_key="category.id")
    supplier_id: UUID | None = Field(default=None, foreign_key="supplier.id")
    tenant_id: int = Field(index=True, foreign_key="tenant.id")
    
    # sku: str | None = Field(default=None, unique=True)
    # barcode: str | None = Field(default=None, unique=True)

    # Relationships
    tenant: Optional["Tenant"] = Relationship(back_populates="products")
    category: Optional[Category] = Relationship(back_populates="products")
    supplier: Optional["Supplier"] = Relationship(back_populates="products")
    # sale_items: list[SaleItem] = Relationship(back_populates="product")