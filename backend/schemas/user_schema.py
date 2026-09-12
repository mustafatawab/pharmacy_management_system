from pydantic import BaseModel, EmailStr
from models.users import UserRole
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    username: str
    password : str

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    username: str
    password : str
    is_active : bool

class UserLogin(BaseModel):
    login: str # Can be username or email
    password: str

class UserRead(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime
    tenant_id: int | None = None


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordConfirm(BaseModel):
    token: str
    new_password: str
