from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    groq_api_key: str = ""

    EMAIL_USER: str = ""
    EMAIL_PASSWORD: str = ""
    ALERT_EMAIL: str = ""

    

    class Config:
        env_file = ".env",
        extra="ignore"


settings = Settings()