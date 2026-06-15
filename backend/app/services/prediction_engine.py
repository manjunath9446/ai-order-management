from sqlalchemy.orm import Session

from app.models import (
    Order,
    OrderPrediction
)

from app.services.feature_builder import (
    build_features
)

from app.services.ml_prediction_engine import (
    predict
)

from app.services.risk_prediction_engine import (
    predict_risk
)


def predict_order(
    db: Session,
    order_id: int
):

    features = build_features(
        db,
        order_id
    )

    if not features:
        return None

    order = (
        db.query(Order)
        .filter(
            Order.id == order_id
        )
        .first()
    )

    if not order:
        return None

    tat_features = {
        "power":
            features["power"],

        "inventory_available":
            features["inventory_available"],

        "queue_depth":
            features["queue_depth"],

        "machine_load":
            features["machine_load"],

        "utilization_percent":
            features["utilization_percent"],

        "qc_failures":
            features["qc_failures"],

        "sla_hours":
            features["sla_hours"]
    }

    predicted_tat = predict(
        tat_features
    )

    risk_features = {
        "power":
            features["power"],

        "inventory_available":
            features["inventory_available"],

        "queue_depth":
            features["queue_depth"],

        "machine_load":
            features["machine_load"],

        "utilization_percent":
            features["utilization_percent"],

        "qc_failures":
            features["qc_failures"],

        "sla_hours":
            features["sla_hours"],

        "predicted_tat":
            predicted_tat
    }

    risk_result = predict_risk(
        risk_features
    )

    prediction = OrderPrediction(
        order_id=order_id,
        predicted_tat=predicted_tat,
        delay_probability=
            risk_result["delay_probability"],
        risk_level=
            risk_result["risk_level"]
    )

    db.add(prediction)

    db.commit()

    db.refresh(prediction)

    return prediction