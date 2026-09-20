from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models.users import User
from auth.dependency import require_user_with_tenant
from service.dashboard_service import DashboardService, ExpiryAlert
from typing import List

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

dashboard_service = DashboardService()

@router.get("/expiry-alerts", response_model=List[ExpiryAlert])
def get_expiry_alerts(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_with_tenant)
):
    return dashboard_service.get_expiry_alerts(session, current_user)
