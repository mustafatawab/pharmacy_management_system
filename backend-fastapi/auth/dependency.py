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

async def get_tenant_id(current_user: User = Depends(require_user_with_tenant)) -> int:
    return current_user.tenant_id

async def get_tenant_session(
    current_user: User = Depends(get_current_user),
) -> Session:
    """
    Returns a session that is aware of the current user's tenant_id.
    Note: You still need to manually apply the filter or use a helper,
    but having the ID attached to the session makes it much harder to forget.
    """
    from database import engine
    with Session(engine) as session:
        # Attach tenant_id to the session for manual access in services
        setattr(session, 'tenant_id', current_user.tenant_id)
        yield session

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

async def require_user_with_tenant(current_user: User = Depends(get_current_user)) -> User:
    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pharmacy profile not found. Please complete setup."
        )
    
    return current_user
