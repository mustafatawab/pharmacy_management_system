from fastapi import APIRouter, Depends, status, HTTPException
from models.users import User
from schemas.user_schema import UserCreate, UserLogin
from database import get_session
from sqlmodel import Session, select
from auth.security import hash_password, verify_password, create_access_token, decode_token
from auth.dependency import get_current_user
router = APIRouter(prefix="/auth" , tags=['auth'])

@router.post("/register", response_model=User)
async def register_user(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user.username, User.email == user.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )
    

    add_user = User(full_name=user.full_name, email=user.email, username=user.username, hashed_password=hash_password(user.password))
    session.add(add_user)
    session.commit()
    session.refresh(add_user)
    return add_user


@router.post("/login")
async def login(user:UserLogin, session : Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user.username)).first()
    if not existing_user or not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Credentials"
        )
    token = create_access_token({"sub": existing_user.username})
    return {"message" : "logged in successfully", "token" : token}


@router.get("/user/me")
async def get_current_user(current_user: User = Depends(get_current_user)):
    return current_user
    