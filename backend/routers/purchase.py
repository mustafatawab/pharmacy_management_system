from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session
from database import get_session
from schemas.purchase_schema import PurchaseCreate, PurchaseRead, PurchaseUpdate, PurchaseFilter
from service.purchase_service import PurchaseService
from models.users import User
from auth.dependency import require_admin_with_tenant

router = APIRouter(prefix="/purchase", tags=["purchase"])

purchase_service = PurchaseService()


@router.get("/", response_model=List[PurchaseRead])
def get_purchases(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant),
    # filters: PurchaseFilter = Depends(),
):
    purchases = purchase_service.get_all_purchases(session, current_user)
    return purchases


@router.get("/{id}", response_model=PurchaseRead)
def get_purchase_by_id(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant),
):
    purchase = purchase_service.get_purchase_by_id(id, session, current_user)
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return purchase


@router.post("/", response_model=PurchaseRead)
def create_purchase(
    purchase: PurchaseCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant),
):
    return purchase_service.create_purchase(purchase, session, current_user)


@router.put("/{id}", response_model=PurchaseRead)
def update_purchase(
    id: int,
    purchase: PurchaseUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant),
):
    updated = purchase_service.update_purchase(id, purchase, session, current_user)
    if not updated:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return updated


@router.delete("/{id}", response_model=dict)
def delete_purchase(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant),
):
    success = purchase_service.delete_purchase(id, session, current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return {"message": "Purchase deleted successfully"}