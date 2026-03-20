from fastapi import APIRouter, Depends, status, HTTPException, Response
from models.users import User
from schemas.user_schema import UserCreate, UserLogin, UserRead, UserUpdate
from database import get_session
from sqlmodel import Session, select
from auth.security import hash_password, verify_password, create_access_token, decode_token
from auth.dependency import get_current_user, require_admin_with_tenant
from uuid import UUID
from service.user_service import UserService

router = APIRouter(prefix="/user" , tags=['user'])

user_service = UserService()


@router.get("" , response_model=list[UserRead])
def get_all_users(current_user: User = Depends(require_admin_with_tenant) , session : Session = Depends(get_session)):
    return user_service.get_all_user(session=session, current_user=current_user)


@router.post("", response_model=UserRead , response_model_exclude={"hashed_password"})
def create_user(user: UserCreate,current_user: User = Depends(require_admin_with_tenant),  session: Session = Depends(get_session)):
    add_user = user_service.create_user(user_data=user, session=session, current_user=current_user)
    return add_user


@router.get("/me" , response_model_exclude={"hashed_password"} , response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get('/{id}' , response_model=UserRead)
def get_single_user(id: UUID, current_user: User = Depends(require_admin_with_tenant) , session : Session = Depends(get_session)):
    return user_service.get_user_by_id(id=id, session=session, current_user=current_user)


@router.put("/{id}" , response_model=UserRead )
def update_user(id: UUID , update_user_data: UserUpdate , session : Session = Depends(get_session) , current_user: User = Depends(require_admin_with_tenant)):
    updated_user = user_service.update_user(id=id, update_user_data=update_user_data, session=session, current_user=current_user)
    return updated_user



@router.delete("/{id}", response_model=dict)
def delete_user(id: UUID , current_user: User = Depends(require_admin_with_tenant), session: Session = Depends(get_session)):
    deleted_user = user_service.delete_user(id=id, session=session, current_user=current_user)
    return {"message" : f"{deleted_user.full_name} has been deleted successfully"}