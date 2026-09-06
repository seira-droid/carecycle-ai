from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    project_name: str = "CareCycle AI"
    environment: str = "development"
    # database_url: str = "postgresql://user:password@localhost:5432/carecycle"
    
    class Config:
        env_file = ".env"

settings = Settings()
