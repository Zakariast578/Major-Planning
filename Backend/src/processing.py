import os
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, recall_score, precision_score, f1_score, confusion_matrix

from sklearn.ensemble import RandomForestClassifier, StackingClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE

# -------------------------------
# 1️⃣ Load dataset
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'cleaned-student-scores.csv')

RANDOM_STATE = 42
df = pd.read_csv(DATA_PATH)

# -------------------------------
# 2️⃣ Prepare features & target
# -------------------------------
X = df.drop(columns=['recommended_faculty', 'Faculty'])
y = df['recommended_faculty']

# Encode target labels to numeric
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

print("Features Columns:", X.columns.tolist())
print("Target Classes:", label_encoder.classes_)

# -------------------------------
# 3️⃣ Train-test split
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)

# -------------------------------
# 4️⃣ Feature scaling
# -------------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# -------------------------------
# 5️⃣ Handle class imbalance using SMOTE
# -------------------------------
smote = SMOTE(random_state=RANDOM_STATE)
X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)

print("Before SMOTE:", np.bincount(y_train))
print("After SMOTE:", np.bincount(y_train_res))

# -------------------------------
# 6️⃣ Compute class weights for XGBoost
# -------------------------------
# 🛑 REMOVED: Since SMOTE balances the data, class weights are redundant.
# The original code for this step has been commented out/removed for clean-up.

# -------------------------------
# 7️⃣ Define models
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

# Stacking Ensemble
estimators = [("rf", rf), ("xgb", xgb)]
stacking_model = StackingClassifier(
    estimators=estimators,
    final_estimator=RandomForestClassifier(
        n_estimators=300,
        class_weight="balanced",
        random_state=RANDOM_STATE
    ),
    cv=5,
    n_jobs=-1,
    passthrough=True
)

# -------------------------------
# 8️⃣ Evaluation function
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
# 9️⃣ Train & Evaluate all models
# -------------------------------
results = []

for clf, name in [(rf, "Random Forest"), (xgb, "XGBoost"), (stacking_model, "Stacking Ensemble")]:
    # ✅ SIMPLIFIED: All models are fit on the SMOTE-resampled, scaled data (X_train_res, y_train_res)
    # The redundant 'if name == "XGBoost":' logic has been removed.
    clf.fit(X_train_res, y_train_res)
    
    res = evaluate_model(clf, X_test_scaled, y_test, label_encoder, model_name=name)
    results.append(res)

# -------------------------------
# 10️⃣ Summary Table & Sanity Check
# -------------------------------
results_df = pd.DataFrame(results)
print("\n=== Summary Comparison Table ===")
print(results_df.round(2))

print("\n--- Sanity Check: Random 6 Test Samples ---")

# Get 6 random positional indices from the test set
random_pos = np.random.RandomState(RANDOM_STATE).choice(len(X_test), size=5, replace=False)

# Select samples using .iloc for X and NumPy indexing for y
X_sample = X_test.iloc[random_pos]
y_true_sample = y_test[random_pos]

# Iterate through your trained models
for clf, name in [
    (rf, "Random Forest"),
    (xgb, "XGBoost"),
    (stacking_model, "Stacking Ensemble"),
]:
    # ✅ CORRECTED: Scaling X_sample BEFORE passing it to the model's predict method
    X_sample_scaled = scaler.transform(X_sample)
    y_pred_sample = clf.predict(X_sample_scaled)
    
    # Convert numeric labels back to original major names
    y_pred_labels = label_encoder.inverse_transform(y_pred_sample)
    y_true_labels = label_encoder.inverse_transform(y_true_sample)
    
    print(f"\n{name} Predictions:")
    for i, (true, pred) in enumerate(zip(y_true_labels, y_pred_labels)):
        print(f"Sample {i+1}: True = {true}, Predicted = {pred}")

print("\n--- End of Sanity Check ---")


# -------------------------------
# 11️⃣ Save models and artifacts
# -------------------------------
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

joblib.dump(rf, os.path.join(MODELS_DIR, "random_forest.pkl"))
joblib.dump(xgb, os.path.join(MODELS_DIR, "xgboost.pkl"))
joblib.dump(stacking_model, os.path.join(MODELS_DIR, "stacking_ensemble.pkl"))
joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))
joblib.dump(X.columns.tolist(), os.path.join(MODELS_DIR, "feature_columns.pkl"))
joblib.dump(label_encoder, os.path.join(MODELS_DIR, "label_encoder.pkl"))