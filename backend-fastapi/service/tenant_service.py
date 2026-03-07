from schemas.tenant_schema import TenantRead
from schemas.tenant_schema import TenantCreate, TenantCreate, TenantUpdate
from models.tenant import Tenant
from sqlmodel import Session, select
from database import get_session
from fastapi import HTTPException

class TenantService:

    def __init__(self):
        pass

    async def check_tenant_by_phone(self, phone: str, session: Session) -> bool:
        
        result = session.exec(select(Tenant).where(Tenant.phone == phone)).first() 
        
        if result:
            raise HTTPException(status_code=400, detail="Tenant with this phone number already exists")
        
        return True


    
    async def check_tenant_by_id(self, tenant_id: int, session: Session) -> bool:
        
        result = session.exec(select(Tenant).where(Tenant.id == tenant_id)).first() 
        
        if not result:
            raise HTTPException(status_code=400, detail="Tenant not found")
        
        return result
    

    async def check_tenant_by_email(self, email: str, session: Session) -> bool:
        
        result = session.exec(select(Tenant).where(Tenant.email == email)).first() 
        
        if result:
            raise HTTPException(status_code=400, detail="Tenant with this email already exists")
        
        return True
    
    


    async def create_tenant(self, tenant: TenantCreate, session: Session) -> Tenant:
        
        await self.check_tenant_by_phone(tenant.phone, session)
        await self.check_tenant_by_email(tenant.email, session)

        new_tenant = Tenant(
            name=tenant.name,
            address=tenant.address,
            phone=tenant.phone,
            email=tenant.email,
            timezone=tenant.timezone,
            currency=tenant.currency,
            is_active=tenant.is_active
        )

        session.add(new_tenant)
        await session.commit()
        await session.refresh(new_tenant)

        return new_tenant


  

    async def get_all_tenants(self, session: Session) -> list[TenantRead]:
        
        result = session.exec(select(Tenant)).all()
        return result

    async def update_tenant(self, tenant_id: int, tenant: TenantUpdate, session: Session) -> Tenant | None:
        pass

    async def delete_tenant(self, tenant_id: int , session: Session) -> dict:
        
        tenant = await self.check_tenant_by_id(tenant_id, session)

        tenant.is_active = False
        session.add(tenant)
        await session.commit()
        await session.refresh(tenant)

        return {"message" : "Tenant deactivated successfully"}
        