from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models import (
    AIAlert,
    OrderPrediction
)

router = APIRouter(
    prefix="/alerts",
    tags=["AI Alerts"]
)

# STEP 4
@router.post("/generate")
def generate_alerts(
    db: Session = Depends(get_db)
):

    predictions = (
        db.query(OrderPrediction)
        .all()
    )

    created = 0

    for p in predictions:

        if p.risk_level == "HIGH":

            alert = AIAlert(
                order_id=p.order_id,
                severity="HIGH",
                title="SLA Breach Risk",
                message=f"Order {p.order_id} likely to breach SLA"
            )

            db.add(alert)

            created += 1

    db.commit()

    return {
        "alerts_created": created
    }


# STEP 5
@router.get("/")
def get_alerts(
    db: Session = Depends(get_db)
):

    return (
        db.query(AIAlert)
        .order_by(
            AIAlert.id.desc()
        )
        .all()
    )


# STEP 6
@router.get("/summary")
def alert_summary(
    db: Session = Depends(get_db)
):

    open_alerts = (
        db.query(AIAlert)
        .filter(
            AIAlert.status == "OPEN"
        )
        .count()
    )

    high_alerts = (
        db.query(AIAlert)
        .filter(
            AIAlert.severity == "HIGH"
        )
        .count()
    )

    return {
        "open_alerts": open_alerts,
        "high_alerts": high_alerts
    }