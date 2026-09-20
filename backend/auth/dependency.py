from fastapi import Depends, HTTPException, status, Request
from sqlmodel import select, Session
from database import get_session
from auth.security import decode_access_token
from models.users import User
from uuid import UUID

async def get_current_user(request: Request, session: Session = Depends(get_session)) -> User:
    """
    Validates the session by checking the token AND the token_version.
    If the database version is higher, the session is considered invalid.
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Not Authenticated"
        )
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or expired session"
        )
    
    user_id = payload.get("sub")
    token_version = payload.get("version")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid token payload"
        )
    
    # Fetch user by ID (Immutable reference)
    user = session.exec(select(User).where(User.id == UUID(user_id))).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="User no longer exists"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="User account is deactivated"
        )

    # Security Check: Ensure the token version is still valid
    if user.token_version != token_version:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session has expired or was revoked"
        )

    return user

async def require_admin_with_tenant(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required"
        )
    
    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pharmacy profile not found. Please complete setup."
        )
    
    return current_user

def require_role(allowed_roles: list[str]):
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pharmacy profile not found. Please complete setup."
            )
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of the following roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

async def require_user_with_tenant(current_user: User = Depends(get_current_user)) -> User:
    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pharmacy profile not found. Please complete setup."
        )
    
    return current_user
