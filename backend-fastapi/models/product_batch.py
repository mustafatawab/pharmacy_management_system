from decimal import Decimal
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class ProductBatch(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    product_id: int = Field(index=True, foreign_key="product.id")
    batch_number: str = Field(index=True)


    quantity: int
    expiry_date: datetime 

    purchase_price: Decimal

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    