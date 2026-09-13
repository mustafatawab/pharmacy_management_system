from database import get_session
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from schemas.product_schema import ProductCreate, ProductRead, ProductFilter, ProductUpdate, ProductListResponse
from models.product import Product
from models.users import User
from service.medicine_service import MedicineService
from sqlmodel import Session
from auth.dependency import require_admin_with_tenant, require_user_with_tenant


router = APIRouter(prefix="/product", tags=["Product"])

medicine_service = MedicineService()

@router.post("/")
async def create_product(
    product: ProductCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return medicine_service.create_medicine(data=product, session=session, current_user=current_user)

@router.get("/", response_model=ProductListResponse)
async def get_all_products(
    filters: ProductFilter = Depends(),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_with_tenant)
):
    return medicine_service.get_all_medicines(session=session, current_user=current_user, filters=filters)


@router.get("/{id}", response_model=ProductRead)
async def get_product_by_id(
    id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_with_tenant)
):
    return medicine_service.get_medicine_by_id(medicine_id=id, session=session, current_user=current_user)

@router.put("/{id}", response_model=ProductRead)
async def update_product(
    id: int, 
    update_product_data: ProductUpdate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return medicine_service.update_medicine(medicine_id=id, update_medicine_data=update_product_data, session=session, current_user=current_user)

@router.delete("/{id}")
async def delete_product(
    id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return medicine_service.delete_medicine(medicine_id=id, session=session, current_user=current_user)