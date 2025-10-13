from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai

# -----------------------------------------
# 1️⃣ Environment Setup
# -----------------------------------------
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# Ensure API key is set
if not os.getenv("GEMINI_API_KEY"):
    raise ValueError("GEMINI_API_KEY not found in environment variables!")

os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
origins = [os.getenv("FRONTEND_URL", "http://localhost:5173")]

app = FastAPI(title="Student Major Prediction API")

# Allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------
# 2️⃣ Gemini Client
# -----------------------------------------
client = genai.Client()

# -----------------------------------------
# 3️⃣ ML Model Placeholders
# -----------------------------------------
xgb_model = None
feature_columns = None
label_encoder = None

# -----------------------------------------
# 4️⃣ Input Schema
# -----------------------------------------
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

# -----------------------------------------
# 5️⃣ Gemini Guide Helper with Debug
# -----------------------------------------
guides_cache = {}

def generate_learning_guide(predicted_faculty: str) -> str:
    
    if predicted_faculty in guides_cache:
        return guides_cache[predicted_faculty]

    prompt = f"""
    You are a friendly academic mentor. 

    Congratulate the student for being Faculty in '{predicted_faculty}'.
    Give a short, practical, and motivating study guide (~100 words) with clear advice:

    - **Do this:** Recommend key actions, habits, or strategies to succeed in this faculty.  
    - **Use these guides:** Suggest important subjects, skills, and resources that will help them grow.  
    - **Be a great student:** Encourage them to stay consistent, curious, and confident in their learning journey.  

    Keep the tone uplifting, inspiring, and supportive. Encourage them to keep working hard and celebrate their potential.
    """


    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt],
            config=genai.types.GenerateContentConfig(
                temperature=0.3,
                system_instruction="You are a helpful academic mentor."
            )
        )
        text = response.text.strip()
        guides_cache[predicted_faculty] = text
        return text
    except Exception as e:
        return f"Guidance currently unavailable. See server logs for details. Error: {e}"

# -----------------------------------------
# 6️⃣ Load ML Models at Startup
# -----------------------------------------
@app.on_event("startup")
def load_models():
    global xgb_model, feature_columns, label_encoder
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

    try:
        xgb_model = joblib.load(os.path.join(MODELS_DIR, "xgboost_tuned.pkl"))
        feature_columns = joblib.load(os.path.join(MODELS_DIR, "feature_columns.pkl"))
        label_encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))
    except Exception as e:
        print(f"Error loading model files. Ensure they are in the correct path ('../models/'). Details: {e}")

# -----------------------------------------
# 7️⃣ Health Check Endpoint
# -----------------------------------------
@app.get("/")
def read_root():
    return {"message": "Hello Students! Major Recommendation API with Gemini is running."}

