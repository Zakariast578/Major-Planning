import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier, StackingClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
from sklearn.metrics import accuracy_score, f1_score, recall_score, precision_score, confusion_matrix
import joblib

# ============================================================
# 1️⃣ Load Dataset
# ============================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PATH_DATA = os.path.join(BASE_DIR, '..', 'dataset', 'cleaned-student-scores.csv')

df = pd.read_csv(PATH_DATA)
RANDOM_STATE = 42

# ============================================================
# 2️⃣ Map Careers to Faculties
# ============================================================
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

# ============================================================
# 3️⃣ Features and Target Split
# ============================================================
X = df.drop(columns=['career_aspiration'])
y_raw = df['career_aspiration']

print("y_raw classes:", y_raw.unique())
FEATURE_COLUMNS = X.columns.tolist()
print("Feature columns:", FEATURE_COLUMNS)

# ============================================================
# 4️⃣ Encode Target
# ============================================================
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y_raw)

# ============================================================
# 5️⃣ Train-Test Split + SMOTE Oversampling
# ============================================================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)

smote = SMOTE(random_state=RANDOM_STATE)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# ============================================================
# 6️⃣ Define Models
# ============================================================
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
        n_estimators=300, learning_rate=0.05, max_depth=3, random_state=RANDOM_STATE
    ),
    cv=5,
    n_jobs=-1,
    passthrough=True
)

# ============================================================
# 7️⃣ Fit Ensemble Model
# ============================================================
print("\nTraining stacking ensemble model...")
stacking_model.fit(X_train_resampled, y_train_resampled)


# -------------------------------
# 6️⃣ Evaluation function
# -------------------------------
def evaluate_model(model, X_test, y_test, label_encoder, model_name="Model"):
    y_pred = model.predict(X_test)
    target_names = label_encoder.classes_
    
    print(f"\n--- {model_name} Evaluation ---")    
    acc = accuracy_score(y_test, y_pred)
    macro_recall = recall_score(y_test, y_pred, average="macro", zero_division=0)
    macro_precision = precision_score(y_test, y_pred, average="macro", zero_division=0)
    macro_f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)
    
    print(f"Accuracy: {acc:.2f}")
    print(f"Macro Recall: {macro_recall:.2f}")
    print(f"Macro Precision: {macro_precision:.2f}")
    print(f"Macro F1-score: {macro_f1:.2f}")

    cm = confusion_matrix(y_test, y_pred)
    print("Confusion Matrix:")
    print(cm)
    
    return {
        "model": model_name,
        "accuracy": acc,
        "macro_recall": macro_recall,
        "macro_precision": macro_precision,
        "macro_f1": macro_f1
    }


# -------------------------------
# 7️⃣ Train & Evaluate all models
# -------------------------------
results = []
for clf, name in [
    (rf, "Random Forest"),
    (xgb, "XGBoost"),
    (stacking_model, "Stacking Ensemble"),
]:
    # Fit on resampled training data (if using SMOTE)
    clf.fit(X_train_resampled, y_train_resampled)
    
    res = evaluate_model(clf, X_test, y_test, label_encoder, model_name=name)
    results.append(res)

# -------------------------------
# 8️⃣ Summary Table
# -------------------------------
results_df = pd.DataFrame(results)
print("\n=== Summary Comparison Table ===")
print(results_df.round(2))

# -------------------------------
# 🔹 Sanity Check 1: First 6 Test Samples
# -------------------------------
print("\n==============================")
print("🔍 SANITY CHECK: First 6 Test Samples")
print("==============================")

# Safely slice a few samples (3 to 6 here)
X_sample = X_test.iloc[3:6]
y_true_sample = y_test[3:6]

# Convert true labels to original faculty names
y_true_labels = label_encoder.inverse_transform(y_true_sample)

# List of models to check
models = [
    (rf, "Random Forest"),
    (xgb, "XGBoost"),
    (stacking_model, "Stacking Ensemble"),
]

# Iterate and print predictions for each model
for model, name in models:
    y_pred_sample = model.predict(X_sample)
    y_pred_labels = label_encoder.inverse_transform(y_pred_sample)

    print(f"\n🧠 {name} Predictions:")
    print("-" * 40)
    for i, (true, pred) in enumerate(zip(y_true_labels, y_pred_labels), start=1):
        match = "✅" if true == pred else "❌"
        print(f"Sample {i}: True = {true:30s} | Predicted = {pred:30s} {match}")

print("\n--- End of Sanity Check ---\n")


# ============================================================
# 9️⃣ Save Models and Metadata
# ============================================================
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

joblib.dump(rf, os.path.join(MODELS_DIR, "random_forest.pkl"))
joblib.dump(xgb, os.path.join(MODELS_DIR, "xgboost.pkl"))
joblib.dump(stacking_model, os.path.join(MODELS_DIR, "stacking_ensemble.pkl"))
joblib.dump(FEATURE_COLUMNS, os.path.join(MODELS_DIR, "feature_columns.pkl"))
joblib.dump(label_encoder, os.path.join(MODELS_DIR, "label_encoder.pkl"))

print("✅ All models and encoder saved successfully!")
