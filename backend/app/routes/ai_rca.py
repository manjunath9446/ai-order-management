from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models import (
    OrderPrediction
)

from app.services.feature_builder import (
    build_features
)

from app.services.llm_decision_engine import (
    analyze_order
)

import json

router = APIRouter(
    prefix="/ai",
    tags=["AI Root Cause Analysis"]
)


@router.get("/root-cause/{order_id}")
def root_cause_analysis(
    order_id: int,
    db: Session = Depends(get_db)
):

    prediction = (
        db.query(OrderPrediction)
        .filter(
            OrderPrediction.order_id == order_id
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

    prompt_data = {
        "task":
            "Root Cause Analysis",
        "order":
            payload
    }

    result = analyze_order(
        prompt_data
    )

    try:

        cleaned = (
            result
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(cleaned)

    except Exception as e:

        return {
         "raw_response": result,
         "error": str(e)
        }