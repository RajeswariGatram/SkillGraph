import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import db_manager
from app.api.v1 import health, employees, skills, teams, graph

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("cognodb.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan Manager:
    Handles connection pool initialization on startup and graceful teardown on shutdown.
    """
    logger.info("Initializing CognoDB database connection pool...")
    await db_manager.initialize()
    yield
    logger.info("Closing CognoDB database connection pool...")
    await db_manager.close()

app = FastAPI(
    title=settings.APP_NAME,
    description="SkillGraph API: Enterprise Talent & Collaboration Graph Engine backed by CognoDB (openCypher)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local development and hosted frontend (Vercel/Netlify)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(health.router, prefix="/api/v1")
app.include_router(employees.router, prefix="/api/v1")
app.include_router(skills.router, prefix="/api/v1")
app.include_router(teams.router, prefix="/api/v1")
app.include_router(graph.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "status": "running",
        "docs_url": "/docs",
        "health_check": "/api/v1/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
