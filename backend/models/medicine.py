# 👉 Supplier should link to Purchase Order
# 👉 Purchase Order creates ProductBatch

from typing import Optional, List, TYPE_CHECKING
from sqlalchemy.sql import func
from sqlmodel import SQLModel, Field, Relationship, UUID
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

if TYPE_CHECKING:
    from models.tenant import Tenant
    from models.category import Category
    from models.supplier import Supplier
    from models.product_batch import ProductBatch
    from models.unit_conversion import UnitConversion

class Medicine(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    name: str = Field(index=True)
    description: str | None = Field(default=None)

    # The atomic/smallest unit (e.g. "tablet", "ml", "capsule")
    base_unit: str = Field(default="unit", max_length=50)

    # Legacy unit field kept for backward compatibility; use base_unit going forward
    unit: str = Field(..., max_length=50)  # tablet, bottle, strip, box

    quantity: int = Field(..., ge=0)  # total quantity in base_unit
    purchase_price: Decimal
    selling_price: Decimal

    # Scan-ready fields
    barcode: str | None = Field(default=None, index=True)
    sku: str | None = Field(default=None, index=True)

    # Phase 2 Fields
    generic_salt: str | None = Field(default=None, max_length=255, index=True)
    reorder_level: int = Field(default=0, ge=0)
    target_max_stock: int = Field(default=0, ge=0)

    # Phase 3 Fields
    is_narcotic: bool = Field(default=False)
    prescription_required: bool = Field(default=False)

    is_active: bool = Field(default=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    category_id: int | None = Field(default=None, index=True, foreign_key="category.id")
    supplier_id: UUID | None = Field(default=None, foreign_key="supplier.id")
    tenant_id: int = Field(index=True, foreign_key="tenant.id")

    # Relationships
    tenant: Optional["Tenant"] = Relationship(back_populates="medicines")
    category: Optional["Category"] = Relationship(back_populates="medicines")
    supplier: Optional["Supplier"] = Relationship(back_populates="medicines")
    batches: List["ProductBatch"] = Relationship(back_populates="medicine")
    unit_conversions: List["UnitConversion"] = Relationship()

    

