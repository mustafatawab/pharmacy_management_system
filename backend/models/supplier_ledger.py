from sqlmodel import SQLModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime
from uuid import UUID

class SupplierLedger(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    supplier_id: UUID = Field(index=True, foreign_key="supplier.id")
    tenant_id: int = Field(index=True, foreign_key="tenant.id")
    
    # Types: "purchase" (increases owed amount), "payment" (decreases), "return" (decreases)
    reference_type: str = Field(max_length=50)
    reference_id: int | None = Field(default=None) # Purchase ID, Return ID, or Payment ID
    
    # Financials
    debit: Decimal = Field(default=Decimal("0.00"), description="Amount we owe (e.g. Purchase)")
    credit: Decimal = Field(default=Decimal("0.00"), description="Amount paid or returned")
    balance_after: Decimal = Field(description="Running balance after this transaction")
    
    notes: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
