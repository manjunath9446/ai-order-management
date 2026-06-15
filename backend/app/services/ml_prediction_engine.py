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
    "tat_model.pkl"
)

model = joblib.load(
    MODEL_PATH
)


def predict(features):

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