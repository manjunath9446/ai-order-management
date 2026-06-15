import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "models_ai",
    "risk_model.pkl"
)

risk_model = joblib.load(
    MODEL_PATH
)


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