from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    ful_name: str
    email: EmailStr
    username: str
    password : str


class UserLogin(BaseModel):
    username: str
    password: str

    