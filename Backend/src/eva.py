import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestClassifier, StackingClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
import joblib

# ----------------------------
# 1️⃣ Load Dataset
# ----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PATH_DATA = os.path.join(BASE_DIR, '..', 'dataset', 'cleaned-student-scores.csv')

df = pd.read_csv(PATH_DATA)
RANDOM_STATE = 42


career_to_faculty = {
    "Software Engineer": "Engineering & Technology",
    "Business Owner": "Business & Economics",
    "Banker": "Business & Economics",
    "Lawyer": "Law",
    "Accountant": "Business & Economics",
    "Doctor": "Medicine & Health Sciences",
    "Real Estate Developer": "Engineering & Technology",
    "Stock Investor": "Business & Economics",
    "Construction Engineer": "Engineering & Technology",
    "Artist": "Design & Creative Arts",
    "Game Developer": "Engineering & Technology",
    "Government Officer": "Social Sciences",
    "Teacher": "Education",
    "Designer": "Design & Creative Arts",
    "Scientist": "Science & Mathematics",
    "Writer": "Arts & Humanities"
}
df['career_aspiration'] = df['career_aspiration'].map(career_to_faculty).fillna(df['career_aspiration'])

# ----------------------------
# 2️⃣ Split Features and Target
# ----------------------------
X = df.drop(columns=['career_aspiration'])
y_raw = df['career_aspiration']  # use actual labels for LabelEncoder
print("y_raw classes:", y_raw.unique())

FEATURE_COLUMNS = X.columns.tolist()
print("Feature columns:", FEATURE_COLUMNS)

# ----------------------------
# 3️⃣ Encode Target
# ----------------------------
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y_raw)

# ----------------------------
# 4️⃣ Train-Test Split & SMOTE
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)

smote = SMOTE(random_state=RANDOM_STATE)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# ----------------------------
# 5️⃣ Define Models
# ----------------------------
rf = RandomForestClassifier(
    n_estimators=1000, max_features="sqrt", class_weight="balanced",
    random_state=RANDOM_STATE, n_jobs=-1
)

xgb = XGBClassifier(
    n_estimators=500, learning_rate=0.05, max_depth=6, subsample=0.8,
    colsample_bytree=0.8, reg_lambda=1, random_state=RANDOM_STATE, eval_metric="mlogloss"
)

stacking_model = StackingClassifier(
    estimators=[("Random Forest", rf), ("XGBoost", xgb)],
    final_estimator=GradientBoostingClassifier(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=3,
        random_state=RANDOM_STATE
    ),
    cv=5,
    n_jobs=-1,
    passthrough=True
)

# ----------------------------
# 6️⃣ Fit Models
# ----------------------------
rf.fit(X_train_resampled, y_train_resampled)
xgb.fit(X_train_resampled, y_train_resampled)
stacking_model.fit(X_train_resampled, y_train_resampled)

# ----------------------------
# 7️⃣ Save Models, Features, Encoder
# ----------------------------
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

joblib.dump(rf, os.path.join(MODELS_DIR, "random_forest.pkl"))
joblib.dump(xgb, os.path.join(MODELS_DIR, "xgboost.pkl"))
joblib.dump(stacking_model, os.path.join(MODELS_DIR, "stacking_ensemble.pkl"))
joblib.dump(FEATURE_COLUMNS, os.path.join(MODELS_DIR, "feature_columns.pkl"))
joblib.dump(label_encoder, os.path.join(MODELS_DIR, "label_encoder.pkl"))

print("All models and encoder saved successfully!")
