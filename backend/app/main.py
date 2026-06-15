from fastapi import FastAPI
from sqlalchemy import inspect
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base
from app.database import engine
from app.routes import alerts
import app.models
from app.routes import ai_chat
from app.routes.orders import router as order_router
from app.routes.stores import router as store_router
from app.routes.inventory import router as inventory_router
from app.routes.dashboard import router as dashboard_router
from app.routes.prediction import router as prediction_router
from app.routes.operations import router as operations_router
from app.routes.seed import router as seed_router
from app.routes.ai_operations import (
    router as ai_router
)
from app.routes import ai_rca
from app.routes import ai_actions
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Order Management System",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ai-order-management-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(order_router)
app.include_router(store_router)
app.include_router(inventory_router)
app.include_router(dashboard_router)
app.include_router(
    prediction_router
)
app.include_router(
    ai_rca.router
)
app.include_router(
    ai_actions.router
)
app.include_router(
    alerts.router
)
app.include_router(
    ai_chat.router
)
app.include_router(
    ai_router
)
app.include_router(seed_router)
app.include_router(
    operations_router
)

@app.get("/")
def root():
    return {
        "message": "AI Order Management System Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/tables")
def get_tables():

    inspector = inspect(engine)

    return {
        "tables": inspector.get_table_names()
    }