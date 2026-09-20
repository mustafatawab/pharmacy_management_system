from fastapi import FastAPI
from routers.auth import router as auth_router
from routers.user import router as user_router
from routers.category import router as category_router
from routers.supplier import router as supplier_router
from routers.medicine import router as medicine_router
from routers.tenant import router as tenant_router
from routers.sale import router as sale_router
from routers.purchase import router as purchase_router
from routers.unit_conversion import router as unit_conversion_router
from database import create_tables
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from models.tenant import Tenant
from models.users import User
from models.category import Category
from models.supplier import Supplier
from models.product_batch import ProductBatch
from models.sale import Sale, SaleItem
from models.purchase import Purchase, PurchaseItem
from models.unit_conversion import UnitConversion
from models.supplier_ledger import SupplierLedger
from models.return_to_supplier import ReturnToSupplier, ReturnToSupplierItem
from models.customer import Customer
from models.customer_ledger import CustomerLedger
from models.refill_reminder import RefillReminder
from models.stock_transfer import StockTransfer, StockTransferItem
from models.insurance import InsurancePanel, InsuranceLedger

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(title="Pharmacy Management API", lifespan=lifespan)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(category_router)
app.include_router(supplier_router)
app.include_router(medicine_router)
app.include_router(tenant_router)
app.include_router(sale_router)
app.include_router(purchase_router)
app.include_router(unit_conversion_router)

from routers.return_to_supplier import router as return_to_supplier_router
from routers.dashboard import router as dashboard_router
from routers.customer import router as customer_router
from routers.refill import router as refill_router
from routers.stock_transfer import router as stock_transfer_router
from routers.insurance import router as insurance_router

app.include_router(return_to_supplier_router)
app.include_router(dashboard_router)
app.include_router(customer_router)
app.include_router(refill_router)
app.include_router(stock_transfer_router)
app.include_router(insurance_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://pharmacy-management-system-beta.vercel.app"],
    allow_credentials=True,         
    allow_methods=["*"],
    allow_headers=["*"], 
)

