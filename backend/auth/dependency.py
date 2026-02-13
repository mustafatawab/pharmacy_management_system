from fastapi.security import OAuth2PasswordBearer
from sqlmodel import select, Session
from database import get_session
from auth.security import decode_token
from models.users import User
from fastapi import Depends, HTTPException, status, Request

oauth2_sheme = OAuth2PasswordBearer(tokenUrl="/auth/login")



async def get_current_user(request: Request, session: Session = Depends(get_session)):
    
    # payload = decode_token(token)
    payload =  decode_token(request.cookies.get("access_token"))
    print(payload)

    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    
    username = payload.get("username")

    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    
    user = session.exec(select(User).where(User.username == username)).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user



