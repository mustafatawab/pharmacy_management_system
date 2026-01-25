from fastapi import APIRouter, Depends, status, HTTPException
from models.users import User
from schemas.user_schema import UserCreate, UserLogin
from database import get_session
from sqlmodel import Session, select
from auth.security import hash_password

router = APIRouter(prefix="/auth" , tags=['auth'])

@router.post("/register", response_model=User)
async def register_user(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user.username, User.email == user.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )
    

    add_user = User(full_name=user.ful_name, email=user.email, username=user.username, hashed_password=hash_password(user.password))
    session.add(add_user)
    session.commit()
    session.refresh()
    return add_user