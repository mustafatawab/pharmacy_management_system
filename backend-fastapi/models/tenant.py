from sqlmodel import SQLModel, Field
from datetime import datetime

class Tenant(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(description="Name of the Pharmacy")
    address: str = Field(description="Address of the Pharmacy")
    phone: str = Field(description="Phone number of the Pharmacy")
    email: str = Field(description="Email address of the Pharmacy")
    
    timezone: str = "Asia/Karachi"
    currency: str = "PKR"

    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    

    