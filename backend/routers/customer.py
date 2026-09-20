from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models.users import User
from auth.dependency import get_current_user
from service.customer_service import CustomerService
from schemas.customer_schema import CustomerCreate, CustomerUpdate, CustomerRead, CustomerLedgerRead, CustomerPaymentRequest
from typing import List

router = APIRouter(prefix="/customer", tags=["Customer"])

customer_service = CustomerService()

@router.get("/", response_model=List[CustomerRead])
def get_customers(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return customer_service.get_all(session, current_user)

@router.get("/{id}", response_model=CustomerRead)
def get_customer(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return customer_service.get_by_id(id, session, current_user)

@router.post("/", response_model=CustomerRead)
def create_customer(
    data: CustomerCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return customer_service.create(data, session, current_user)

@router.put("/{id}", response_model=CustomerRead)
def update_customer(
    id: int,
    data: CustomerUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return customer_service.update(id, data, session, current_user)

@router.delete("/{id}", response_model=dict)
def delete_customer(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return customer_service.delete(id, session, current_user)

@router.get("/{id}/ledger", response_model=List[CustomerLedgerRead])
def get_customer_ledger(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return customer_service.get_ledger(id, session, current_user)

@router.post("/{id}/pay", response_model=CustomerLedgerRead)
def pay_customer(
    id: int,
    payment: CustomerPaymentRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return customer_service.record_payment(id, payment, session, current_user)