# -----------------------------------------
# 8️⃣ Predict Endpoint with Debug Logging
# -----------------------------------------
@app.post("/predict")
def predict_major(student: StudentData, top_n: int = 3):
    if not xgb_model:
        return {"error": "Model not loaded. Check server logs."}

    df = pd.DataFrame([student.dict()])

    # Feature engineering (same as your previous logic)
    df['total_Score'] = df[['math_score','physics_score','chemistry_score','biology_score',
                            'english_score','history_score','geography_score']].sum(axis=1)
    df['avg_score'] = df['total_Score'] / 7
    df['math_physics'] = df[['math_score','physics_score']].sum(axis=1)
    df['biology_chemistry'] = df[['biology_score','chemistry_score']].sum(axis=1)
    df['science'] = df[['math_score','physics_score','chemistry_score','biology_score']].sum(axis=1)
    df['humanities'] = df[['english_score','history_score','geography_score']].sum(axis=1)
    df['avg_science'] = df[['math_score','physics_score','chemistry_score','biology_score']].mean(axis=1)
    df['avg_humanities'] = df[['english_score','history_score','geography_score']].mean(axis=1)
    df['avg_math_physics'] = df[['math_score','physics_score']].mean(axis=1)
    df['avg_bio_chem'] = df[['biology_score','chemistry_score']].mean(axis=1)
    df['avg_english_history_geo'] = df[['english_score','history_score','geography_score']].mean(axis=1)
    df['is_high_self_study_per_week'] = (df['weekly_self_study_hours'] > 10).astype(int)
    df['has_more_absences'] = (df['absence_days'] > 5).astype(int)
    df['high_absence_low_study'] = ((df['absence_days'] > 5) & (df['weekly_self_study_hours'] < 5)).astype(int)
    df['high_extracurricular_high_study'] = ((df['extracurricular_activities'] > 2) &
                                            (df['weekly_self_study_hours'] > 10)).astype(int)
    df['low_study_high_extracurricular'] = ((df['weekly_self_study_hours'] < 5) &
                                            (df['extracurricular_activities'] > 2)).astype(int)
    df['high_study_low_absence'] = ((df['weekly_self_study_hours'] > 15) &
                                    (df['absence_days'] < 3)).astype(int)
    df['science_ratio'] = df['science'] / df['total_Score'].replace(0, np.nan)
    df['humanities_ratio'] = df['humanities'] / df['total_Score'].replace(0, np.nan)
    df['math_ratio'] = df['math_score'] / df['science'].replace(0, np.nan)
    df['english_ratio'] = df['english_score'] / df['humanities'].replace(0, np.nan)
    df['physics_ratio'] = df['physics_score'] / df['science'].replace(0, np.nan)
    df['chemistry_ratio'] = df['chemistry_score'] / df['science'].replace(0, np.nan)
    df['biology_ratio'] = df['biology_score'] / df['science'].replace(0, np.nan)
    df['history_ratio'] = df['history_score'] / df['humanities'].replace(0, np.nan)
    df['geography_ratio'] = df['geography_score'] / df['humanities'].replace(0, np.nan)
    df.fillna(0, inplace=True)
    df['stem_humanities_diff'] = df['science'] - df['humanities']
    df['stem_humanities_ratio'] = df['science'] / (df['humanities'] + 1)
    df['logic_ability'] = df['math_score'] + df['physics_score']
    df['memory_ability'] = df['history_score'] + df['biology_score']

    for col in ['math_score','physics_score','chemistry_score','biology_score',
                'english_score','history_score','geography_score']:
        df[f'{col}_vs_avg'] = df[col] - df['avg_score']

    df['score_gap'] = df[['math_score','physics_score','chemistry_score','biology_score',
                        'english_score','history_score','geography_score']].max(axis=1) - \
                      df[['math_score','physics_score','chemistry_score','biology_score',
                        'english_score','history_score','geography_score']].min(axis=1)
    df['score_variance'] = df[['math_score','physics_score','chemistry_score','biology_score',
                            'english_score','history_score','geography_score']].var(axis=1)
    df['score_std'] = df[['math_score','physics_score','chemistry_score','biology_score',
                        'english_score','history_score','geography_score']].std(axis=1)
    df.fillna(0, inplace=True)
    df['dominant_area'] = df[['science','humanities']].idxmax(axis=1)
    df = pd.get_dummies(df, columns=['dominant_area'], drop_first=False)

    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0

    X_input = df[feature_columns]

    # Prediction
    pred_encoded = xgb_model.predict(X_input)[0]
    pred_label = label_encoder.inverse_transform([int(pred_encoded)])[0]
    proba = xgb_model.predict_proba(X_input)[0]
    top_n = max(1, min(top_n, len(proba)))
    top_idx = np.argsort(proba)[::-1][:top_n]
    top_labels = label_encoder.inverse_transform(top_idx)
    top_probs = proba[top_idx] * 100

    top_n_result = [
        {"faculty": str(label), "probability": round(float(prob), 2)}
        for label, prob in zip(top_labels, top_probs)
    ]
    study_guide = generate_learning_guide(pred_label)

    return {
        "predicted_faculty": pred_label,
        "top_3_predictions": top_n_result,
        "study_guide": study_guide,
    }




# from fastapi import FastAPI
# from pydantic import BaseModel
# import joblib
# import pandas as pd
# import numpy as np
# import os
# from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv

# load_dotenv()

# app = FastAPI()

# # to communicate with this backend API.
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Models & encoders
# rf_model = None
# xgb_model = None
# stack_model = None
# feature_columns = None
# label_encoder = None

