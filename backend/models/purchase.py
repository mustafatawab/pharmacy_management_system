from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from decimal import Decimal
from uuid import UUID

if TYPE_CHECKING:
    from models.tenant import Tenant
    from models.users import User
    from models.medicine import Medicine

class Purchase(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    total_amount: Decimal
    discount: Decimal = Field(default=Decimal("0.00"))
    final_amount: Decimal
    payment_method: str = Field(default="cash") # cash, card, mobile_pay
    
    supplier_name: str
    supplier_contact: str | None = None
    supplier_email: str | None = None
    supplier_phone: str | None = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expected_delivery: datetime | None = None
    
    # Foreign Keys
    tenant_id: int = Field(index=True, foreign_key="tenant.id")
    user_id: UUID = Field(foreign_key="user.id")  # Fixed: UUID instead of str
    
    # Relationships
    items: List["PurchaseItem"] = Relationship(back_populates="purchase")
    # user: Optional["User"] = Relationship()
    # tenant: Optional["Tenant"] = Relationship()

class PurchaseItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    purchase_id: int = Field(foreign_key="purchase.id")
    medicine_id: int = Field(foreign_key="medicine.id")
    
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    
    # Relationships
    purchase: Optional[Purchase] = Relationship(back_populates="items")
    # medicine: Optional["Medicine"] = Relationship()