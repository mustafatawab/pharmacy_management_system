from sqlalchemy import UUID
from sqlmodel import select
from fastapi import Depends, HTTPException
from sqlmodel import SQLModel, Session, select
from database import get_session
from models.users import User
from schemas.user_schema import UserCreate, UserUpdate, UserRead, UserRegister, UserLogin
from auth.security import hash_password, verify_password, create_access_token
from service.auth_service import AuthService
from auth.dependency import get_current_user


class UserService:

    def __init__(self):
        self.auth_service = AuthService()

    def get_all_user(self, session: Session , current_user: User) -> list[UserRead]:

        users =  session.exec(select(User).where(User.tenant_id == current_user.tenant_id)).all()
        return users

    def create_user(self, user: UserCreate, session: Session , current_user: User) -> UserRead:

        if not current_user.tenant_id:
            raise HTTPException(status_code=400, detail="You must create a pharmacy first.")
        
        existing_user =  self.auth_service.existing_user(user.username, session)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        add_user = User(full_name=user.full_name, username=user.username, hashed_password=hash_password(user.password), tenant_id=current_user.tenant_id)
        session.add(add_user)
        session.commit()
        session.refresh(add_user)
        return add_user


    async def get_user_by_id(self, id: UUID, session: Session, current_user: User) -> UserRead:
        user = await session.exec(select(User).where(User.id == id, User.tenant_id == current_user.tenant_id)).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    

    async def update_user(self, id: UUID, update_user: UserUpdate, session: Session = Depends(get_session)) -> UserRead:
        user = await self.get_user_by_id(id=id, session=session)

        user.full_name = update_user.full_name or user.full_name
        user.username = update_user.username or user.username
        user.hashed_password = hash_password(update_user.password) or user.hashed_password 
        user.is_active = update_user.is_active 
        
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
        
    

    async def delete_user(self, id: UUID, session: Session = Depends(get_session)) -> UserRead:
        user = await self.get_user_by_id(id=id, session=session)

        if user.role == "admin":
            raise HTTPException(status_code=400, detail="Admin cannot be deleted")

        session.delete(user)
        session.commit()
        return user