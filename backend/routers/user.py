from fastapi import APIRouter, Depends, status, HTTPException, Response
from models.users import User
from schemas.user_schema import UserCreate, UserLogin, UserRead, UserUpdate
from database import get_session
from sqlmodel import Session, select
from auth.security import hash_password, verify_password, create_access_token, decode_token
from auth.dependency import get_current_user
from uuid import UUID

router = APIRouter(prefix="/user" , tags=['user'])


@router.get("" , response_model=list[UserRead])
async def get_all_users(current_user: User = Depends(get_current_user) , session : Session = Depends(get_session)):
    if  current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Admin can see...")    
    users = session.exec(select(User)).all()
    return users
    




@router.post("", response_model=User , response_model_exclude={"hashed_password"})
async def create_user(user: UserCreate,current_user: User = Depends(get_current_user),  session: Session = Depends(get_session)):
    if  current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Admin can create users...")    
    
    
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


@router.get('/{id}' , response_model=UserRead)
async def get_single_user(id: UUID, current_user: User = Depends(get_current_user) , session : Session = Depends(get_session)):
    
    if  current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Admin can see...")    
   

    user = session.exec(select(User).where(User.id == id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Not found")
    return user


@router.put("/{id}" , response_model=UserRead)
async def update_user(id: str , update_user: UserUpdate , session : Session = Depends(get_session) , current_user: User = Depends(get_current_user)):
    if  current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Admin can see...")    
    
    user = session.exec(select(User).where(User.id == id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user.full_name = update_user.full_name or user.full_name
    user.username = update_user.username or user.username
    user.password = update_user.password or user.password
    user.role = update_user.role or user.role
    user.is_active = update_user.is_active or user.is_active
    
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
    


@router.delete("/{id}", response_model=dict)
async def delete_user(id: UUID , current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Admin can delete users...")
    
    user = session.exec(select(User).where(User.id == id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin can not be deleted")
    
    session.delete(user)
    session.commit()
    return {"message" : "user deleted successfully"}