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



    async def create_medicine(self, data: MedicineCreate, session: Session, current_user: User) -> MedicineRead:
        
        # if current_user.tenant_id is None:
        #     raise HTTPException(status_code=400, detail="No pharmacy setup found")
        
        # if current_user.role != "admin":
        #     raise HTTPException(status_code=400, detail="You are not authorized to create a medicine")

        if data.selling_price < data.purchase_price:
            raise HTTPException(
                status_code=400,
                detail="Selling price cannot be lower than cost price",
            )

        
        new_medicine = MedicineModel(**data.model_dump(), tenant_id=current_user.tenant_id)

        await session.add(new_medicine)
        await session.commit()
        await session.refresh(new_medicine)

        return new_medicine



    async def get_all_medicines(self, session: Session , current_user: User):
        
        all_medicines = await session.exec(select(MedicineModel).where(MedicineModel.tenant_id == current_user.tenant_id)).all()
        return all_medicines


    async def get_medicine_by_id(self, medicine_id: int , session: Session , current_user: User):
        medicine = await session.exec(select(MedicineModel).where(MedicineModel.id == medicine_id , MedicineModel.tenant_id == current_user.tenant_id)).first()
        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")
        return medicine

    

    async def update_medicine(self, medicine_id: int,update_medicine: MedicineUpdate, session: Session , current_user: User):
        await self.get_medicine_by_id(medicine_id, session, current_user)
        
        await session.add(update_medicine)
        await session.commit()
        await session.refresh(update_medicine)
        return update_medicine
    
    async def delete_medicine(self, medicine_id : int , session : Session , current_user: User):
        medicine = await self.get_medicine_by_id(medicine_id, session, current_user)
        session.delete(medicine)
        session.commit()
        return {"message": "Medicine deleted successfully"}
    

    
        

    