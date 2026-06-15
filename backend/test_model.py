import joblib

model = joblib.load("D:/ai-order/models_ai/tat_model.pkl")

print(model.feature_names_in_)