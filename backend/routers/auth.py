from fastapi import APIRouter, Depends, status, HTTPException, Response
from models.users import User
from schemas.user_schema import UserCreate, UserLogin, UserRead
from database import get_session
from sqlmodel import Session, select
from auth.security import hash_password, verify_password, create_access_token, decode_token
from auth.dependency import get_current_user
router = APIRouter(prefix="/auth" , tags=['auth'])

@router.post("/register", response_model=User , response_model_exclude={"hashed_password"})
async def register_user(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user.username)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )
    

    add_user = User(full_name=user.full_name, role="admin", username=user.username, hashed_password=hash_password(user.password))
    session.add(add_user)
    session.commit()
    session.refresh(add_user)
    return add_user


@router.post("/login")
async def login(user:UserLogin,response: Response, session : Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == user.username)).first()
    if not existing_user or not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Credentials"
        )
    token = create_access_token({"username": existing_user.username})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax"
    )

    return {"message" : "logged in successfully"}


@router.post("/logout" , response_model=dict)
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message" : "Logout Successfully !! "}



    


