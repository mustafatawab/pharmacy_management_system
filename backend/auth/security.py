from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher
from jose import jwt, JWTError
from config import get_settings
from datetime import date, datetime, timedelta


settings = get_settings()


hash_context = PasswordHash((Argon2Hasher(),))


def hash_password(password: str) -> str:
    """ Convert plain password to hash password """
    return hash_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """ Verify whether the password match with the hash """
    return hash_context.verify(plain_password,hashed_password)


def create_access_token(data: dict , expire_time: timedelta | None = None) -> str:
    """ Create JWT Access Token for the login """
    to_encode = data.copy()

    expire = datetime.utcnow() + (expire_time or timedelta(minutes=settings.access_token_expire_minutes))

    to_encode.update({"exp"  : expire})

    return jwt.encode(to_encode , settings.jwt_secret_key , settings.jwt_algorithm)


def decode_token(token) -> dict | None:
    try:
        return jwt.decode(token, settings.jwt_secret_key , settings.jwt_algorithm)
    except JWTError:
        return None
