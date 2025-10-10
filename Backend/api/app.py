from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# -------------------------------
# 1️⃣ Initialize FastAPI
# -------------------------------
app = FastAPI()

# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL"),
                   "http://localhost:5173"
                   ],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# 2️⃣ Global variables (loaded on startup)
# -------------------------------
rf_model = None
xgb_model = None
stack_model = None
feature_columns = None
label_encoder = None

# -------------------------------
# 3️⃣ Define JSON schema
# -------------------------------
class StudentData(BaseModel):
    part_time_job: int
    absence_days: int
    extracurricular_activities: int
    weekly_self_study_hours: float
    math_score: float
    physics_score: float
    chemistry_score: float
    biology_score: float
    english_score: float
    history_score: float
    geography_score: float
    

# -------------------------------
# 4️⃣ Load models on startup
# -------------------------------
@app.on_event("startup")
def load_models():
    global rf_model, xgb_model, stack_model, feature_columns, label_encoder

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

    rf_model = joblib.load(os.path.join(MODELS_DIR, "random_forest.pkl"))
    xgb_model = joblib.load(os.path.join(MODELS_DIR, "xgboost.pkl"))
    stack_model = joblib.load(os.path.join(MODELS_DIR, "stacking_ensemble.pkl"))
    feature_columns = joblib.load(os.path.join(MODELS_DIR, "feature_columns.pkl"))
    label_encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))

# -------------------------------
# 5️⃣ Root endpoint
# -------------------------------
@app.get("/")
def read_root():
    return {"message": "Hello Students! Welcome to the Major Recommendation API."}

# -------------------------------
# 6️⃣ Prediction endpoint
# -------------------------------
@app.post("/predict")
def predict_major(student: StudentData, top_n: int = 3):
    # Convert input JSON to DataFrame
    df = pd.DataFrame([student.dict()])

    # Ensure only trained feature columns are used
    X_input = df[feature_columns]

    predictions = {}
    for name, model in [
        ("XGBoost", xgb_model),
        # ("Random Forest", rf_model),
        # ("Stacking Ensemble", stack_model),
    ]:
        # Predict single label
        pred_encoded = model.predict(X_input)[0]
        pred_label = label_encoder.inverse_transform([int(pred_encoded)])[0]

        # Get top N probabilities
        proba = model.predict_proba(X_input)[0]
        top_idx = np.argsort(proba)[::-1][:top_n]
        top_labels = label_encoder.inverse_transform(top_idx)
        top_probs = proba[top_idx] * 100

        # ✅ Convert NumPy data to native Python types
        top_n_result = [
            {"faculty": str(label), "probability": float(prob)}
            for label, prob in zip(top_labels, top_probs)
        ]

        predictions[name] = {
            "predicted_faculty": str(pred_label),
            "top_n": top_n_result,
        }

    return predictions
