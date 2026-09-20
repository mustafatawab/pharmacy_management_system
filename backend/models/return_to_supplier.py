from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from decimal import Decimal
from uuid import UUID

class ReturnToSupplier(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    supplier_id: UUID = Field(foreign_key="supplier.id")
    tenant_id: int = Field(index=True, foreign_key="tenant.id")
    user_id: UUID = Field(foreign_key="user.id")
    
    total_amount: Decimal
    reason: str | None = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    items: List["ReturnToSupplierItem"] = Relationship(back_populates="return_order")


class ReturnToSupplierItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    return_id: int = Field(foreign_key="returntosupplier.id")
    batch_id: int = Field(foreign_key="productbatch.id")
    
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    
    # Relationships
    return_order: Optional[ReturnToSupplier] = Relationship(back_populates="items")
