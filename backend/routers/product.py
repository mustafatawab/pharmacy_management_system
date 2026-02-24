from unicodedata import name
from database import get_session
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from schemas.product_schema import ProductCreate, ProductRead, ProductFilter
from models.product import Product
from service.product_service import ProductService
from sqlmodel import Session


router = APIRouter(prefix="/product", tags=["Product"])

product_service = ProductService()

@router.post("/")
async def create_product(product: ProductCreate,session: Session = Depends(get_session)):
    
    return product_service.create_product(data=product, db=session)


