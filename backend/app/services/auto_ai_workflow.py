import pandas as pd

from app.models import (
    OrderPrediction,
    AIAlert,
    AIAction
)

from app.services.email_service import (
    send_alert_email
)

from app.routes.prediction import model


def run_ai_workflow(
    db,
    order
):

    print("AI WORKFLOW STARTED")
    print("ORDER ID:", order.id)

    features = pd.DataFrame([
        {
            "power": float(order.power),

            "inventory_available":
                1 if order.inventory_available
                else 0,

            "queue_depth":
                order.queue_depth or 5,

            "machine_load":
                order.machine_load or 40,

            "utilization_percent":
                order.utilization_percent or 50,

            "qc_failures":
                order.qc_failures or 0,

            "sla_hours":
                order.sla_hours
        }
    ])

    prediction = model.predict(
        features
    )[0]

    if prediction > order.sla_hours:

        risk = "HIGH"

    elif prediction > (
        order.sla_hours * 0.8
    ):

        risk = "MEDIUM"

    else:

        risk = "LOW"

    print(
        f"Prediction={int(prediction)} "
        f"Risk={risk}"
    )

    prediction_row = OrderPrediction(

        order_id=order.id,

        predicted_tat=int(
            prediction
        ),

        delay_probability=min(
            int(
                (prediction /
                 order.sla_hours) * 100
            ),
            100
        ),

        risk_level=risk
    )

    db.add(
        prediction_row
    )

    # ==========================
    # ALERT + ACTION
    # ==========================

    if risk in ["HIGH", "MEDIUM"]:

        alert = AIAlert(

            order_id=order.id,

            severity=risk,

            title="SLA Breach Risk",

            message=(
                f"Order "
                f"{order.order_number} "
                f"is predicted to "
                f"miss SLA."
            ),

            status="OPEN"
        )

        db.add(alert)

        action = AIAction(

            order_id=order.id,

            action_type="EXPEDITE",

            recommendation=(
                f"Prioritize "
                f"{order.order_number}"
            ),

            priority=risk
        )

        db.add(action)

        try:

            send_alert_email(
                order.order_number,
                risk,
                int(prediction)
            )

            print(
                "EMAIL SENT"
            )

        except Exception as e:

            print(
                "EMAIL ERROR:",
                str(e)
            )

    db.commit()

    print(
        "AI WORKFLOW COMPLETED"
    )

    return {

        "risk": risk,

        "predicted_tat":
            int(prediction)

    }