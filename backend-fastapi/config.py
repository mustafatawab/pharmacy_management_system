from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    jwt_refresh_secret: str
    jwt_algorithm: str =  "HS256"
    access_token_expire_minutes: int = 1440 # 1 day
    refresh_token_expire_days: int = 7

    class Config:
        env_file = ".env"

    

@lru_cache
def get_settings() -> Settings:
    return Settings()

