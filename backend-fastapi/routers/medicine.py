from database import get_session
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from schemas.medicine_schema import MedicineCreate, MedicineRead, MedicineFilter, MedicineUpdate
from models.medicine import Medicine
from models.users import User
from service.medicine_service import MedicineService
from sqlmodel import Session
from auth.dependency import require_admin_with_tenant


router = APIRouter(prefix="/medicine", tags=["Medicine"])

medicine_service = MedicineService()

@router.post("/", response_model=MedicineRead)
async def create_medicine(
    medicine: MedicineCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return medicine_service.create_medicine(data=medicine, session=session, current_user=current_user)

@router.get("/", response_model=list[MedicineRead])
async def get_all_medicines(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return medicine_service.get_all_medicines(session=session, current_user=current_user)


@router.get("/{id}", response_model=MedicineRead)
async def get_medicine_by_id(
    id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return medicine_service.get_medicine_by_id(medicine_id=id, session=session, current_user=current_user)

@router.put("/{id}", response_model=MedicineRead)
async def update_medicine(
    id: int, 
    update_medicine_data: MedicineUpdate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return medicine_service.update_medicine(medicine_id=id, update_medicine_data=update_medicine_data, session=session, current_user=current_user)

@router.delete("/{id}")
async def delete_medicine(
    id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return medicine_service.delete_medicine(medicine_id=id, session=session, current_user=current_user)
