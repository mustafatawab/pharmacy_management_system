# product_service.py
from fastapi import HTTPException, Depends
from sqlmodel import Session
from database import get_session
from schemas.product_schema import ProductCreate, ProductUpdate, ProductRead
from models.product import Product as ProductModel
from sqlmodel import select

class ProductService:
    def __init__(self):
        pass



    async def create_product(self, data: ProductCreate, db: Session=Depends(get_session)) -> ProductRead:
        
        if data.selling_price < data.purchase_price:
            raise HTTPException(
                status_code=400,
                detail="Selling price cannot be lower than cost price",
            )

        
        new_product = ProductModel(**data.model_dump())

        await db.add(new_product)
        await db.commit()
        await db.refresh(new_product)

        return new_product



    async def get_all_products(self, db: Session = Depends(get_session)):
        
        all_products = await db.exec(select(ProductModel)).all()
        return all_products


    async def get_product_by_id(self, product_id: int , db: Session = Depends(get_session)):
        product = await db.exec(select(ProductModel).where(ProductModel.id == product_id)).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    

    async def update_product(self, product_id: int,update_product: ProductUpdate, db: Session = Depends(get_session)):
        await self.get_product_by_id(product_id, db)
        
        await db.add(update_product)
        await db.commit()
        await db.refresh(update_product)
        return update_product
    
    async def delete_product(self, product_id : int , db : Session = Depends(get_session)):
        product = await self.get_product_by_id(product_id, db)
        db.delete(product)
        db.commit()
        return {"message": "Product deleted successfully"}
    

    
        

    