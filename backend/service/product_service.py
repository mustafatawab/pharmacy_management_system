# product_service.py
from fastapi import HTTPException, Depends
from sqlmodel import Session
from database import get_session
from schemas.product_schema import ProductCreate, ProductUpdate, ProductRead
from models.product import Product as ProductModel
from repository.product_repository import ProductRepository
from sqlmodel import select

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



    def get_all_products(self, db: Session = Depends(get_session)):
        
        all_products = db.exec(select(ProductModel)).all()
        return all_products


    def get_product_by_id(self, product_id: int , db: Session = Depends(get_session)):
        product = db.exec(select(ProductModel).where(ProductModel.id == product_id)).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    

    def update_product(self, product_id: int,update_product: ProductUpdate, db: Session = Depends(get_session)):
        product = self.get_product_by_id(product_id, db)
        
        db.add(update_product)
        db.commit()
        db.refresh(update_product)
        return update_product
    
    def delete_product(self, product_id : int , db : Session = Depends(get_session)):
        product = self.get_product_by_id(product_id, db)
        db.delete(product)
        db.commit()
        return {"message": "Product deleted successfully"}
    

    
        

    