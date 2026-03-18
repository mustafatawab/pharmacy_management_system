from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime

if TYPE_CHECKING:
    from models.tenant import Tenant

class Supplier(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4 , primary_key=True)
    company_name: str
    contact_person: str
    email: str = Field(index=True, unique=True)
    phone: str = Field(index=True, unique=True)
    address: str
    created_at : datetime = Field(default=datetime.utcnow())
    updated_at : datetime = Field(default=datetime.utcnow())

    tenant_id: int = Field(index=True, foreign_key="tenant.id")

    tenant: Optional["Tenant"] = Relationship(back_populates="suppliers")