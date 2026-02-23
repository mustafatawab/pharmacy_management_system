# product_repository.py
from sqlmodel import Session, select
from typing import Optional, List
from uuid import UUID

from models.product import Product

class ProductRepository:

    def create(self, db: Session , product: Product) -> Product:
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    def get_by_id(self, db: Session, product_id: int) -> Optional[Product]:
        statement = select(Product).where(Product.id == product_id)
        return db.exec(statement).first()
    

    def list(
        self,
        db: Session,
        search: Optional[str] = None,
        category_id: int | None = None,
        is_active: Optional[bool] = True,
        offset: int = 0,
        limit: int = 10,
    ) -> tuple[list[Product], int]:

        statement = select(Product)

        if search:
            statement = statement.where(Product.name.ilike(f"%{search}%"))

        if category_id:
            statement = statement.where(Product.category_id == category_id)

        if is_active is not None:
            statement = statement.where(Product.is_active == is_active)

        total = len(db.exec(statement).all())

        statement = statement.offset(offset).limit(limit)

        items = db.exec(statement).all()

        return items, total
    

    def update(self, db: Session, product: Product) -> Product:
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
    

    def soft_delete(self, db: Session, product: Product) -> Product:
        product.is_active = False
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
    

    def delete(self, db: Session, product: Product) -> Product:
        db.delete(product)
        db.commit()
        return product
    
    