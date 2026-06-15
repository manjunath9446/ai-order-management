from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models import (
    AIAction,
    OrderPrediction
)

router = APIRouter(
    prefix="/actions",
    tags=["AI Actions"]
)


@router.post("/generate")
def generate_actions(
    db: Session = Depends(get_db)
):

    predictions = (
        db.query(OrderPrediction)
        .filter(
            OrderPrediction.risk_level == "HIGH"
        )
        .all()
    )

    created = 0

    for p in predictions:

        action = AIAction(
            order_id=p.order_id,
            action_type="EXPEDITE",
            recommendation=
                f"Prioritize Order {p.order_id}",
            priority="HIGH"
        )

        db.add(action)

        created += 1

    db.commit()

    return {
        "actions_created": created
    }


@router.get("/")
def get_actions(
    db: Session = Depends(get_db)
):

    return (
        db.query(AIAction)
        .all()
    )


@router.patch("/{action_id}/approve")
def approve_action(
    action_id: int,
    db: Session = Depends(get_db)
):

    action = (
        db.query(AIAction)
        .filter(
            AIAction.id == action_id
        )
        .first()
    )

    if not action:

        return {
            "error": "Action not found"
        }

    action.status = "APPROVED"

    db.commit()

    return action