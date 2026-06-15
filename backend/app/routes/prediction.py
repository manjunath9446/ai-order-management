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


# -----------------------
# Save Prediction
# -----------------------

@router.post("/save")
def save_prediction(
    payload: TATPredictionRequest,
    db: Session = Depends(get_db)
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

    sla = payload.sla_hours

    if prediction > sla:

        risk = "HIGH"

    elif prediction > (sla * 0.8):

        risk = "MEDIUM"

    else:

        risk = "LOW"

    prediction_row = OrderPrediction(

        order_id=1,

        predicted_tat=int(
            prediction
        ),

        delay_probability=min(
            int(
                (prediction / sla) * 100
            ),
            100
        ),

        risk_level=risk
    )

    db.add(
        prediction_row
    )

    db.commit()

    db.refresh(
        prediction_row
    )

    return {
        "id":
            prediction_row.id,

        "predicted_tat":
            prediction_row.predicted_tat,

        "risk_level":
            prediction_row.risk_level
    }