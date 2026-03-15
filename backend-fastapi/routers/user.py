from fastapi import APIRouter, Depends, status, HTTPException, Response
from models.users import User
from schemas.user_schema import UserCreate, UserLogin, UserRead, UserUpdate
from database import get_session
from sqlmodel import Session, select
from auth.security import hash_password, verify_password, create_access_token, decode_token
from auth.dependency import get_current_user
from uuid import UUID
from service.user_service import UserService

router = APIRouter(prefix="/user" , tags=['user'])

user_service = UserService()


@router.get("" , response_model=list[UserRead])
async def get_all_users(current_user: User = Depends(get_current_user) , session : Session = Depends(get_session)):
        
    return user_service.get_all_user(session=session, current_user=current_user)
    

@router.post("", response_model=User , response_model_exclude={"hashed_password"})
async def create_user(user: UserCreate,current_user: User = Depends(get_current_user),  session: Session = Depends(get_session)):
    
    add_user = user_service.create_user(user=user, session=session, current_user=current_user)
    return add_user


@router.get("/me" , response_model_exclude={"hashed_password"} , response_model=UserRead)
async def get_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.get('/{id}' , response_model=UserRead)
async def get_single_user(id: UUID, current_user: User = Depends(get_current_user) , session : Session = Depends(get_session)):
    
    if  current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Admin can see...")    
   
    return user_service.get_user_by_id(id=id, session=session)


@router.put("/{id}" , response_model=UserRead )
async def update_user(id: str , update_user: UserUpdate , session : Session = Depends(get_session) , current_user: User = Depends(get_current_user)):
    if  current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Admin can see...")    
    
    updated_user = user_service.update_user(id=id, update_user=update_user, session=session)
    return updated_user
    


@router.delete("/{id}", response_model=dict)
async def delete_user(id: UUID , current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Admin can delete users...")
    
    deleted_user = user_service.delete_user(id=id, session=session)
    return {"message" : f"{deleted_user.full_name} has been deleted successfully"}