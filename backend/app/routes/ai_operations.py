from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
import json
from app.services.llm_decision_engine import (
    analyze_order,
    generate_copilot_summary
)
from app.services.llm_decision_engine import (
    analyze_order
)
from app.database import get_db
from app.models import Order
from app.models import (
    OrderPrediction
)

from app.services.prediction_engine import (
    predict_order
)
from app.services.feature_builder import (
    build_features
)
router = APIRouter(
    prefix="/ai",
    tags=["AI Operations"]
)


@router.post(
    "/predict-order/{order_id}"
)
def predict_single_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    prediction = predict_order(
        db,
        order_id
    )

    if not prediction:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return prediction


@router.get("/predictions")
def get_predictions(
    db: Session = Depends(get_db)
):

    return db.query(
        OrderPrediction
    ).all()


@router.get(
    "/order-risk/{order_id}"
)
def get_order_risk(
    order_id: int,
    db: Session = Depends(get_db)
):

    prediction = (
        db.query(OrderPrediction)
        .filter(
            OrderPrediction.order_id
            == order_id
        )
        .order_by(
            OrderPrediction.id.desc()
        )
        .first()
    )

    if not prediction:

        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return {
        "order_id": order_id,
        "risk_level": prediction.risk_level,
        "delay_probability":
            prediction.delay_probability
    }


@router.get(
    "/delay-dashboard"
)
def delay_dashboard(
    db: Session = Depends(get_db)
):

    total = db.query(
        OrderPrediction
    ).count()

    high = (
        db.query(OrderPrediction)
        .filter(
            OrderPrediction.risk_level
            == "HIGH"
        )
        .count()
    )

    medium = (
        db.query(OrderPrediction)
        .filter(
            OrderPrediction.risk_level
            == "MEDIUM"
        )
        .count()
    )

    low = (
        db.query(OrderPrediction)
        .filter(
            OrderPrediction.risk_level
            == "LOW"
        )
        .count()
    )

    return {
        "total_predictions": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low
    }
@router.get(
    "/explain-order/{order_id}"
)
def explain_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    prediction = (
        db.query(OrderPrediction)
        .filter(
            OrderPrediction.order_id
            == order_id
        )
        .order_by(
            OrderPrediction.id.desc()
        )
        .first()
    )

    if not prediction:

        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    features = build_features(
        db,
        order_id
    )

    payload = {
        **features,
        "predicted_tat":
            prediction.predicted_tat,

        "risk_level":
            prediction.risk_level,

        "delay_probability":
            prediction.delay_probability
    }

    result = analyze_order(
        payload
    )

    return json.loads(result)
@router.get("/recommendations")
def recommendations_dashboard(
    db: Session = Depends(get_db)
):

    predictions = db.query(
        OrderPrediction
    ).all()

    actions = []

    for p in predictions:

        if p.risk_level == "HIGH":

            actions.append({
                "order_id": p.order_id,
                "priority": "HIGH",
                "action": "Expedite processing"
            })

        elif p.risk_level == "MEDIUM":

            actions.append({
                "order_id": p.order_id,
                "priority": "MEDIUM",
                "action": "Monitor queue"
            })

    return {
        "recommendations": actions,
        "count": len(actions)
    }
@router.get("/summary")
def ai_summary(
    db: Session = Depends(get_db)
):

    total = db.query(
        OrderPrediction
    ).count()

    high = db.query(
        OrderPrediction
    ).filter(
        OrderPrediction.risk_level == "HIGH"
    ).count()

    medium = db.query(
        OrderPrediction
    ).filter(
        OrderPrediction.risk_level == "MEDIUM"
    ).count()

    low = db.query(
        OrderPrediction
    ).filter(
        OrderPrediction.risk_level == "LOW"
    ).count()

    return {
        "total_predictions": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low
    }
@router.post("/predict-all")
def predict_all_orders(
    db: Session = Depends(get_db)
):

    orders = db.query(
        Order
    ).all()

    created = 0

    for order in orders:

        try:

            predict_order(
                db,
                order.id
            )

            created += 1

        except:
            pass

    return {
        "predictions_created": created
    }
@router.delete("/predictions")
def clear_predictions(
    db: Session = Depends(get_db)
):
    db.query(
        OrderPrediction
    ).delete()

    db.commit()

    return {
        "message": "Predictions Cleared"
    }
@router.get("/alerts")
def ai_alerts(
    db: Session = Depends(get_db)
):

    predictions = (
        db.query(OrderPrediction)
        .all()
    )

    alerts = []

    for p in predictions:

        if p.risk_level == "HIGH":

            alerts.append({
                "order_id":
                    p.order_id,

                "severity":
                    "HIGH",

                "message":
                    f"Order {p.order_id} likely to breach SLA"
            })

    return alerts
@router.get("/copilot")
def ai_copilot(
    db: Session = Depends(get_db)
):

    predictions = db.query(
        OrderPrediction
    ).all()

    high = len([
        p for p in predictions
        if p.risk_level == "HIGH"
    ])

    medium = len([
        p for p in predictions
        if p.risk_level == "MEDIUM"
    ])

    low = len([
        p for p in predictions
        if p.risk_level == "LOW"
    ])

    prompt = f"""
You are an AI Operations Manager.

Current factory status:

High Risk Orders: {high}
Medium Risk Orders: {medium}
Low Risk Orders: {low}

Provide:

1. Executive Summary
2. Key Risks
3. Recommended Actions

Keep it concise.
"""

    summary = generate_copilot_summary(
        prompt
    )

    return {
        "summary": summary,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low
    }