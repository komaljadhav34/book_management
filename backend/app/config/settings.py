from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Book Management System"
    MONGO_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "book_management"
    JWT_SECRET: str = "a-very-secret-key-that-should-be-changed"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 1 day

    class Config:
        env_file = ".env"

settings = Settings()
