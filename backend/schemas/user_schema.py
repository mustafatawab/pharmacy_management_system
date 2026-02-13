from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    username: str
    password : str


class UserLogin(BaseModel):
    username: str
    password: str

    