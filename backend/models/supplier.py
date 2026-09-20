from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from decimal import Decimal

if TYPE_CHECKING:
    from models.tenant import Tenant
    from models.medicine import Medicine

class Supplier(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4 , primary_key=True)
    company_name: str
    contact_person: str
    email: str = Field(index=True, unique=True)
    phone: str = Field(index=True, unique=True)
    address: str
    outstanding_balance: Decimal = Field(default=Decimal("0.00"))
    created_at : datetime = Field(default_factory=datetime.utcnow)
    updated_at : datetime = Field(default_factory=datetime.utcnow)

    tenant_id: int = Field(index=True, foreign_key="tenant.id")

    tenant: Optional["Tenant"] = Relationship(back_populates="suppliers")
    medicines: list["Medicine"] = Relationship(back_populates="supplier")