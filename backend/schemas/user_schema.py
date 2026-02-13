from pydantic import BaseModel, EmailStr
from models.users import UserRole
from uuid import UUID

class UserCreate(BaseModel):
    full_name: str
    username: str
    password : str
    role : UserRole = UserRole.STAFF

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

