from sqlmodel import select, or_
from fastapi import Depends, HTTPException
from sqlmodel import Session
from models.users import User
from schemas.user_schema import UserRegister, UserLogin
from auth.security import (
    hash_password, 
    verify_password, 
    create_access_token, 
    create_refresh_token, 
    create_reset_token, 
    decode_reset_token
)
from service.email_service import EmailService
from uuid import UUID
from datetime import datetime

class AuthService:

    def get_user_by_id(self, user_id: UUID, session: Session):
        return session.exec(select(User).where(User.id == user_id)).first()

    def get_user_by_email(self, email: str, session: Session):
        return session.exec(select(User).where(User.email == email)).first()

    def get_user_by_username(self, username: str, session: Session):
        return session.exec(select(User).where(User.username == username)).first()

    def register_user(self, user: UserRegister, session: Session):
        if self.get_user_by_username(user.username, session):
            raise HTTPException(status_code=400, detail="Username already exists")
        
        if self.get_user_by_email(user.email, session):
            raise HTTPException(status_code=400, detail="Email already exists")
        
        new_user = User(
            full_name=user.full_name, 
            email=user.email,
            username=user.username, 
            hashed_password=hash_password(user.password),
            role="admin", # Default for first registration
            token_version=1
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        return {
            "access_token": create_access_token(new_user.id, new_user.token_version), 
            "refresh_token": create_refresh_token(new_user.id, new_user.token_version),
            "user": new_user
        }
    
    def login_user(self, login_data: UserLogin, session: Session):
        user = session.exec(
            select(User).where(or_(User.username == login_data.login, User.email == login_data.login))
        ).first()
        
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid username/email or password")
        
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is deactivated")

        return {
            "access_token": create_access_token(user.id, user.token_version), 
            "refresh_token": create_refresh_token(user.id, user.token_version),
            "message": "Login successful"
        }

    def forgot_password(self, email: str, session: Session):
        user = self.get_user_by_email(email, session)
        if user:
            token = create_reset_token(user.id)
            EmailService.send_password_reset_email(user.email, token)
        
        # Always return success to prevent email enumeration
        return {"message": "If an account exists with this email, a reset link has been sent."}

    def reset_password(self, token: str, new_password: str, session: Session):
        user_id_str = decode_reset_token(token)
        if not user_id_str:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
        user = self.get_user_by_id(UUID(user_id_str), session)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.hashed_password = hash_password(new_password)
        user.token_version += 1 # Invalidate all current sessions on password reset!
        user.updated_at = datetime.utcnow()
        
        session.add(user)
        session.commit()
        
        return {"message": "Password updated. Please log in again."}
