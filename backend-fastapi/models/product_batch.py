from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

if TYPE_CHECKING:
    from models.medicine import Medicine

class ProductBatch(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    medicine_id: int = Field(index=True, foreign_key="medicine.id")
    batch_number: str = Field(index=True)


    quantity: int
    expiry_date: datetime

    purchase_price: Decimal

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    medicine: Optional["Medicine"] = Relationship(back_populates="batches")
    