from pydantic import BaseModel
from datetime import datetime


class TenantCreate(BaseModel):
    name: str
    address: str
    city: str = ""
    phone: str
    email: str
    # logo_url: str | None = None
    timezone: str = "Asia/Karachi"
    currency: str = "PKR"
    is_active: bool = True


class TenantUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    city: str | None = None
    phone: str | None = None
    email: str | None = None
    # logo_url: str | None = None
    timezone: str | None = None
    currency: str | None = None
    is_active: bool | None = None


class TenantRead(BaseModel):
    id: int
    name: str
    address: str
    city: str
    phone: str
    email: str
    # logo_url: str | None
    timezone: str
    currency: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
