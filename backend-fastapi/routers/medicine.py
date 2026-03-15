from database import get_session
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from schemas.medicine_schema import MedicineCreate, MedicineRead, MedicineFilter, MedicineUpdate
from models.medicine import Medicine
from service.medicine_service import MedicineService
from sqlmodel import Session


router = APIRouter(prefix="/medicine", tags=["Medicine"])

medicine_service = MedicineService()

@router.post("/")
async def create_medicine(medicine: MedicineCreate,session: Session = Depends(get_session)):
    
    return medicine_service.create_medicine(data=medicine, db=session)

@router.get("/")
async def get_all_medicines(session: Session = Depends(get_session)):
    return medicine_service.get_all_medicines(db=session)


@router.get("/{id}")
async def get_medicine_by_id(id: int, session: Session = Depends(get_session)):
    return medicine_service.get_medicine_by_id(medicine_id=id, db=session)

@router.put("/{id}")
async def update_medicine(id: int, update_medicine: MedicineUpdate, session: Session = Depends(get_session)):
    return medicine_service.update_medicine(medicine_id=id, update_medicine=update_medicine, db=session)

@router.delete("/{id}")
async def delete_medicine(id: int, session: Session = Depends(get_session)):
    return medicine_service.delete_medicine(medicine_id=id, db=session)
