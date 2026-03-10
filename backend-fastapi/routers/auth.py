from fastapi import APIRouter, Depends, status, HTTPException, Response, Cookie
from models.users import User
from schemas.user_schema import UserCreate, UserLogin, UserRead, UserRegister
from database import get_session
from sqlmodel import Session, select
from auth.security import hash_password, verify_password, create_access_token, decode_token
from datetime import timedelta  
from service.auth_service import AuthService

router = APIRouter(prefix="/auth" , tags=['auth'])

auth_service = AuthService()

@router.post("/register", response_model=UserRead , response_model_exclude={"hashed_password"})
async def register_user(user: UserRegister,response: Response, session: Session = Depends(get_session)):
    result = auth_service.register_user(user=user, session=session)
    response.set_cookie(
        key="access_token",
        value=result["token"],
        httponly=True,
        secure=True,
        samesite="lax"
    )
    return result["user"]


@router.post("/login")
async def login(user:UserLogin,response: Response, session : Session = Depends(get_session)):
    result = auth_service.login_user(user=user, session=session)
    response.set_cookie(
        key="access_token",
        value=result["token"],
        httponly=True,
        secure=True,
        samesite="lax"
    )

    return {"message" : result["message"]}


@router.post("/logout" , response_model=dict)
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message" : "Logout Successfully !! "}


@router.get("/me")
def get_me(access_token: str = Cookie(default=None), session: Session = Depends(get_session)):
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = decode_token(access_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    username = payload.get("username")
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {
        "id": str(user.id),
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role,
        "is_active": user.is_active,
        "tenant_id": user.tenant_id,
    }
