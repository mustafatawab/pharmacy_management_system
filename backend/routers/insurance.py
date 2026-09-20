from fastapi import APIRouter, Depends
from sqlmodel import Session
from pydantic import BaseModel
from decimal import Decimal

from database import get_session
from auth.dependency import get_current_user
from service.insurance_service import InsuranceService

router = APIRouter(prefix="/insurance", tags=["Insurance"])

class InsurancePanelCreate(BaseModel):
    name: str
    discount_percentage: float = 0.0

class InsurancePayment(BaseModel):
    amount: Decimal
    notes: str | None = None

@router.get("/panel")
def get_panels(
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return InsuranceService.get_panels(db, current_user.tenant_id)

@router.post("/panel")
def create_panel(
    data: InsurancePanelCreate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return InsuranceService.create_panel(db, data.dict(), current_user.tenant_id)

@router.get("/panel/{panel_id}/ledger")
def get_ledger(
    panel_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return InsuranceService.get_ledger(db, panel_id, current_user.tenant_id)

@router.post("/panel/{panel_id}/payment")
def record_payment(
    panel_id: int,
    data: InsurancePayment,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return InsuranceService.record_payment(
        db=db,
        panel_id=panel_id,
        amount=data.amount,
        notes=data.notes,
        tenant_id=current_user.tenant_id
    )
