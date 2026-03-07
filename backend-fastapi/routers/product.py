from database import get_session
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from schemas.product_schema import ProductCreate, ProductRead, ProductFilter, ProductUpdate
from models.product import Product
from service.product_service import ProductService
from sqlmodel import Session


router = APIRouter(prefix="/product", tags=["Product"])

product_service = ProductService()

@router.post("/")
async def create_product(product: ProductCreate,session: Session = Depends(get_session)):
    
    return product_service.create_product(data=product, db=session)

@router.get("/")
async def get_all_products(session: Session = Depends(get_session)):
    return product_service.get_all_products(db=session)


@router.get("/{id}")
async def get_product_by_id(id: int, session: Session = Depends(get_session)):
    return product_service.get_product_by_id(product_id=id, db=session)

@router.put("/{id}")
async def update_product(id: int, update_product: ProductUpdate, session: Session = Depends(get_session)):
    return product_service.update_product(product_id=id, update_product=update_product, db=session)

@router.delete("/{id}")
async def delete_product(id: int, session: Session = Depends(get_session)):
    return product_service.delete_product(product_id=id, db=session)
