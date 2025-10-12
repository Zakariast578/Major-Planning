import os
import joblib
import pandas as pd
from collections import Counter

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, f1_score, recall_score, precision_score, confusion_matrix, classification_report
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, StackingClassifier
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE

# ============================================================
# 1️⃣ Config Paths & Random State
# ============================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'cleaned-student-scores.csv')
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)
RANDOM_STATE = 42

# ============================================================
# 2️⃣ Load Dataset & Map Faculties
# ============================================================
df = pd.read_csv(DATA_PATH)

career_to_faculty_short = {
    "Software Engineer": "STEM",
    "Game Developer": "STEM",
    "Construction Engineer": "STEM",
    "Real Estate Developer": "STEM",
    "Business Owner": "Business & Economics",
    "Banker": "Business & Economics",
    "Accountant": "Business & Economics",
    "Stock Investor": "Business & Economics",
    "Lawyer": "Law & Social Sciences",
    "Doctor": "Medical & Health Sciences",
    "Teacher": "Education & Humanities",
    "Government Officer": "Law & Social Sciences",
    "Artist": "Arts & Humanities",
    "Designer": "Arts & Humanities",
    "Scientist": "STEM",
    "Writer": "Arts & Humanities"
}

df['faculty'] = df['career_aspiration'].map(career_to_faculty_short)
df = df.drop(columns=['career_aspiration'])

# ============================================================
# 3️⃣ Features & Target
# ============================================================
X = df.drop(columns=['faculty'])
y_raw = df['faculty']

# Encode target
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y_raw)

print("Feature Columns:", X.columns.tolist())
print("Classes:", label_encoder.classes_)

# ============================================================
# 4️⃣ Train-Test Split
# ============================================================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)

# ============================================================
# 5️⃣ Handle Class Imbalance with SMOTE
# ============================================================
train_counts = Counter(y_train)
min_count = min(train_counts.values())
k_neighbors = max(1, min(5, min_count - 1))

smote = SMOTE(random_state=RANDOM_STATE, k_neighbors=k_neighbors)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

print("Class distribution after SMOTE:", Counter(y_train_res))

# ============================================================
# 6️⃣ Define Models
# ============================================================
rf = RandomForestClassifier(
    n_estimators=1000,
    max_features="sqrt",
    class_weight="balanced",
    random_state=RANDOM_STATE,
    n_jobs=-1
)

xgb_base = XGBClassifier(
    random_state=RANDOM_STATE,
    eval_metric="mlogloss",
    use_label_encoder=False
)

param_grid = {
    "n_estimators": [300, 500],
    "max_depth": [4, 6],
    "learning_rate": [0.05, 0.1],
    "subsample": [0.8, 1.0],
    "colsample_bytree": [0.8, 1.0]
}

grid_search = GridSearchCV(
    estimator=xgb_base,
    param_grid=param_grid,
    scoring="f1_macro",
    cv=3,
    n_jobs=-1,
    verbose=1
)

print("🔍 Tuning XGBoost hyperparameters...")
grid_search.fit(X_train_res, y_train_res)
xgb_best = grid_search.best_estimator_
print("✅ Best XGBoost Params:", grid_search.best_params_)

stacking_model = StackingClassifier(
    estimators=[("Random Forest", rf), ("XGBoost", xgb_best)],
    final_estimator=GradientBoostingClassifier(
        n_estimators=300, learning_rate=0.05, max_depth=3, random_state=RANDOM_STATE
    ),
    cv=5,
    n_jobs=-1,
    passthrough=True
)

# ============================================================
# 7️⃣ Evaluation Function
# ============================================================
def evaluate_model(model, X_test, y_test, name):
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred, average="macro", zero_division=0)
    precision = precision_score(y_test, y_pred, average="macro", zero_division=0)
    f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)

    print(f"\n{name} Results → Accuracy: {acc:.2f}, F1: {f1:.2f}")
    print("Classification Report:\n", classification_report(y_test, y_pred, target_names=label_encoder.classes_))
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
    return {"Model": name, "Accuracy": acc, "Recall": recall, "Precision": precision, "F1": f1}

# ============================================================
# 8️⃣ Train & Evaluate
# ============================================================
models = [
    (rf, "Random Forest"),
    (xgb_best, "XGBoost (Tuned)"),
    (stacking_model, "Stacking Ensemble")
]

results = []
for model, name in models:
    print(f"\n🚀 Training {name} ...")
    model.fit(X_train_res, y_train_res)
    results.append(evaluate_model(model, X_test, y_test, name))

results_df = pd.DataFrame(results).round(2)
print("\n📊 Model Comparison Summary:")
print(results_df)

# ============================================================
# 9️⃣ Save Models & Encoder
# ============================================================
joblib.dump(rf, os.path.join(MODELS_DIR, "random_forest.pkl"))
joblib.dump(xgb_best, os.path.join(MODELS_DIR, "xgboost_tuned.pkl"))
joblib.dump(stacking_model, os.path.join(MODELS_DIR, "stacking_ensemble.pkl"))
joblib.dump(X.columns.tolist(), os.path.join(MODELS_DIR, "feature_columns.pkl"))
joblib.dump(label_encoder, os.path.join(MODELS_DIR, "label_encoder.pkl"))

print("✅ All models and encoders saved successfully!")
