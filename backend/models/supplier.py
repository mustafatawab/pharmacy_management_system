from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime


class Supplier(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4 , primary_key=True)
    company_name: str
    contact_person: str
    email: str = Field(index=True, unique=True)
    phone: str = Field(index=True, unique=True)
    address: str
    created_at : str = Field(default=str(datetime.utcnow()))
    updated_at : str = Field(default=str(datetime.utcnow()))