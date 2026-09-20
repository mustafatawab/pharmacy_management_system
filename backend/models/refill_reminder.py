from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

if TYPE_CHECKING:
    from models.tenant import Tenant
    from models.customer import Customer
    from models.medicine import Medicine

class RefillReminder(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    customer_id: int = Field(foreign_key="customer.id", index=True)
    medicine_id: int = Field(foreign_key="medicine.id")
    sale_id: int | None = Field(default=None, foreign_key="sale.id")
    tenant_id: int = Field(foreign_key="tenant.id", index=True)
    
    next_refill_date: datetime = Field(index=True)
    status: str = Field(default="pending") # pending, sent, cancelled, refilled
    
    notes: str | None = Field(default=None)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    tenant: Optional["Tenant"] = Relationship()
