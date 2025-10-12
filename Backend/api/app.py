from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models & encoders
rf_model = None
xgb_model = None
stack_model = None
feature_columns = None
label_encoder = None

# Input JSON schema
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

@app.on_event("startup")
def load_models():
    global rf_model, xgb_model, stack_model, feature_columns, label_encoder
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

    # rf_model = joblib.load(os.path.join(MODELS_DIR, "random_forest.pkl"))
    xgb_model = joblib.load(os.path.join(MODELS_DIR, "xgboost_tuned.pkl"))
    # stack_model = joblib.load(os.path.join(MODELS_DIR, "stacking_ensemble.pkl"))
    feature_columns = joblib.load(os.path.join(MODELS_DIR, "feature_columns.pkl"))
    label_encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))

@app.get("/")
def read_root():
    return {"message": "Hello Students! Major Recommendation API is running."}

@app.post("/predict")
def predict_major(student: StudentData, top_n: int = 3):
    df = pd.DataFrame([student.dict()])

    # -------------------------------
    # Feature Engineering
    # -------------------------------
    # Basic aggregates
    df['total_Score'] = df[['math_score','physics_score','chemistry_score','biology_score',
                            'english_score','history_score','geography_score']].sum(axis=1)
    df['avg_score'] = df['total_Score'] / 7
    df['math_physics'] = df[['math_score','physics_score']].sum(axis=1)
    df['biology_chemistry'] = df[['biology_score','chemistry_score']].sum(axis=1)
    df['science'] = df[['math_score','physics_score','chemistry_score','biology_score']].sum(axis=1)
    df['humanities'] = df[['english_score','history_score','geography_score']].sum(axis=1)

    # Average scores
    df['avg_science'] = df[['math_score','physics_score','chemistry_score','biology_score']].mean(axis=1)
    df['avg_humanities'] = df[['english_score','history_score','geography_score']].mean(axis=1)
    df['avg_math_physics'] = df[['math_score','physics_score']].mean(axis=1)
    df['avg_bio_chem'] = df[['biology_score','chemistry_score']].mean(axis=1)
    df['avg_english_history_geo'] = df[['english_score','history_score','geography_score']].mean(axis=1)

    # Binary indicators
    df['is_high_self_study_per_week'] = (df['weekly_self_study_hours'] > 10).astype(int)
    df['has_more_absences'] = (df['absence_days'] > 5).astype(int)
    df['high_absence_low_study'] = ((df['absence_days'] > 5) & (df['weekly_self_study_hours'] < 5)).astype(int)
    df['high_extracurricular_high_study'] = ((df['extracurricular_activities'] > 2) &
                                            (df['weekly_self_study_hours'] > 10)).astype(int)
    df['low_study_high_extracurricular'] = ((df['weekly_self_study_hours'] < 5) &
                                           (df['extracurricular_activities'] > 2)).astype(int)
    df['high_study_low_absence'] = ((df['weekly_self_study_hours'] > 15) &
                                    (df['absence_days'] < 3)).astype(int)

    # Ratios
    df['science_ratio'] = df['science'] / df['total_Score']
    df['humanities_ratio'] = df['humanities'] / df['total_Score']
    df['math_ratio'] = df['math_score'] / df['science']
    df['english_ratio'] = df['english_score'] / df['humanities']
    df['physics_ratio'] = df['physics_score'] / df['science']
    df['chemistry_ratio'] = df['chemistry_score'] / df['science']
    df['biology_ratio'] = df['biology_score'] / df['science']
    df['history_ratio'] = df['history_score'] / df['humanities']
    df['geography_ratio'] = df['geography_score'] / df['humanities']

    # Differences & interactions
    df['stem_humanities_diff'] = df['science'] - df['humanities']
    df['stem_humanities_ratio'] = df['science'] / (df['humanities'] + 1)
    df['logic_ability'] = df['math_score'] + df['physics_score']
    df['memory_ability'] = df['history_score'] + df['biology_score']

    # Relative vs average
    for col in ['math_score','physics_score','chemistry_score','biology_score',
                'english_score','history_score','geography_score']:
        df[f'{col}_vs_avg'] = df[col] - df['avg_score']

    # Score consistency
    df['score_gap'] = df[['math_score','physics_score','chemistry_score','biology_score',
                          'english_score','history_score','geography_score']].max(axis=1) - \
                      df[['math_score','physics_score','chemistry_score','biology_score',
                          'english_score','history_score','geography_score']].min(axis=1)
    df['score_variance'] = df[['math_score','physics_score','chemistry_score','biology_score',
                               'english_score','history_score','geography_score']].var(axis=1)
    df['score_std'] = df[['math_score','physics_score','chemistry_score','biology_score',
                          'english_score','history_score','geography_score']].std(axis=1)

    # Dominant area
    df['dominant_area'] = df[['science','humanities']].idxmax(axis=1)
    df = pd.get_dummies(df, columns=['dominant_area'], drop_first=False)

    # -------------------------------
    # Use only trained features
    # -------------------------------
    # Fill any missing dummy columns with 0
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0
    X_input = df[feature_columns]

    # -------------------------------
    # Make predictions
    # -------------------------------
    predictions = {}
    for name, model in [
        ("XGBoost", xgb_model),
        # ("Random Forest", rf_model),
        # ("Stacking Ensemble", stack_model),
    ]:
        pred_encoded = model.predict(X_input)[0]
        pred_label = label_encoder.inverse_transform([int(pred_encoded)])[0]

        proba = model.predict_proba(X_input)[0]
        top_idx = np.argsort(proba)[::-1][:top_n]
        top_labels = label_encoder.inverse_transform(top_idx)
        top_probs = proba[top_idx] * 100

        top_n_result = [
            {"faculty": str(label), "probability": float(prob)}
            for label, prob in zip(top_labels, top_probs)
        ]

        predictions[name] = {
            "predicted_faculty": str(pred_label),
            "top_n": top_n_result,
        }

    return {"predictions": predictions}
