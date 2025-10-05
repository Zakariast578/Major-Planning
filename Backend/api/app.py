from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
from fastapi.middleware.cors import CORSMiddleware


# -------------------------------
# 1️⃣ Initialize FastAPI
# -------------------------------
app = FastAPI()


# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your frontend URL
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
# 3️⃣ Define JSON schema (raw inputs only)
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
# 5️⃣ Helper function to compute derived features

def compute_features(df):
    # -------------------------------
    # 1️⃣ Define subject groups
    # -------------------------------
    math_phy = ['math_score', 'physics_score']
    che_bio = ['chemistry_score', 'biology_score']
    geo_bio = ['geography_score', 'biology_score']
    eng_hist = ['english_score', 'history_score']

    # -------------------------------
    # 2️⃣ Calculate total scores
    # -------------------------------
    df['math_physics_total'] = df[math_phy].sum(axis=1)
    df['chem_biology_total'] = df[che_bio].sum(axis=1)
    df['geo_biology_total'] = df[geo_bio].sum(axis=1)
    df['english_history_total'] = df[eng_hist].sum(axis=1)
    
    # Overall total score across all subjects
    df['overall_total_score'] = df[math_phy + che_bio + geo_bio + eng_hist].sum(axis=1)

    # -------------------------------
    # 3️⃣ Calculate average scores
    # -------------------------------
    df['math_physics_avg'] = df[math_phy].mean(axis=1).round(2)
    df['chem_biology_avg'] = df[che_bio].mean(axis=1).round(2)
    df['geo_biology_avg'] = df[geo_bio].mean(axis=1).round(2)
    df['english_history_avg'] = df[eng_hist].mean(axis=1).round(2)
    df['overall_average_score'] = df[math_phy + che_bio + geo_bio + eng_hist].mean(axis=1).round(2)

    # -------------------------------
    # 4️⃣ Binary comparison indicators
    # -------------------------------
    df['is_higher_math_phy'] = (df['math_physics_total'] > df['chem_biology_total']).astype(int)
    df['is_higher_che_bio'] = (df['chem_biology_total'] > df['math_physics_total']).astype(int)
    df['is_higher_non_stem'] = (df[['english_score', 'history_score', 'geography_score']].sum(axis=1) > 255).astype(int)
    df['is_higher_geo_bio'] = (df['geo_biology_total'] > 180).astype(int)
    df['is_higher_eng_hist'] = (df['english_history_total'] > 180).astype(int)

    # -------------------------------
    # 5️⃣ Study efficiency
    # -------------------------------
    df['study_efficiency'] = df['weekly_self_study_hours'] / (df['absence_days'] + 1)
    df['study_efficiency'] = df['study_efficiency'].replace([np.inf, -np.inf], 0).fillna(0).round(2)

    # -------------------------------
    # 6️⃣ Normalize study efficiency
    # -------------------------------
    min_eff = df['study_efficiency'].min()
    max_eff = df['study_efficiency'].max()
    if max_eff - min_eff != 0:
        df['study_efficiency_norm'] = ((df['study_efficiency'] - min_eff) / (max_eff - min_eff)).round(3)
    else:
        df['study_efficiency_norm'] = 0.0

    # -------------------------------
    # Return the full DataFrame; X_input will select correct columns later
    # -------------------------------
    return df



# -------------------------------
# 6️⃣ Root endpoint
# -------------------------------
@app.get("/")
def read_root():
    return {"message": "Hello Students! Welcome to the Major Recommendation API."}

# -------------------------------
# 7️⃣ Prediction endpoint
# -------------------------------
@app.post("/predict")
def predict_major(student: StudentData):
    # Convert input JSON to DataFrame
    df = pd.DataFrame([student.dict()])

    # Compute all derived features
    df = compute_features(df)

    # Ensure only trained feature columns are used
    X_input = df[feature_columns]

    # Make predictions
    rf_pred = rf_model.predict(X_input)
    xgb_pred = xgb_model.predict(X_input)
    stack_pred = stack_model.predict(X_input)

    # Decode numeric labels back to majors
    rf_label = label_encoder.inverse_transform(rf_pred)[0]
    xgb_label = label_encoder.inverse_transform(xgb_pred)[0]
    stack_label = label_encoder.inverse_transform(stack_pred)[0]

    return {
        "RandomForest": rf_label,
        "XGBoost": xgb_label,
        "StackingEnsemble": stack_label
    }
