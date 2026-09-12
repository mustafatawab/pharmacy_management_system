from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from database import get_session
from auth.dependency import get_current_user
from models.users import User
from schemas.sale_schema import SaleCreate, SaleRead, SaleFilter, SaleListResponse
from service.sale_service import SaleService

router = APIRouter(prefix="/sale", tags=["sale"])
sale_service = SaleService()

@router.post("/", response_model=SaleRead, status_code=status.HTTP_201_CREATED)
async def create_sale(
    data: SaleCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return sale_service.create_sale(data, session, current_user)

@router.get("/", response_model=SaleListResponse)
async def get_all_sales(
    filters: SaleFilter = Depends(),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return sale_service.get_all_sales(session, current_user, filters)

@router.get("/{sale_id}", response_model=SaleRead)
async def get_sale_by_id(
    sale_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return sale_service.get_sale_by_id(sale_id, session, current_user)
