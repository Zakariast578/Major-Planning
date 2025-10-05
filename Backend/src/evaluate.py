import os
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
     accuracy_score, recall_score,
    precision_score, f1_score, confusion_matrix
)

from sklearn.ensemble import RandomForestClassifier, StackingClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier


# -------------------------------
# 1️⃣ Load dataset
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'cleaned-student-scores.csv')

RANDOM_STATE = 42

df = pd.read_csv(DATA_PATH)
# -------------------------------
# 3️⃣ Prepare features & target
# -------------------------------
X = df.drop(columns=['recommended_faculty', 'Faculty'])
print("Features Columns:", X.columns.tolist())
y = df['recommended_faculty']

# Encode target labels to numeric
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

# -------------------------------
# 4️⃣ Train-test split
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE
)

# -------------------------------
# 5️⃣ Define models
# -------------------------------

# Random Forest
rf = RandomForestClassifier(
    n_estimators=1000,
    max_features="sqrt",
    class_weight="balanced",
    random_state=RANDOM_STATE,
    n_jobs=-1
)

# XGBoost
xgb = XGBClassifier(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_lambda=1,
    random_state=RANDOM_STATE,
    eval_metric="mlogloss"
)

# Stacking Ensemble (tree-based meta-learner)
estimators = [
    ("rf", rf),
    ("xgb", xgb)
]

stacking_model = StackingClassifier(
    estimators=estimators,
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
    clf.fit(X_train, y_train)
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
print("\n--- Sanity Check: First 6 Test Samples ---")

# Take first 6 samples from the test set
X_sample = X_test.iloc[3:6]
y_true_sample = y_test[3:6]

# Iterate through your trained models
for clf, name in [
    (rf, "Random Forest"),
    (xgb, "XGBoost"),
    (stacking_model, "Stacking Ensemble"),
]:
    y_pred_sample = clf.predict(X_sample)
    
    # Convert numeric labels back to original major names
    y_pred_labels = label_encoder.inverse_transform(y_pred_sample)
    y_true_labels = label_encoder.inverse_transform(y_true_sample)
    
    print(f"\n{name} Predictions:")
    for i, (true, pred) in enumerate(zip(y_true_labels, y_pred_labels)):
        print(f"Sample {i+1}: True = {true}, Predicted = {pred}")

print("\n--- End of Sanity Check ---")

print(df['recommended_faculty'].value_counts())
# -------------------------------
# Save the models RF, XGB and (Stacking Ensemble)
# -------------------------------
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)
# Save Random Forest
joblib.dump(rf, os.path.join(MODELS_DIR, "random_forest.pkl"))

# Save XGBoost
joblib.dump(xgb, os.path.join(MODELS_DIR, "xgboost.pkl"))

# Save Stacking Ensemble
joblib.dump(stacking_model, os.path.join(MODELS_DIR, "stacking_ensemble.pkl"))

# Save X feature columns for later use
joblib.dump(X.columns.tolist(), os.path.join(MODELS_DIR, "feature_columns.pkl"))
# Save Label Encoder
joblib.dump(label_encoder, os.path.join(MODELS_DIR, "label_encoder.pkl"))

