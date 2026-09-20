from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, EmailStr
from uuid import UUID, uuid4

class SupplierRead(BaseModel):
    id: UUID
    company_name: str
    contact_person: str
    email: str
    phone: str
    address: str
    outstanding_balance: Decimal
    created_at : datetime
    updated_at : datetime

class SupplierCreate(BaseModel):
    company_name: str
    contact_person: str
    email: EmailStr
    phone: str
    address: str

class SupplierUpdate(BaseModel):
    company_name: str = None
    contact_person: str = None
    email: EmailStr = None
    phone: str = None
    address: str = None
