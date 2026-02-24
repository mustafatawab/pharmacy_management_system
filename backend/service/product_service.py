# product_service.py
from fastapi import HTTPException, Depends
from sqlmodel import Session
from database import get_session
from schemas.product_schema import ProductCreate, ProductUpdate, ProductRead
from models.product import Product as ProductModel
from repository.product_repository import ProductRepository

class ProductService:
    def __init__(self):
        self.repo = ProductRepository()



    def create_product(self, data: ProductCreate, db: Session=Depends(get_session)) -> ProductRead:
        
        if data.selling_price < data.purchase_price:
            raise HTTPException(
                status_code=400,
                detail="Selling price cannot be lower than cost price",
            )

        
        new_product = ProductModel(**data.model_dump())

        db.add(new_product)
        db.commit()
        db.refresh(new_product)

        return new_product



    def get_product(self, product_id: int, db: Session = Depends(get_session)) -> ProductRead:
        product = self.repo.get_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product




    def list_products(self, db: Session, search: str = None, category_id: int = None, is_active: bool = True, offset: int = 0, limit: int = 10) -> tuple[list[ProductRead], int]:
        return self.repo.list(db, search, category_id, is_active, offset, limit)




    def update_product(self, db: Session, product_id: int, data: ProductUpdate) -> ProductRead:
        product = self.get_product(db, product_id)

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.item():
            setattr(product, key, value)


        if product.selling_price < product.purchase_price:
            raise HTTPException(
                status_code=400,
                detail="Selling price cannot be lower than purchase price",
            )

        return self.repo.update(db, product)




    def soft_delete_product(self, db: Session, product_id: int) -> ProductRead:
        product = self.get_product(db, product_id)
        return self.repo.soft_delete(db, product)




    def delete_product(self, db: Session, product_id: int) -> ProductRead:
        product = self.get_product(db, product_id)
        return self.repo.delete(db, product)
    


    def list_products(
        self,
        db: Session,
        search: str | None,
        category_id: int | None,
        page: int,
        page_size: int,
    ):
        offset = (page - 1) * page_size

        items, total = self.repo.list(
            db=db,
            search=search,
            category_id=category_id,
            offset=offset,
            limit=page_size,
        )

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
        }