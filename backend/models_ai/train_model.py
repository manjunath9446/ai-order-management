import pandas as pd
import numpy as np
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import RandomForestClassifier

np.random.seed(42)

rows = []

for _ in range(5000):

    power = round(
        np.random.uniform(-8, 4),
        2
    )

    inventory_available = np.random.randint(
        0,
        2
    )

    queue_depth = np.random.randint(
        1,
        40
    )

    machine_load = np.random.randint(
        10,
        100
    )

    utilization_percent = np.random.randint(
        10,
        100
    )

    qc_failures = np.random.randint(
        0,
        5
    )

    sla_hours = 72

    predicted_tat = (
        20
        + abs(power) * 2
        + queue_depth * 1.2
        + machine_load * 0.15
        + qc_failures * 4
        + (12 if inventory_available == 0 else 0)
    )

    risk_score = (
        queue_depth * 0.8
        + machine_load * 0.5
        + qc_failures * 10
        + (20 if inventory_available == 0 else 0)
    )

    if risk_score > 90:
        breached = 1
    else:
        breached = 0

    rows.append({
        "power": power,
        "inventory_available": inventory_available,
        "queue_depth": queue_depth,
        "machine_load": machine_load,
        "utilization_percent": utilization_percent,
        "qc_failures": qc_failures,
        "sla_hours": sla_hours,
        "predicted_tat": predicted_tat,
        "breached": breached
    })

df = pd.DataFrame(rows)

# TAT MODEL

X_tat = df[
    [
        "power",
        "inventory_available",
        "queue_depth",
        "machine_load",
        "utilization_percent",
        "qc_failures",
        "sla_hours"
    ]
]

y_tat = df["predicted_tat"]

tat_model = RandomForestRegressor(
    n_estimators=300,
    random_state=42
)

tat_model.fit(
    X_tat,
    y_tat
)

joblib.dump(
    tat_model,
    "../models_ai/tat_model.pkl"
)

# RISK MODEL

X_risk = df[
    [
        "power",
        "inventory_available",
        "queue_depth",
        "machine_load",
        "utilization_percent",
        "qc_failures",
        "sla_hours",
        "predicted_tat"
    ]
]

y_risk = df["breached"]

risk_model = RandomForestClassifier(
    n_estimators=300,
    random_state=42
)

risk_model.fit(
    X_risk,
    y_risk
)

joblib.dump(
    risk_model,
    "../models_ai/risk_model.pkl"
)

print("Models Saved Successfully")