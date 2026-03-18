from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from enum import Enum
from uuid import UUID, uuid4

if TYPE_CHECKING:
    from models.tenant import Tenant

class UserRole(str , Enum):
    ADMIN = "admin"
    STAFF = "staff"

class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    full_name: str = Field(min_length=6)
    username: str = Field(min_length=6 , unique=True)
    hashed_password: str = Field(min_length=6)
    created_at : datetime = Field(default=datetime.utcnow())
    updated_at : datetime = Field(default=datetime.utcnow())
    role: UserRole = Field(default=UserRole.STAFF)
    is_active: bool = Field(default=True)

    tenant_id : int | None = Field(default=None, foreign_key="tenant.id")

    # Relationship
    tenant: Optional["Tenant"] = Relationship(back_populates="users")







