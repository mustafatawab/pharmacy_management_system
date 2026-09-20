from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models.users import User
from auth.dependency import require_admin_with_tenant
from schemas.return_schema import ReturnToSupplierCreate, ReturnToSupplierRead
from service.return_service import ReturnService

router = APIRouter(prefix="/return-to-supplier", tags=["Return To Supplier"])

return_service = ReturnService()

@router.post("/", response_model=ReturnToSupplierRead)
def create_return_to_supplier(
    return_data: ReturnToSupplierCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return return_service.create_return(return_data, session, current_user)
