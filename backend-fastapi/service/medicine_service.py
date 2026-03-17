# medicine_service.py
from fastapi import HTTPException, Depends
from sqlmodel import Session
from database import get_session
from schemas.medicine_schema import MedicineCreate, MedicineUpdate, MedicineRead
from models.medicine import Medicine as MedicineModel
from models.users import User
from sqlmodel import select
from auth.dependency import get_current_user


class MedicineService:
    def __init__(self):
        pass

    def create_medicine(self, data: MedicineCreate, session: Session, current_user: User) -> MedicineModel:
        if data.selling_price < data.purchase_price:
            raise HTTPException(
                status_code=400,
                detail="Selling price cannot be lower than cost price",
            )

        new_medicine = MedicineModel(**data.model_dump(), tenant_id=current_user.tenant_id)

        session.add(new_medicine)
        session.commit()
        session.refresh(new_medicine)

        return new_medicine

    def get_all_medicines(self, session: Session, current_user: User):
        all_medicines = session.exec(select(MedicineModel).where(MedicineModel.tenant_id == current_user.tenant_id)).all()
        return all_medicines

    def get_medicine_by_id(self, medicine_id: int, session: Session, current_user: User):
        medicine = session.exec(select(MedicineModel).where(
            MedicineModel.id == medicine_id, 
            MedicineModel.tenant_id == current_user.tenant_id
        )).first()
        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")
        return medicine

    def update_medicine(self, medicine_id: int, update_medicine_data: MedicineUpdate, session: Session, current_user: User):
        db_medicine = self.get_medicine_by_id(medicine_id, session, current_user)
        
        medicine_data = update_medicine_data.model_dump(exclude_unset=True)
        for key, value in medicine_data.items():
            setattr(db_medicine, key, value)
        
        session.add(db_medicine)
        session.commit()
        session.refresh(db_medicine)
        return db_medicine
    
    def delete_medicine(self, medicine_id: int, session: Session, current_user: User):
        medicine = self.get_medicine_by_id(medicine_id, session, current_user)
        session.delete(medicine)
        session.commit()
        return {"message": "Medicine deleted successfully"}
    

    
        

    