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

    def get_all_user(self, session: Session, current_user: User) -> list[User]:
        users = session.exec(select(User).where(User.tenant_id == current_user.tenant_id)).all()
        return users

    def create_user(self, user_data: UserCreate, session: Session, current_user: User) -> User:
        existing_user = self.auth_service.existing_user(user_data.username, session)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        add_user = User(
            full_name=user_data.full_name, 
            username=user_data.username, 
            hashed_password=hash_password(user_data.password), 
            tenant_id=current_user.tenant_id, 
            role="staff"
        )
        session.add(add_user)
        session.commit()
        session.refresh(add_user)
        return add_user

    def get_user_by_id(self, id: UUID, session: Session, current_user: User) -> User:
        user = session.exec(select(User).where(User.id == id, User.tenant_id == current_user.tenant_id)).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def update_user(self, id: UUID, update_user_data: UserUpdate, session: Session, current_user: User) -> User:
        user = self.get_user_by_id(id=id, session=session, current_user=current_user)

        if update_user_data.full_name:
            user.full_name = update_user_data.full_name
        if update_user_data.username:
            user.username = update_user_data.username
        if update_user_data.password:
            user.hashed_password = hash_password(update_user_data.password)

        user.is_active = update_user_data.is_active 

        session.add(user)
        session.commit()
        session.refresh(user)
        return user

    def delete_user(self, id: UUID, session: Session, current_user: User) -> User:
        user = self.get_user_by_id(id=id, session=session, current_user=current_user)

        if user.role == "admin":
            raise HTTPException(status_code=400, detail="Admin cannot be deleted")

        session.delete(user)
        session.commit()
        return user