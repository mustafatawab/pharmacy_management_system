from auth.dependency import get_current_user
from fastapi import APIRouter, Depends, status, HTTPException, Response, Request
from models.users import User
from schemas.user_schema import UserLogin, UserRead, UserRegister, ForgotPasswordRequest, ResetPasswordConfirm
from database import get_session
from sqlmodel import Session
from auth.security import decode_refresh_token, create_access_token
from service.auth_service import AuthService
from uuid import UUID

router = APIRouter(prefix="/auth" , tags=['auth'])
auth_service = AuthService()

@router.post("/register", response_model=UserRead, response_model_exclude={"hashed_password"})
async def register_user(user: UserRegister, response: Response, session: Session = Depends(get_session)):
    result = auth_service.register_user(user=user, session=session)
    
    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        httponly=True,
        secure=True,
        samesite="strict"
    )
    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        httponly=True,
        secure=True,
        samesite="strict",
        path="/auth/refresh"
    )
    return result["user"]

@router.post("/login")
async def login(login_data: UserLogin, response: Response, session: Session = Depends(get_session)):
    result = auth_service.login_user(login_data=login_data, session=session)
    
    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        httponly=True,
        secure=True,
        samesite="strict"
    )
    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        httponly=True,
        secure=True,
        samesite="strict",
        path="/auth/refresh"
    )

    return {"message" : result["message"]}

@router.post("/refresh")
async def refresh_token(request: Request, response: Response, session: Session = Depends(get_session)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")
    
    payload = decode_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")
    
    user_id = payload.get("sub")
    token_version = payload.get("version")

    user = auth_service.get_user_by_id(UUID(user_id), session)
    if not user or user.token_version != token_version:
        # If version mismatch, the session was revoked!
        response.delete_cookie("refresh_token", path="/auth/refresh")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session revoked")
    
    # Issue fresh access token with current version
    new_access_token = create_access_token(user.id, user.token_version)
    
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="strict"
    )
    
    return {"message": "Session renewed"}

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, session: Session = Depends(get_session)):
    return auth_service.forgot_password(data.email, session)

@router.post("/reset-password")
async def reset_password(data: ResetPasswordConfirm, session: Session = Depends(get_session)):
    return auth_service.reset_password(data.token, data.new_password, session)

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token", path="/auth/refresh")
    return {"message" : "Logout successful"}

@router.get("/me" , response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
