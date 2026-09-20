from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from decimal import Decimal

if TYPE_CHECKING:
    from models.tenant import Tenant
    from models.customer import Customer

class CustomerLedger(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    customer_id: int = Field(foreign_key="customer.id", index=True)
    tenant_id: int = Field(foreign_key="tenant.id", index=True)
    
    # Types: "sale" (increases balance/debit for customer), "payment" (decreases balance/credit)
    reference_type: str 
    reference_id: int | None = Field(default=None) # e.g. sale_id
    
    debit: Decimal = Field(default=Decimal("0.00"))  # Amount added to their debt (Sales)
    credit: Decimal = Field(default=Decimal("0.00")) # Amount paid by customer (Payments)
    balance_after: Decimal
    
    notes: str | None = Field(default=None)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    tenant: Optional["Tenant"] = Relationship()
