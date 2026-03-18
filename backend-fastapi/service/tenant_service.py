from schemas.tenant_schema import TenantRead
from schemas.tenant_schema import TenantCreate, TenantCreate, TenantUpdate
from models.tenant import Tenant
from models.users import User
from sqlmodel import Session, select
from database import get_session
from fastapi import HTTPException, Depends
from auth.dependency import get_current_user

class TenantService:

    def check_tenant_by_phone(self, phone: str, session: Session) -> bool:
        
        result = session.exec(select(Tenant).where(Tenant.phone == phone)).first() 
        
        if result:
            raise HTTPException(status_code=400, detail="Tenant with this phone number already exists")
        
        return result


    
    def check_tenant_by_id(self, tenant_id: int, session: Session) -> bool:
        
        result = session.exec(select(Tenant).where(Tenant.id == tenant_id)).first() 
        
        if not result:
            raise HTTPException(status_code=400, detail="Tenant not found")
        
        return result
    

    def check_tenant_by_email(self, email: str, session: Session) -> bool:
        
        result = session.exec(select(Tenant).where(Tenant.email == email)).first() 
        
        if result:
            raise HTTPException(status_code=400, detail="Tenant with this email already exists")
        
        return result
    
    


    def create_tenant(self, tenant: TenantCreate, session: Session, current_user : User) -> Tenant:

        if current_user.tenant_id is not None:
            raise HTTPException(status_code=400, detail="Tenant already exists")
        
        if current_user.role != "admin":
            raise HTTPException(status_code=400, detail="You are not authorized to create a tenant")

        self.check_tenant_by_phone(tenant.phone, session)
        self.check_tenant_by_email(tenant.email, session)

        new_tenant = Tenant(
            name=tenant.name,
            address=tenant.address,
            phone=tenant.phone,
            city=tenant.city,
            email=tenant.email,
            timezone=tenant.timezone,
            currency=tenant.currency,
            is_active=tenant.is_active
        )

        session.add(new_tenant)
        # session.commit()
        session.flush()

        current_user.tenant_id = new_tenant.id
        session.add(current_user)
        session.commit()

        session.refresh(current_user)
        session.refresh(new_tenant)

        return new_tenant

    def get_tenant_by_id(self, session: Session, current_user: User) -> Tenant | None:

        if current_user.tenant_id is None:
            raise HTTPException(status_code=404, detail="No pharmacy setup found")

        tenant = session.exec(select(Tenant).where(Tenant.id == current_user.tenant_id)).first()
        if not tenant:
            raise HTTPException(status_code=404, detail="Pharmacy not found")
        
        return tenant

        

  

    def get_all_tenants(self, session: Session) -> list[TenantRead]:
        
        result = session.exec(select(Tenant)).all()
        return result

    def update_tenant(self, tenant_id: int, tenant_data: TenantUpdate, session: Session, current_user: User) -> Tenant:
        if current_user.tenant_id != tenant_id:
            raise HTTPException(status_code=403, detail="You are not authorized to update this pharmacy")
        
        db_tenant = self.check_tenant_by_id(tenant_id, session)
        
        update_data = tenant_data.model_dump(exclude_unset=True)
        
        # If phone is being updated, check if it already exists for another tenant
        if "phone" in update_data and update_data["phone"] != db_tenant.phone:
            existing_phone = session.exec(select(Tenant).where(Tenant.phone == update_data["phone"], Tenant.id != tenant_id)).first()
            if existing_phone:
                raise HTTPException(status_code=400, detail="Tenant with this phone number already exists")
        
        # If email is being updated, check if it already exists for another tenant
        if "email" in update_data and update_data["email"] != db_tenant.email:
            existing_email = session.exec(select(Tenant).where(Tenant.email == update_data["email"], Tenant.id != tenant_id)).first()
            if existing_email:
                raise HTTPException(status_code=400, detail="Tenant with this email already exists")

        for key, value in update_data.items():
            setattr(db_tenant, key, value)
        
        db_tenant.updated_at = datetime.now()
        
        session.add(db_tenant)
        session.commit()
        session.refresh(db_tenant)
        
        return db_tenant

    def delete_tenant(self, tenant_id: int , session: Session) -> dict:
        
        tenant = self.check_tenant_by_id(tenant_id, session)

        tenant.is_active = False
        session.add(tenant)
        session.commit()
        

        return {"message" : "Tenant deactivated successfully"}
        