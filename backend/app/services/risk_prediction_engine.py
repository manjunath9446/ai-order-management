import os
import joblib
import pandas as pd

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

MODEL_PATH = BASE_DIR / "models_ai" / "risk_model.pkl"

print("Risk Model Path:", MODEL_PATH)

risk_model = joblib.load(MODEL_PATH)


def predict_risk(features):

    data = pd.DataFrame(
        [features]
    )

    probability = (
        risk_model
        .predict_proba(data)[0][1]
    )

    if probability >= 0.80:

        risk = "HIGH"

    elif probability >= 0.50:

        risk = "MEDIUM"

    else:

        risk = "LOW"

    return {

        "risk_level": risk,

        "delay_probability":
            round(
                probability * 100,
                2
            )
    }