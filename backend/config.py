from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str

    jwt_algorithm: str =  "HS256"

    class Config:
        env_file = ".env"

    

@lru_cache
def get_settings() -> Settings:
    return Settings()

