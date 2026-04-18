from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher
from jose import jwt, JWTError
from config import get_settings
from datetime import datetime, timedelta
from uuid import UUID

settings = get_settings()
hash_context = PasswordHash((Argon2Hasher(),))

def hash_password(password: str) -> str:
    return hash_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_context.verify(plain_password, hashed_password)

def create_access_token(user_id: UUID, version: int) -> str:
    """ 
    Create Access Token using user_id and token_version.
    Access tokens are short-lived.
    """
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        "sub": str(user_id),
        "version": version,
        "type": "access",
        "exp": expire
    }
    return jwt.encode(payload, settings.jwt_secret, settings.jwt_algorithm)

def create_refresh_token(user_id: UUID, version: int) -> str:
    """ 
    Create Refresh Token using user_id and token_version.
    Refresh tokens use a different secret for isolation.
    """
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    payload = {
        "sub": str(user_id),
        "version": version,
        "type": "refresh",
        "exp": expire
    }
    return jwt.encode(payload, settings.jwt_refresh_secret, settings.jwt_algorithm)

def create_reset_token(user_id: UUID) -> str:
    """ Create a short-lived token for password reset using its own secret. """
    expire = datetime.utcnow() + timedelta(hours=1)
    payload = {
        "sub": str(user_id),
        "type": "password_reset",
        "exp": expire
    }
    return jwt.encode(payload, settings.jwt_reset_secret, settings.jwt_algorithm)

def decode_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.jwt_secret, settings.jwt_algorithm)
        if payload.get("type") == "access":
            return payload
        return None
    except JWTError:
        return None

def decode_refresh_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.jwt_refresh_secret, settings.jwt_algorithm)
        if payload.get("type") == "refresh":
            return payload
        return None
    except JWTError:
        return None

def decode_reset_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.jwt_reset_secret, settings.jwt_algorithm)
        if payload.get("type") == "password_reset":
            return payload.get("sub")
        return None
    except JWTError:
        return None
