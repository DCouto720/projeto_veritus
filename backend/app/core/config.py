from pydantic_settings import BaseSettings, SettingsConfigDict
import re

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra='ignore')

    # Variáveis opcionais (funciona no Local e no Render)
    POSTGRES_USER: str | None = None
    POSTGRES_PASSWORD: str | None = None
    POSTGRES_HOST: str | None = None
    POSTGRES_PORT: int | None = None
    POSTGRES_DB: str | None = None
    
    # URL principal
    DATABASE_URL: str | None = None
    
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        url = self.DATABASE_URL
        
        # 1. Fallback para ambiente local se não houver URL completa
        if not url:
            if not self.POSTGRES_HOST:
                return "sqlite+aiosqlite:///:memory:"
            
            # Monta a URL local (geralmente sem SSL)
            return (
                f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@"
                f"{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
            )

        # 2. DETECÇÃO DE NECESSIDADE DE SSL (Lógica Híbrida)
        # Se a URL tem 'sslmode', é nuvem (Neon/Render). Se não tem, é local.
        needs_ssl = "sslmode=require" in url

        # 3. LIMPEZA (Remove parâmetros que o asyncpg não entende)
        url = re.sub(r'[?&]sslmode=[^&]+', '', url)
        url = re.sub(r'[?&]channel_binding=[^&]+', '', url)

        # 4. CORREÇÃO DE DRIVER
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)

        # 5. APLICAÇÃO CONDICIONAL DE SSL
        # Só adiciona ssl=require se 'sslmode' estava presente originalmente (Nuvem)
        if needs_ssl:
            separator = "&" if "?" in url else "?"
            if "ssl=" not in url:
                url += f"{separator}ssl=require"

        return url

    # Configurações gerais
    PROJECT_NAME: str = "Projeto GE"
    API_V1_STR: str = "/api/v1"

settings = Settings()