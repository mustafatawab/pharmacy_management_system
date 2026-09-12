from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from schemas.category_schema import CategoryCreate, CategoryUpdate, CategoryRead
from service.category_service import CategoryService
from models.users import User
from auth.dependency import require_admin_with_tenant

router = APIRouter(prefix="/category" , tags=["category"])

category_service = CategoryService()

@router.get("/", response_model=list[CategoryRead])
def get_all_category(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return category_service.get_all_category(session, current_user)

@router.post("/", response_model=CategoryRead)
def create_category(
    category: CategoryCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return category_service.create_category(category, session, current_user)



@router.get("/{id}", response_model=CategoryRead)
def get_category_by_id(
    id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return category_service.get_category_by_id(id, session, current_user)



@router.put("/{id}", response_model=CategoryRead)
def update_category(
    id: int, 
    update_category_data: CategoryUpdate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return category_service.update_category(id, update_category_data, session, current_user)

@router.delete("/{id}", response_model=CategoryRead)
def delete_category(
    id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return category_service.delete_category(id, session, current_user)