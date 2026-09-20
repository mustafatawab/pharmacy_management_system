from fastapi import APIRouter, Depends
from typing import List
from sqlmodel import Session
from database import get_session
from schemas.unit_conversion_schema import UnitConversionCreate, UnitConversionRead
from service.unit_conversion_service import UnitConversionService
from models.users import User
from auth.dependency import require_admin_with_tenant, require_user_with_tenant

router = APIRouter(prefix="/medicine/{medicine_id}/units", tags=["Unit Conversions"])

unit_service = UnitConversionService()


@router.get("/", response_model=List[UnitConversionRead])
def get_unit_conversions(
    medicine_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_user_with_tenant),
):
    """List all unit conversion tiers for a given medicine."""
    return unit_service.get_conversions_for_medicine(medicine_id, session, current_user)


@router.post("/", response_model=UnitConversionRead)
def add_unit_conversion(
    medicine_id: int,
    data: UnitConversionCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant),
):
    """
    Add a unit conversion tier.
    Example: { "from_unit": "box", "to_unit": "strip", "factor": 10 }
    """
    return unit_service.create_conversion(medicine_id, data, session, current_user)


@router.delete("/{conversion_id}", status_code=204)
def delete_unit_conversion(
    medicine_id: int,
    conversion_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant),
):
    """Remove a unit conversion tier."""
    unit_service.delete_conversion(conversion_id, session, current_user)
