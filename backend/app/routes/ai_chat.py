from fastapi import APIRouter
from fastapi import Depends
from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    Order,
    OrderPrediction,
    Machine,
    ProductionQueue
)

from app.services.llm_decision_engine import (
    generate_copilot_summary
)

router = APIRouter(
    prefix="/ai",
    tags=["AI Copilot Chat"]
)


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def ai_chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    orders = db.query(Order).count()

    high_risk = (
        db.query(OrderPrediction)
        .filter(
            OrderPrediction.risk_level == "HIGH"
        )
        .count()
    )

    medium_risk = (
        db.query(OrderPrediction)
        .filter(
            OrderPrediction.risk_level == "MEDIUM"
        )
        .count()
    )

    machines = db.query(Machine).count()

    queue_size = (
        db.query(ProductionQueue)
        .count()
    )

    context = f"""
Factory Snapshot

Total Orders: {orders}
High Risk Orders: {high_risk}
Medium Risk Orders: {medium_risk}
Machines: {machines}
Queue Size: {queue_size}
"""

    prompt = f"""
You are an AI Operations Copilot.

{context}

User Question:
{request.question}

Answer based on operational data.
Keep answer concise.
"""

    answer = generate_copilot_summary(
        prompt
    )

    return {
        "question": request.question,
        "answer": answer
    }