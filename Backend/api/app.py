# Backend/api/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import joblib
import pandas as pd
import numpy as np
import os
import sys

# ---------------------------
# Load .env from same folder as this file
# ---------------------------
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, ".env")
load_dotenv(env_path)

# ---------------------------
# Get Gemini API key and initialize client (explicit)
# ---------------------------
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Fail fast with clear message so you can fix .env path or name
    raise ValueError(f"❌ GEMINI_API_KEY not found in environment file at: {env_path}")

try:
    client = genai.Client(api_key=api_key)
    print("✅ Gemini client initialized successfully.")
except Exception as e:
    # Keep running but fallback if Gemini doesn't initialize
    print(f"⚠️ Gemini client initialization failed: {e}", file=sys.stderr)
    client = None

# ---------------------------
# Create FastAPI app + CORS
# ---------------------------
app = FastAPI(title="🎓 Student Major Recommendation API")

# Create robust origins list:
# - If FRONTEND_URL env exists and is comma separated, support multiple origins.
# - Always include common localhost variants used by dev servers.
frontend_env = os.getenv("FRONTEND_URL", "")
# Accept comma-separated list in FRONTEND_URL for flexibility
env_origins = [u.strip() for u in frontend_env.split(",") if u.strip()]
default_origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
allow_origins = list(dict.fromkeys(env_origins + default_origins))  # preserve order, dedupe

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("✅ CORS configured. Allowed origins:", allow_origins)

# ---------------------------
# Global ML model variables
# ---------------------------
xgb_model = None
feature_columns = None
label_encoder = None


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


# ---------------------------
# Load ML models on startup
# ---------------------------
@app.on_event("startup")
def load_models():
    global xgb_model, feature_columns, label_encoder

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

    try:
        xgb_model = joblib.load(os.path.join(MODELS_DIR, "xgboost_tuned.pkl"))
        feature_columns = joblib.load(os.path.join(MODELS_DIR, "feature_columns.pkl"))
        label_encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))
        print("✅ ML models loaded successfully.")
    except FileNotFoundError as e:
        print(f"⚠️ Model loading error: {e}", file=sys.stderr)
        # Raise so server startup fails and you can place models correctly
        raise RuntimeError("Model files missing or incorrectly placed in '../models/'") from e
    except Exception as e:
        print(f"⚠️ Unexpected error loading models: {e}", file=sys.stderr)
        raise


# ---------------------------
# Gemini explanation helper
# ---------------------------
def explain_with_gemini(faculty: str, student_data: dict) -> str:
    """
    Generate a supportive, structured explanation in Somali using Gemini.
    If Gemini is unavailable, return a friendly fallback message.
    """
    if client is None:
        return "⚠️ AI explanation unavailable (Gemini client not initialized). Prediction is provided without AI guidance."

    # Prompt in Somali, structured to produce a helpful response
    prompt = f"""
    Waxaad tahay lataliye tacliimeed oo AI ah.
    Ardaygan waxaa loo soo jeediyey Fakultiyadda **{faculty}**.
    Xogta ardayga: {student_data}

    Soo saar:
    - Sharaxaad kooban oo ku saabsan fakultiyaddan iyo fursadaha ay bixiso.
    - Qoraal dhiirrigelin leh oo gaaban.

    Qor si diirran, cad, oo dhiirrigelin leh.
    """

    try:
        resp = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        # The response object should have `.text`
        text = getattr(resp, "text", None)
        if not text:
            return "⚠️ Gemini returned an empty explanation."
        return text.strip()
    except Exception as e:
        # Handle API failures gracefully
        print(f"⚠️ Gemini API error: {e}", file=sys.stderr)
        return "⚠️ AI explanation temporarily unavailable due to an API error. Prediction is returned without AI guidance."


# ---------------------------
# Root / health & HTML page
# ---------------------------
@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <html>
      <head><title>Student Major API</title></head>
      <body style="font-family: Inter, system-ui, sans-serif; background: #0f172a; color: white; text-align: center; margin-top: 80px;">
        <h1>🎓 Student Major Recommendation API</h1>
        <p>✅ Backend is running.</p>
        <p>Try the <a href="/docs" style="color: #06b6d4;">interactive API docs</a>.</p>
      </body>
    </html>
    """


# ---------------------------
# Prediction endpoint
# ---------------------------
@app.post("/predict")
def predict_major(student: StudentData, top_n: int = 3):
    # Ensure models loaded
    if not all([xgb_model, feature_columns, label_encoder]):
        raise HTTPException(status_code=500, detail="Model files not loaded. Check server logs.")

    # Create DataFrame and compute features (same as earlier)
    df = pd.DataFrame([student.dict()])

    try:
        df["total_Score"] = df[
            [
                "math_score",
                "physics_score",
                "chemistry_score",
                "biology_score",
                "english_score",
                "history_score",
                "geography_score",
            ]
        ].sum(axis=1)
        df["avg_score"] = df["total_Score"] / 7
        df["science"] = df[
            ["math_score", "physics_score", "chemistry_score", "biology_score"]
        ].sum(axis=1)
        df["humanities"] = df[
            ["english_score", "history_score", "geography_score"]
        ].sum(axis=1)
        df["dominant_area"] = df[["science", "humanities"]].idxmax(axis=1)
        df = pd.get_dummies(df, columns=["dominant_area"], drop_first=False)

        # Ensure columns match training features
        for col in feature_columns:
            if col not in df.columns:
                df[col] = 0

        X_input = df[feature_columns]

        # Make prediction
        pred_encoded = xgb_model.predict(X_input)[0]
        pred_label = label_encoder.inverse_transform([int(pred_encoded)])[0]

        # Top-n probabilities
        proba = xgb_model.predict_proba(X_input)[0]
        top_idx = np.argsort(proba)[::-1][:top_n]
        top_labels = label_encoder.inverse_transform(top_idx)
        top_probs = proba[top_idx] * 100

        top_n_result = [
            {"faculty": str(label), "probability": round(float(prob), 2)}
            for label, prob in zip(top_labels, top_probs)
        ]

        # Obtain AI explanation (Gemini) with graceful fallback
        ai_explanation = explain_with_gemini(pred_label, student.dict())

        return {"predicted_faculty": pred_label, "top_n": top_n_result, "ai_explanation": ai_explanation}

    except Exception as e:
        # Bubble up a nice error to the client
        print(f"⚠️ Prediction error: {e}", file=sys.stderr)
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
