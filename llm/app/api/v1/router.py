from fastapi import APIRouter
from .endpoints import ai

api_router = APIRouter()
api_router.include_router(
    ai.router,
    prefix="/api/v1",
    tags=["ai"]
)
