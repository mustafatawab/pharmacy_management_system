from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class Category(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    name: str = Field(index=True)
    description: str | None = Field(default=None)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    products: list["Product"] = Relationship(back_populates="category")

    tenant_id: int = Field(index=True, foreign_key="tenant.id")

    # tenant: "Tenant" = Relationship(back_populates="categories")
    