from fastapi import FastAPI
from routers.auth import router as auth_router
from routers.user import router as user_router
from routers.product import router as product_router
from routers.category import router as category_router
from routers.supplier import router as supplier_router
from routers.tenant import router as tenant_router
from database import create_tables
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from models.tenant import Tenant
from models.users import User
from models.product import Product
from models.category import Category
from models.supplier import Supplier

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(product_router)
app.include_router(category_router)
app.include_router(supplier_router)
app.include_router(tenant_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://pharmacy-management-system-beta.vercel.app"],
    allow_credentials=True,         
    allow_methods=["*"],
    allow_headers=["*"], 
)

