from sqlmodel import SQLModel, select
from models.category import Category
from schemas.category_schema import CategoryCreate, CategoryUpdate, CategoryRead
from fastapi import Depends, HTTPException
from sqlmodel import Session
from database import get_session

class CategoryService:
    def __init__(self):
        pass

    def get_all_category(self, session: Session, tenant_id: int) -> list[Category]:
        categories = session.exec(select(Category).where(Category.tenant_id == tenant_id)).all()
        return categories

    def create_category(self, category_data: CategoryCreate, session: Session, tenant_id: int) -> Category:
        existing_category = session.exec(select(Category).where(
            Category.name == category_data.name,
            Category.tenant_id == tenant_id
        )).first()
        
        if existing_category:
            raise HTTPException(status_code=400, detail="Category already exists in this pharmacy")
        
        add_category = Category(**category_data.model_dump(), tenant_id=tenant_id)
        session.add(add_category)
        session.commit()
        session.refresh(add_category)
        return add_category

    def get_category_by_id(self, id: int, session: Session, tenant_id: int) -> Category:
        category = session.exec(select(Category).where(
            Category.id == id,
            Category.tenant_id == tenant_id
        )).first()
        
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category

    def update_category(self, id: int, update_category_data: CategoryUpdate, session: Session, tenant_id: int) -> Category:
        category = self.get_category_by_id(id=id, session=session, tenant_id=tenant_id)

        update_dict = update_category_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(category, key, value)
        
        session.add(category)
        session.commit()
        session.refresh(category)
        return category

    def delete_category(self, id: int, session: Session, tenant_id: int) -> Category:
        category = self.get_category_by_id(id=id, session=session, tenant_id=tenant_id)

        session.delete(category)
        session.commit()
        return category