# # Input JSON schema definition using Pydantic
# class StudentData(BaseModel):
#     part_time_job: int
#     absence_days: int
#     extracurricular_activities: int
#     weekly_self_study_hours: float
#     math_score: float
#     physics_score: float
#     chemistry_score: float
#     biology_score: float
#     english_score: float
#     history_score: float
#     geography_score: float

# @app.on_event("startup")
# def load_models():
#     """
#     Loads the necessary machine learning models and encoders 
#     when the FastAPI application starts up.
    
#     NOTE: This assumes the model files (xgboost_tuned.pkl, feature_columns.pkl, 
#     label_encoder.pkl) are located in a 'models' directory one level up from this file.
#     """
#     global rf_model, xgb_model, stack_model, feature_columns, label_encoder
#     BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#     MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

#     # Assuming only XGBoost model is being used based on the code provided
#     # rf_model = joblib.load(os.path.join(MODELS_DIR, "random_forest.pkl"))
#     try:
#         xgb_model = joblib.load(os.path.join(MODELS_DIR, "xgboost_tuned.pkl"))
#         feature_columns = joblib.load(os.path.join(MODELS_DIR, "feature_columns.pkl"))
#         label_encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))
#     except FileNotFoundError as e:
#         print(f"Error loading model files. Ensure they are in the correct path ('../models/'). Details: {e}")
#         # In a real application, you might raise an exception or set a flag to prevent serving requests
#     # stack_model = joblib.load(os.path.join(MODELS_DIR, "stacking_ensemble.pkl"))


# @app.get("/")
# def read_root():
#     """Simple health check endpoint."""
#     return {"message": "Hello Students! Major Recommendation API is running."}

# @app.post("/predict")
# def predict_major(student: StudentData, top_n: int = 3):
#     """
#     Receives student data, performs feature engineering, and predicts 
#     the top N most likely academic faculties.
#     """
    
#     if not xgb_model:
#         return {"error": "Prediction model not loaded. Check model file paths and startup logs."}, 500

#     # Convert Pydantic model to Pandas DataFrame for processing
#     df = pd.DataFrame([student.dict()])

#     # -------------------------------
#     # Feature Engineering (MUST MATCH TRAINING DATA)
#     # -------------------------------
#     # Basic aggregates
#     df['total_Score'] = df[['math_score','physics_score','chemistry_score','biology_score',
#                             'english_score','history_score','geography_score']].sum(axis=1)
#     df['avg_score'] = df['total_Score'] / 7
#     df['math_physics'] = df[['math_score','physics_score']].sum(axis=1)
#     df['biology_chemistry'] = df[['biology_score','chemistry_score']].sum(axis=1)
#     df['science'] = df[['math_score','physics_score','chemistry_score','biology_score']].sum(axis=1)
#     df['humanities'] = df[['english_score','history_score','geography_score']].sum(axis=1)

#     # Average scores
#     df['avg_science'] = df[['math_score','physics_score','chemistry_score','biology_score']].mean(axis=1)
#     df['avg_humanities'] = df[['english_score','history_score','geography_score']].mean(axis=1)
#     df['avg_math_physics'] = df[['math_score','physics_score']].mean(axis=1)
#     df['avg_bio_chem'] = df[['biology_score','chemistry_score']].mean(axis=1)
#     df['avg_english_history_geo'] = df[['english_score','history_score','geography_score']].mean(axis=1)

#     # Binary indicators
#     df['is_high_self_study_per_week'] = (df['weekly_self_study_hours'] > 10).astype(int)
#     df['has_more_absences'] = (df['absence_days'] > 5).astype(int)
#     df['high_absence_low_study'] = ((df['absence_days'] > 5) & (df['weekly_self_study_hours'] < 5)).astype(int)
#     df['high_extracurricular_high_study'] = ((df['extracurricular_activities'] > 2) &
#                                             (df['weekly_self_study_hours'] > 10)).astype(int)
#     df['low_study_high_extracurricular'] = ((df['weekly_self_study_hours'] < 5) &
#                                             (df['extracurricular_activities'] > 2)).astype(int)
#     df['high_study_low_absence'] = ((df['weekly_self_study_hours'] > 15) &
#                                     (df['absence_days'] < 3)).astype(int)

