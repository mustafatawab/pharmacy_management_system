from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models.tenant import Tenant
from models.users import User
from schemas.tenant_schema import TenantCreate, TenantRead
from auth.security import decode_token
from auth.dependency import get_current_user
from fastapi import Cookie
from service.tenant_service import TenantService

router = APIRouter(prefix="/tenant", tags=["tenant"])

tenant_service = TenantService()

# def get_current_user(access_token: str = Cookie(default=None), session: Session = Depends(get_session)) -> User:
#     if not access_token:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
#     payload = decode_token(access_token)
#     if not payload:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
#     username = payload.get("username")
#     user = session.exec(select(User).where(User.username == username)).first()
#     if not user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
#     return user


@router.post("/setup", response_model=TenantRead)
async def setup_tenant(
    tenant_data: TenantCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # Check if user already has a tenant
    # if current_user.tenant_id is not None:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Pharmacy setup already completed",
    #     )

    # # Check for existing email or phone
    # existing_email = session.exec(select(Tenant).where(Tenant.email == tenant_data.email)).first()
    # if existing_email:
    #     raise HTTPException(status_code=400, detail="A pharmacy with this email already exists")

    # existing_phone = session.exec(select(Tenant).where(Tenant.phone == tenant_data.phone)).first()
    # if existing_phone:
    #     raise HTTPException(status_code=400, detail="A pharmacy with this phone already exists")

    # Create the tenant
    # new_tenant = Tenant(
    #     name=tenant_data.name,
    #     address=tenant_data.address,
    #     city=tenant_data.city,
    #     phone=tenant_data.phone,
    #     email=tenant_data.email,
    #     logo_url=tenant_data.logo_url,
    #     timezone=tenant_data.timezone,
    #     currency=tenant_data.currency,
    #     is_active=tenant_data.is_active,
    # )
    # session.add(new_tenant)
    # session.commit()
    # session.refresh(new_tenant)

    # # Link the admin user to the tenant
    # current_user.tenant_id = new_tenant.id
    # session.add(current_user)
    # session.commit()
    # session.refresh(current_user)

    added_tenant = await tenant_service.create_tenant(tenant_data, session, current_user)

    return added_tenant


@router.get("/me", response_model=TenantRead)
async def get_my_tenant(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    tenant = tenant_service.get_tenant_by_id(session, current_user)
    return tenant
