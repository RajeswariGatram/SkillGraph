import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "SkillGraph API"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CognoDB Secrets loaded from environment
    COGNODB_URI: str = "bolt+s://demo.databases.cognodb.cloud"
    COGNODB_USER: str = "cognodb"
    COGNODB_PASSWORD: str = "change_me"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
