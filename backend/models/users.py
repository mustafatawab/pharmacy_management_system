from sqlmodel import SQLModel, Field
from pydantic import BaseModel, EmailStr


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    full_name: str = Field(min_length=6)
    username: str = Field(min_length=6 , unique=True)
    email: EmailStr = Field(unique=True)
    hashed_password: str = Field(min_length=6)

