from fastapi import APIRouter, Depends, status, HTTPException, Response
from models.users import User
from schemas.user_schema import UserCreate, UserLogin, UserRead
from database import get_session
from sqlmodel import Session, select
from auth.security import hash_password, verify_password, create_access_token, decode_token
from auth.dependency import get_current_user


router = APIRouter(prefix="/user" , tags=['user'])


@router.get("" , response_model=list[UserRead])
async def get_all_users(current_user: User = Depends(get_current_user) , session : Session = Depends(get_session)):
    if  current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Admin can see...")    
    users = session.exec(select(User)).all()
    return users
    




@router.post("", response_model=User , response_model_exclude={"hashed_password"})
async def create_user(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user.username)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )
    

    add_user = User(full_name=user.full_name, username=user.username, hashed_password=hash_password(user.password))
    session.add(add_user)
    session.commit()
    session.refresh(add_user)
    return add_user



@router.get("/me" , response_model_exclude={"hashed_password"} , response_model=UserRead)
async def get_current_user(current_user: User = Depends(get_current_user)):
    return current_user