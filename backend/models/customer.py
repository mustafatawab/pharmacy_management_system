from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from decimal import Decimal

if TYPE_CHECKING:
    from models.tenant import Tenant

class Customer(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    phone: str | None = Field(default=None, index=True)
    address: str | None = Field(default=None)
    
    credit_limit: Decimal = Field(default=Decimal("0.00"))
    outstanding_balance: Decimal = Field(default=Decimal("0.00"))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    tenant_id: int = Field(index=True, foreign_key="tenant.id")
    
    # Relationships
    tenant: Optional["Tenant"] = Relationship()
