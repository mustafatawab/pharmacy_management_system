import pytest
import sqlite3
from decimal import Decimal
from uuid import UUID
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from datetime import datetime, timedelta

# SQLite Adapters for Decimal and UUID
sqlite3.register_adapter(Decimal, str)
sqlite3.register_converter("DECIMAL", lambda v: Decimal(v.decode('utf-8')))
sqlite3.register_adapter(UUID, lambda u: u.hex)
sqlite3.register_converter("UUID", lambda v: UUID(v.decode('utf-8')))

from main import app
from database import get_session
from models.tenant import Tenant
from models.users import User, UserRole
from models.category import Category
from models.supplier import Supplier
from models.medicine import Medicine
from models.product_batch import ProductBatch
from models.unit_conversion import UnitConversion
from models.customer import Customer
from models.customer_ledger import CustomerLedger
from models.sale import Sale, SaleItem
from models.purchase import Purchase, PurchaseItem
from models.refill_reminder import RefillReminder
from models.return_to_supplier import ReturnToSupplier, ReturnToSupplierItem
from models.stock_transfer import StockTransfer, StockTransferItem
from models.supplier_ledger import SupplierLedger
from models.insurance import InsurancePanel, InsuranceLedger
from auth.security import hash_password, create_access_token

from sqlalchemy.pool import StaticPool

# In-memory SQLite for testing
sqlite_url = "sqlite:///:memory:"
engine = create_engine(
    sqlite_url, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override

    # Create a test tenant and user to authenticate the client
    tenant = Tenant(
        name="Test Pharmacy", 
        address="123 Test St", 
        phone="111-222", 
        email="test@pharma.com", 
        currency="USD"
    )
    session.add(tenant)
    session.commit()
    session.refresh(tenant)

    user = User(
        email="admin@test.com",
        username="admin",
        hashed_password=hash_password("password"),
        full_name="Admin Test",
        role=UserRole.ADMIN,
        tenant_id=tenant.id
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create access token
    access_token = create_access_token(user.id, user.token_version)

    client = TestClient(app)
    # Set default cookies for authenticated requests
    client.cookies.set("access_token", access_token)

    yield client
    app.dependency_overrides.clear()
