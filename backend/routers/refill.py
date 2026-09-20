from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models.users import User
from auth.dependency import get_current_user
from service.refill_service import RefillService
from schemas.refill_schema import RefillReminderRead
from typing import List

router = APIRouter(prefix="/refill", tags=["Refill"])
refill_service = RefillService()

@router.get("/", response_model=List[RefillReminderRead])
def get_refills(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return refill_service.get_upcoming_refills(session, current_user)

@router.post("/{id}/mark-sent")
def mark_refill_sent(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return refill_service.mark_sent(id, session, current_user)