#     # Ratios
#     # Handle division by zero for total_Score if student has all 0 scores
#     df['science_ratio'] = df['science'] / df['total_Score'].replace(0, np.nan)
#     df['humanities_ratio'] = df['humanities'] / df['total_Score'].replace(0, np.nan)
#     df['math_ratio'] = df['math_score'] / df['science'].replace(0, np.nan)
#     df['english_ratio'] = df['english_score'] / df['humanities'].replace(0, np.nan)
#     df['physics_ratio'] = df['physics_score'] / df['science'].replace(0, np.nan)
#     df['chemistry_ratio'] = df['chemistry_score'] / df['science'].replace(0, np.nan)
#     df['biology_ratio'] = df['biology_score'] / df['science'].replace(0, np.nan)
#     df['history_ratio'] = df['history_score'] / df['humanities'].replace(0, np.nan)
#     df['geography_ratio'] = df['geography_score'] / df['humanities'].replace(0, np.nan)
#     df.fillna(0, inplace=True) # Fill NaN from division by zero with 0

#     # Differences & interactions
#     df['stem_humanities_diff'] = df['science'] - df['humanities']
#     # Add 1 to denominator to prevent division by zero for the ratio
#     df['stem_humanities_ratio'] = df['science'] / (df['humanities'] + 1) 
#     df['logic_ability'] = df['math_score'] + df['physics_score']
#     df['memory_ability'] = df['history_score'] + df['biology_score']

#     # Relative vs average
#     for col in ['math_score','physics_score','chemistry_score','biology_score',
#                 'english_score','history_score','geography_score']:
#         df[f'{col}_vs_avg'] = df[col] - df['avg_score']

#     # Score consistency
#     df['score_gap'] = df[['math_score','physics_score','chemistry_score','biology_score',
#                         'english_score','history_score','geography_score']].max(axis=1) - \
#                         df[['math_score','physics_score','chemistry_score','biology_score',
#                         'english_score','history_score','geography_score']].min(axis=1)
#     df['score_variance'] = df[['math_score','physics_score','chemistry_score','biology_score',
#                             'english_score','history_score','geography_score']].var(axis=1)
#     df['score_std'] = df[['math_score','physics_score','chemistry_score','biology_score',
#                         'english_score','history_score','geography_score']].std(axis=1)
#     df.fillna(0, inplace=True) # Fill NaN from variance/std if only one row

#     # Dominant area
#     df['dominant_area'] = df[['science','humanities']].idxmax(axis=1)
#     df = pd.get_dummies(df, columns=['dominant_area'], drop_first=False)
    
#     # -------------------------------
#     # Use only trained features
#     # -------------------------------
#     # Fill any missing dummy columns with 0 to ensure the input DataFrame 
#     # has the same structure as the training data's feature columns.
#     for col in feature_columns:
#         if col not in df.columns:
#             df[col] = 0
            
#     # Select and order columns according to the trained model's features
#     X_input = df[feature_columns]

#     # -------------------------------
#     # Make predictions
#     # -------------------------------
#     predictions = {}
    
#     # Iterate through models (only XGBoost is currently loaded)
#     for name, model in [
#         ("XGBoost", xgb_model),
#         # ("Random Forest", rf_model),
#         # ("Stacking Ensemble", stack_model),
#     ]:
#         # Get the predicted class index
#         pred_encoded = model.predict(X_input)[0]
#         # Decode the index back to the faculty name
#         pred_label = label_encoder.inverse_transform([int(pred_encoded)])[0]

#         # Get the probabilities for all classes
#         proba = model.predict_proba(X_input)[0]
#         # Get the indices of the top N probabilities
#         top_idx = np.argsort(proba)[::-1][:top_n]
#         # Decode the indices to faculty names
#         top_labels = label_encoder.inverse_transform(top_idx)
#         # Get the corresponding probabilities and convert to percentage
#         top_probs = proba[top_idx] * 100

#         # Structure the top N results
#         top_n_result = [
#             {"faculty": str(label), "probability": float(f"{prob:.2f}")} # Format probability to 2 decimal places
#             for label, prob in zip(top_labels, top_probs)
#         ]

#         predictions[name] = {
#             "predicted_faculty": str(pred_label),
#             "top_n": top_n_result,
#         }

#     return {"predictions": predictions}
