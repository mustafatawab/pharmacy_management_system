from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from decimal import Decimal
from uuid import UUID

if TYPE_CHECKING:
    from models.tenant import Tenant
    from models.users import User
    from models.medicine import Medicine

class Sale(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    total_amount: Decimal
    discount: Decimal = Field(default=Decimal("0.00"))
    final_amount: Decimal
    payment_method: str = Field(default="cash") # cash, card, mobile_pay
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign Keys
    tenant_id: int = Field(index=True, foreign_key="tenant.id")
    user_id: UUID = Field(foreign_key="user.id")
    
    # Relationships
    items: List["SaleItem"] = Relationship(back_populates="sale")
    # user: Optional["User"] = Relationship()

class SaleItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    sale_id: int = Field(foreign_key="sale.id")
    medicine_id: int = Field(foreign_key="medicine.id")
    
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    
    # Relationships
    sale: Optional[Sale] = Relationship(back_populates="items")
    # medicine: Optional["Medicine"] = Relationship()
