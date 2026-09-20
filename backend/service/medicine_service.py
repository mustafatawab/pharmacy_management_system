# medicine_service.py
from fastapi import HTTPException, Depends
from sqlmodel import Session
from database import get_session
from schemas.medicine_schema import MedicineCreate, MedicineUpdate, MedicineRead, MedicineFilter, MedicineListResponse
from models.medicine import Medicine as MedicineModel
from models.users import User
from sqlmodel import select, col, func, or_
from sqlalchemy.orm import selectinload
from auth.dependency import get_current_user
from models.category import Category

class MedicineService:
    def __init__(self):
        pass

    def create_medicine(self, data: MedicineCreate, session: Session, current_user: User) -> MedicineModel:
        if data.selling_price < data.purchase_price:
            raise HTTPException(
                status_code=400,
                detail="Selling price cannot be lower than cost price",
            )
        
        category_query = session.exec(select(Category).where(
            Category.id == data.category_id,
            Category.tenant_id == current_user.tenant_id
        )).first()

        if data.category_id and not category_query:
            raise HTTPException(status_code=400, detail="Invalid category ID for this pharmacy")

        new_medicine = MedicineModel(
            **data.model_dump(exclude_unset=True),
            tenant_id=current_user.tenant_id
        )

        session.add(new_medicine)
        session.commit()
        session.refresh(new_medicine)

        return new_medicine

    def get_all_medicines(self, session: Session, current_user: User, filters: MedicineFilter) -> MedicineListResponse:
        query = select(MedicineModel).where(MedicineModel.tenant_id == current_user.tenant_id).options(selectinload(MedicineModel.category))

        # Filtering
        if filters.search:
            search_pattern = f"%{filters.search}%"
            query = query.where(or_(
                col(MedicineModel.name).ilike(search_pattern),
                col(MedicineModel.description).ilike(search_pattern)
            ))

        # Barcode exact-match lookup (used by barcode scanner in POS)
        if filters.barcode:
            query = query.where(MedicineModel.barcode == filters.barcode)

        if filters.category_id:
            query = query.where(MedicineModel.category_id == filters.category_id)

        if filters.is_active is not None:
            query = query.where(MedicineModel.is_active == filters.is_active)

        if filters.min_price:
            query = query.where(MedicineModel.selling_price >= filters.min_price)

        if filters.max_price:
            query = query.where(MedicineModel.selling_price <= filters.max_price)

        # Total count before pagination
        total_query = select(func.count()).select_from(query.subquery())
        total = session.exec(total_query).one()

        # Sorting
        sort_column = getattr(MedicineModel, filters.sort_by, MedicineModel.name)
        if filters.sort_order == "desc":
            query = query.order_by(col(sort_column).desc())
        else:
            query = query.order_by(col(sort_column).asc())

        # Pagination
        offset = (filters.page - 1) * filters.page_size
        query = query.offset(offset).limit(filters.page_size)

        all_medicines = session.exec(query).all()

        return {
            "items": all_medicines,
            "total": total,
            "page": filters.page,
            "page_size": filters.page_size
        }

    def get_medicine_by_id(self, medicine_id: int, session: Session, current_user: User):
        medicine = session.exec(select(MedicineModel).where(
            MedicineModel.id == medicine_id, 
            MedicineModel.tenant_id == current_user.tenant_id
        ).options(selectinload(MedicineModel.category))).first()
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

    def get_alternatives(self, medicine_id: int, session: Session, current_user: User):
        # Fetch the original medicine
        medicine = self.get_medicine_by_id(medicine_id, session, current_user)
        if not medicine or not medicine.generic_salt:
            return []
        
        # Find active medicines with the same generic salt, stock > 0, excluding the original
        query = select(MedicineModel).where(
            MedicineModel.tenant_id == current_user.tenant_id,
            MedicineModel.generic_salt == medicine.generic_salt,
            MedicineModel.id != medicine_id,
            MedicineModel.is_active == True,
            MedicineModel.quantity > 0
        ).order_by(col(MedicineModel.selling_price).asc())
        
        return session.exec(query).all()