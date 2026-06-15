import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models_ai",
    "tat_model.pkl"
)

model = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)


def predict(features):

    if model:

        data = pd.DataFrame(
            [features]
        )

        prediction = model.predict(
            data
        )[0]

        return round(
            float(prediction),
            2
        )

    # Render fallback

    prediction = (
        features["queue_depth"] * 2 +
        features["machine_load"] * 0.5 +
        features["qc_failures"] * 10
    )

    return round(
        float(prediction),
        2
    )