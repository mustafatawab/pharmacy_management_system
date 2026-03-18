from auth.dependency import get_current_user
from fastapi import APIRouter, Depends, status, HTTPException, Response, Cookie, Request
from models.users import User
from schemas.user_schema import UserCreate, UserLogin, UserRead, UserRegister
from database import get_session
from sqlmodel import Session, select
from auth.security import hash_password, verify_password, create_access_token, decode_token, decode_refresh_token
from datetime import timedelta  
from service.auth_service import AuthService

router = APIRouter(prefix="/auth" , tags=['auth'])

auth_service = AuthService()

@router.post("/register", response_model=UserRead , response_model_exclude={"hashed_password"})
async def register_user(user: UserRegister,response: Response, session: Session = Depends(get_session)):
    result = auth_service.register_user(user=user, session=session)
    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        httponly=True,
        secure=True,
        samesite="lax"
    )
    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        httponly=True,
        secure=True,
        samesite="lax",
        path="/auth/refresh" # Only send refresh token to this endpoint for security
    )
    return result["user"]


@router.post("/login")
async def login(user:UserLogin,response: Response, session : Session = Depends(get_session)):
    result = auth_service.login_user(user=user, session=session)
    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        httponly=True,
        secure=True,
        samesite="lax"
    )
    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        httponly=True,
        secure=True,
        samesite="lax",
        path="/auth/refresh"
    )

    return {"message" : result["message"]}


@router.post("/refresh")
async def refresh_token(request: Request, response: Response, session: Session = Depends(get_session)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")
    
    payload = decode_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    username = payload.get("username")
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    new_access_token = create_access_token({"username": user.username})
    
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="lax"
    )
    
    return {"message": "Token refreshed successfully"}


@router.post("/logout" , response_model=dict)
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token", path="/auth/refresh")
    return {"message" : "Logout Successfully !! "}


@router.get("/me" , response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # if not access_token:
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    # payload = decode_token(access_token)
    # if not payload:
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    # username = payload.get("username")
    # user = session.exec(select(User).where(User.username == username)).first()
    # if not user:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    # return {
    #     "id": str(user.id),
    #     "username": user.username,
    #     "full_name": user.full_name,
    #     "role": user.role,
    #     "is_active": user.is_active,
    #     "tenant_id": user.tenant_id,
    # }

    return current_user