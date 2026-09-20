from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone

class StockTransferBase(SQLModel):
    from_tenant_id: int = Field(foreign_key="tenant.id")
    to_tenant_id: int = Field(foreign_key="tenant.id")
    status: str = Field(default="pending") # pending, shipped, received, cancelled
    notes: Optional[str] = None

class StockTransfer(StockTransferBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_by: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    items: List["StockTransferItem"] = Relationship(back_populates="transfer")

class StockTransferItemBase(SQLModel):
    transfer_id: int = Field(foreign_key="stocktransfer.id")
    medicine_barcode: str
    medicine_name: str
    quantity: int

class StockTransferItem(StockTransferItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    transfer: StockTransfer = Relationship(back_populates="items")
