from pydantic import BaseModel, EmailStr
from models.users import UserRole
from uuid import UUID

class UserRegister(BaseModel):
    full_name: str
    username: str
    password : str
    role : UserRole = UserRole.STAFF


class UserCreate(BaseModel):
    full_name: str
    username: str
    password : str
    role : UserRole = UserRole.STAFF
    is_active : bool

class UserLogin(BaseModel):
    username: str
    password: str


class UserRead(BaseModel):
    id: UUID
    username: str
    full_name: str
    role: UserRole
    is_active: bool
    created_at: str
    updated_at: str


class UserUpdate(BaseModel):
    full_name: str = None
    username: str = None
    password : str = None
    role : UserRole = None
    is_active : bool = None
