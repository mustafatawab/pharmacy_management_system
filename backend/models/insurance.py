from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from decimal import Decimal

class InsurancePanelBase(SQLModel):
    name: str
    discount_percentage: float = Field(default=0.0) # 0 to 100
    tenant_id: int = Field(foreign_key="tenant.id")

class InsurancePanel(InsurancePanelBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    receivable_balance: Decimal = Field(default=Decimal("0.00"), max_digits=15, decimal_places=2)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InsuranceLedgerBase(SQLModel):
    panel_id: int = Field(foreign_key="insurancepanel.id")
    reference_type: str = Field(...) # "sale", "payment"
    reference_id: Optional[int] = None
    debit: Decimal = Field(default=Decimal("0.00"), max_digits=15, decimal_places=2) # added to balance (amount billed to insurance)
    credit: Decimal = Field(default=Decimal("0.00"), max_digits=15, decimal_places=2) # subtracted from balance (payment received)
    balance_after: Decimal = Field(default=Decimal("0.00"), max_digits=15, decimal_places=2)
    tenant_id: int = Field(foreign_key="tenant.id")
    notes: Optional[str] = None

class InsuranceLedger(InsuranceLedgerBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
