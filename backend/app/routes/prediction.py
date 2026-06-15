from fastapi import APIRouter
from pydantic import BaseModel

import joblib
import pandas as pd
from pathlib import Path
from app.models import OrderPrediction
from app.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter(
    prefix="/predict",
    tags=["AI Prediction"]
)

# -----------------------
# Load Model
# -----------------------

import os
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

MODEL_PATH = BASE_DIR / "models_ai" / "tat_model.pkl"

model = None

if MODEL_PATH.exists():

    model = joblib.load(
        MODEL_PATH
    )

# -----------------------
# Request Schema
# -----------------------

class TATPredictionRequest(BaseModel):

    power: float

    inventory_available: int

    queue_depth: int

    machine_load: float

    utilization_percent: float

    qc_failures: int

    sla_hours: int = 72


# -----------------------
# Helper
# -----------------------

def prepare_features(
    payload: TATPredictionRequest
):

    df = pd.DataFrame(
        [
            {
                "power": payload.power,
                "inventory_available": payload.inventory_available,
                "queue_depth": payload.queue_depth,
                "machine_load": payload.machine_load,
                "utilization_percent": payload.utilization_percent,
                "qc_failures": payload.qc_failures,
                "sla_hours": payload.sla_hours
            }
        ]
    )

    return df


# -----------------------
# Predict TAT
# -----------------------

@router.post("/tat")
def predict_tat(
    payload: TATPredictionRequest
):

    features = prepare_features(
        payload
    )

    if model:

    prediction = model.predict(
        features
    )[0]

    else:

    prediction = (
        payload.queue_depth * 2 +
        payload.machine_load * 0.5 +
        payload.qc_failures * 10
    )

    return {
        "predicted_completion_hours": round(
            float(prediction),
            2
        )
    }


# -----------------------
# Predict Risk
# -----------------------

@router.post("/risk")
def predict_risk(
    payload: TATPredictionRequest
):

    features = prepare_features(
        payload
    )

    prediction = model.predict(
        features
    )[0]

    sla = payload.sla_hours

    if prediction > sla:

        risk = "HIGH"

    elif prediction > (sla * 0.8):

        risk = "MEDIUM"

    else:

        risk = "LOW"

    return {
        "predicted_completion_hours": round(
            float(prediction),
            2
        ),
        "sla_hours": sla,
        "risk": risk
    }
@router.post("/save")
def save_prediction(
    payload: TATPredictionRequest,
    db: Session = Depends(get_db)
):

    features = prepare_features(payload)

    prediction = model.predict(features)[0]

    sla = payload.sla_hours

    if prediction > sla:
        risk = "HIGH"
    elif prediction > (sla * 0.8):
        risk = "MEDIUM"
    else:
        risk = "LOW"

    prediction_row = OrderPrediction(
        order_id=1,
        predicted_tat=int(prediction),
        delay_probability=min(
            int((prediction / sla) * 100),
            100
        ),
        risk_level=risk
    )

    db.add(prediction_row)
    db.commit()
    db.refresh(prediction_row)

    return {
        "id": prediction_row.id,
        "predicted_tat": prediction_row.predicted_tat,
        "risk_level": prediction_row.risk_level
    }