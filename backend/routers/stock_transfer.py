from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from pydantic import BaseModel

from database import get_session
from auth.dependency import get_current_user
from service.stock_transfer_service import StockTransferService

router = APIRouter(prefix="/transfer", tags=["Stock Transfer"])

class TransferItemCreate(BaseModel):
    medicine_barcode: str
    quantity: int

class TransferCreate(BaseModel):
    to_tenant_id: int
    notes: str | None = None
    items: List[TransferItemCreate]

@router.get("/")
def get_transfers(
    type: str = "all",
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return StockTransferService.get_transfers(db, current_user.tenant_id, type)

@router.post("/")
def create_transfer(
    data: TransferCreate,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return StockTransferService.create_transfer(
        db=db,
        from_tenant_id=current_user.tenant_id,
        to_tenant_id=data.to_tenant_id,
        created_by=str(current_user.id),
        items=[item.dict() for item in data.items],
        notes=data.notes
    )

@router.post("/{transfer_id}/receive")
def receive_transfer(
    transfer_id: int,
    db: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    return StockTransferService.receive_transfer(db, transfer_id, current_user.tenant_id)
