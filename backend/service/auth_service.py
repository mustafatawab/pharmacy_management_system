from sqlmodel import select
from fastapi import Depends, HTTPException
from sqlmodel import SQLModel, Session, select
from database import get_session
from models.users import User
from schemas.user_schema import UserCreate, UserUpdate, UserRead, UserRegister, UserLogin
from auth.security import hash_password, verify_password, create_access_token
from datetime import timedelta

class AuthService:

    def existing_user(self, username: str, session: Session = Depends(get_session)):
        existing_user = session.exec(select(User).where(User.username == username)).first()
        return existing_user

    def register_user(self, user: UserRegister, session: Session = Depends(get_session)):
        existing_user = self.existing_user(user.username, session)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        add_user = User(full_name=user.full_name, role="admin", username=user.username, hashed_password=hash_password(user.password))
        session.add(add_user)
        session.commit()
        session.refresh(add_user)

        token = create_access_token({"username": add_user.username} , expire_time=timedelta(days=7))

        return {"token" : token, "message" : "User registered successfully" , "user" : add_user}
    
    def login_user(self, user: UserLogin , session: Depends =  Depends(get_session)):
        existing_user = self.existing_user(user.username, session)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")
        

        if not verify_password(user.password , existing_user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        token = create_access_token({"username": existing_user.username} , expire_time=timedelta(days=7))

        # response.set_cookie(
        #     key="access_token",
        #     value=token,
        #     httponly=True,
        #     secure=True,
        #     samesite="lax"
        # )

        return {"token" : token, "message" : "Login successfully"}


    