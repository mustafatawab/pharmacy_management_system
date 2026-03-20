from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

# if TYPE_CHECKING:
#     from models.tenant import Tenant
#     from models.medicine import Medicine

class Category(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    name: str = Field(index=True)
    description: str | None = Field(default=None)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    medicines: list["Medicine"] = Relationship(back_populates="category")

    tenant_id: int = Field(index=True, foreign_key="tenant.id")

    tenant: Optional["Tenant"] = Relationship(back_populates="categories")
    