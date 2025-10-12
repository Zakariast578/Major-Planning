# Backend

FastAPI service and training pipeline that power the Planning Student Major recommendation product. This backend ingests the Kaggle-based student score dataset, engineers features, trains ensemble models, and serves faculty predictions to the React frontend.

## Directory Layout

- `dataset/` – raw (`student-scores.csv`) and processed (`cleaned-student-scores.csv`) data.
- `src/processing.py` – feature engineering + scaling script that refreshes the cleaned dataset.
- `src/train.py` – trains Random Forest, tuned XGBoost, and a stacking ensemble; saves artifacts under `models/`.
- `models/` – serialized pipelines (`*.pkl`) consumed at runtime.
- `api/app.py` – FastAPI app that exposes `GET /` and `POST /predict` endpoints.
- `requirements.txt` – pinned dependencies used for both training and serving.

## Environment Setup

1. Create or activate a Python 3.10+ virtual environment.
2. Install dependencies:

   ```bash
   pip install -r Backend/requirements.txt
   ```

3. Copy `.env.example` if provided (or create `.env`) and set `FRONTEND_URL` to the deployed or local UI origin. Example:

   ```env
   FRONTEND_URL=http://localhost:5173
   ```

## Data Processing

Run the preprocessing script when you update the raw dataset or tweak feature engineering:

```bash
python Backend/src/processing.py
```

This script:

- Filters unknown aspirations and drops PII columns.
- Builds aggregate scores, ratios, and binary indicators that highlight study habits.
- Standardizes numerical features while preserving binary indicators.
- Writes `dataset/cleaned-student-scores.csv`, which downstream scripts reuse.

## Model Training

Train or retrain the ensemble suite with:

```bash
python Backend/src/train.py
```

Key steps inside the script:

- Maps detailed aspirations to overarching faculties (e.g., Lawyer → Law & Social Sciences).
- Splits data with stratification and balances minority faculties via SMOTE.
- Tunes an XGBoost classifier (grid search on depth, learning rate, subsampling).
- Fits Random Forest, tuned XGBoost, and a stacking ensemble with Gradient Boosting head.
- Evaluates each model on a held-out test split (macro F1, recall, precision, accuracy).
- Persists trained models, feature column ordering, and the label encoder into `Backend/models/`.

## API Service

The FastAPI app loads the serialized artifacts at startup and mirrors the feature engineering used in training. To run locally:

```bash
uvicorn Backend.api.app:app --reload --port 8000
```

### Endpoints

- `GET /` – health probe returning a simple JSON message.
- `POST /predict?top_n=3` – accepts the student profile payload, re-computes engineered features, aligns with saved feature columns, and returns predictions from each model.

### Request Schema

```json
{
  "part_time_job": 0,
  "absence_days": 4,
  "extracurricular_activities": 2,
  "weekly_self_study_hours": 8,
  "math_score": 82,
  "physics_score": 78,
  "chemistry_score": 80,
  "biology_score": 74,
  "english_score": 85,
  "history_score": 76,
  "geography_score": 79
}
```

### Response Shape

```json
{
  "predictions": {
    "XGBoost": {
      "predicted_faculty": "Business & Economics",
      "top_n": [
        { "faculty": "Business & Economics", "probability": 42.6 },
        { "faculty": "STEM", "probability": 31.4 },
        { "faculty": "Law & Social Sciences", "probability": 11.2 }
      ]
    },
    "Random Forest": { ... },
    "Stacking Ensemble": { ... }
  }
}
```

## Frontend Integration

- The React/Vite frontend posts the prediction form payload to `POST /predict` (hosted on Vercel or locally at `http://localhost:8000`).
- CORS is restricted to the origin specified via `FRONTEND_URL`, ensuring browser requests succeed.
- The API returns ranked faculties per model; the UI displays each model’s top-three recommendations with confidence percentages and highlights the leading faculty.
- Because the backend regenerates engineered features on-the-fly using the persisted `feature_columns.pkl`, frontend values remain aligned with the training pipeline even if the feature set evolves.

## Typical Workflow

1. Update raw data → run `processing.py`.
2. Retrain models → run `train.py` to refresh artifacts.
3. Restart the FastAPI service so it reloads the new models.
4. Frontend consumes the `/predict` endpoint without further changes, reflecting the latest model logic in real time.
