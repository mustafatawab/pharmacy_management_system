from sqlmodel import SQLModel, select
from models.category import Category
from schemas.category_schema import CategoryCreate, CategoryUpdate, CategoryRead
from fastapi import Depends, HTTPException
from sqlmodel import Session
from database import get_session

class CategoryService:

    def __init__(self):
        pass

    def get_all_category(self, session: Session = Depends(get_session)) -> list[CategoryRead]:
        categories = session.exec(select(Category)).all()
        return categories

    def create_category(self, category: CategoryCreate, session: Session = Depends(get_session)) -> CategoryRead:
        existing_category = session.exec(select(Category).where(Category.name == category.name)).first()
        if existing_category:
            raise HTTPException(status_code=400, detail="Category already exists")
        
        add_category = Category(name=category.name, description=category.description)
        session.add(add_category)
        session.commit()
        session.refresh(add_category)
        return add_category

    def get_category_by_id(self, id: int, session: Session = Depends(get_session)) -> CategoryRead:
        category = session.exec(select(Category).where(Category.id == id)).first()
        
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category

    def update_category(self, id: int, update_category: CategoryUpdate, session: Session = Depends(get_session)) -> CategoryRead:
        category = self.get_category_by_id(id=id, session=session)

        category.name = update_category.name or category.name
        category.description = update_category.description or category.description
        
        session.add(category)
        session.commit()
        session.refresh(category)
        return category

    def delete_category(self, id: int, session: Session = Depends(get_session)) -> CategoryRead:
        category = self.get_category_by_id(id=id, session=session)

        session.delete(category)
        session.commit()
        return category
