from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    jwt_refresh_secret: str
    jwt_reset_secret: str = "super-secret-reset-key" # Should be in .env
    jwt_algorithm: str =  "HS256"
    access_token_expire_minutes: int = 1440 # 1 day
    refresh_token_expire_days: int = 7

    # SMTP Settings (Mailtrap)
    smtp_host: str = "sandbox.smtp.mailtrap.io"
    smtp_port: int = 2525
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str = "noreply@pharmacymgmt.com"
    smtp_from_name: str = "Pharmacy Management System"
    smtp_tls: bool = True
    smtp_ssl: bool = False

    class Config:
        env_file = ".env"

    

@lru_cache
def get_settings() -> Settings:
    return Settings()

