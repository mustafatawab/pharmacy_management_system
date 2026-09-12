from typing import List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

if TYPE_CHECKING:
    from models.users import User
    from models.medicine import Medicine
    from models.category import Category
    from models.supplier import Supplier

class Tenant(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(description="Name of the Pharmacy")
    address: str = Field(description="Address of the Pharmacy")
    city: str = Field(description="City of the Pharmacy", default="")
    phone: str = Field(unique=True, description="Phone number of the Pharmacy")
    email: str = Field(unique=True, description="Email address of the Pharmacy")
    # logo_url: str | None = Field(default=None, description="Logo URL or base64 of the Pharmacy")
    
    timezone: str = "Asia/Karachi"
    currency: str = "PKR"

    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    # Relationships
    users: List["User"] = Relationship(back_populates="tenant")
    medicines: List["Medicine"] = Relationship(back_populates="tenant")
    categories: List["Category"] = Relationship(back_populates="tenant")
    suppliers: List["Supplier"] = Relationship(back_populates="tenant")
    

    