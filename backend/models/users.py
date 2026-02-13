from sqlmodel import SQLModel, Field
from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from enum import Enum
from uuid import UUID, uuid4

class UserRole(str , Enum):
    ADMIN = "admin"
    STAFF = "staff"

class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    full_name: str = Field(min_length=6)
    username: str = Field(min_length=6 , unique=True)
    hashed_password: str = Field(min_length=6)
    created_at : str = Field(default=str(datetime.utcnow()))
    updated_at : str = Field(default=str(datetime.utcnow()))
    role: UserRole = Field(default=UserRole.STAFF)
    is_active: bool = Field(default=True)








