from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    DATABASE_URL: str = "sqlite:///./order_management.db"

    groq_api_key: str = ""

    email_user: str = ""

    email_password: str = ""

    alert_email: str = ""

    class Config:
        env_file = ".env"

settings = Settings()