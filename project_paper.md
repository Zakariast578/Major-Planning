# Reflection: An ML‑Powered Faculty Recommendation System

Zakaria Said  
October 9, 2025

## Introduction

Choosing a major is a high‑stakes decision that shapes a student’s academic path and early career. Many students struggle to connect their strengths and interests to suitable faculties, leading to uncertainty and misalignment. The “Planning Student Major” project addresses this with a machine learning–powered recommender that aligns student profiles to university faculties, returning a top prediction and ranked alternatives with confidence scores. The goal is to reduce ambiguity, provide actionable guidance, and support more confident decisions.

## Dataset

https://www.kaggle.com/datasets/mexwell/student-scores/data

### Source and size
- Synthetic “Student Scores” dataset with 2,000 senior students from a large fictional school.
- After cleaning, 1,777 records remained, spanning academics, behavior, and background.

### Features
- Academic performance: math_score, history_score, physics_score, chemistry_score, biology_score, english_score, geography_score
- Behavioral traits: absence_days, weekly_self_study_hours
- Background: part_time_job, extracurricular_activities
- Target: career_aspiration, later mapped to broader faculties

### Preprocessing and feature engineering
- Cleaning: Dropped rows with missing or “Unknown” aspirations and removed duplicates, leaving 1,777 usable rows.
- Feature engineering: Added Total_Score and domain aggregates (e.g., science and arts averages) to capture relative strengths.
- Target mapping: Collapsed granular aspirations into nine faculty groups (e.g., Engineering & Technology, Business & Economics, Medicine & Health Sciences).
- Encoding and scaling: Encoded categorical fields; standardized numeric features for stable training.
- Class imbalance: Applied SMOTE to upsample minority faculty classes.
- Artifact: cleaned-student-scores.csv served as the final training table.

## Modeling Approach

This is a multi‑class classification task: predict the most suitable faculty for each student. Two core algorithms were used:

### 1) Random Forest
- What it is: An ensemble of decision trees trained on bootstrapped samples; predictions are combined via majority vote.
- Why it helps: Reduces variance and overfitting compared to a single tree; handles heterogeneous features well.
- Key settings: 1,000 trees; class_weight="balanced" to counter residual imbalance; default impurity‑based splits with tuned depth constraints.

### 2) XGBoost
- What it is: Gradient‑boosted decision trees trained sequentially, each learner correcting residual errors of prior ones.
- Why it helps: Strong performance on structured data; built‑in regularization; efficient handling of complex feature interactions.
- Key settings: ~500 estimators with tuned learning_rate, max_depth, subsample, and column sampling for regularization and speed.

### Ensemble note
- A simple stacking ensemble combined Random Forest and XGBoost with a Gradient Boosting meta‑learner to probe complementarity. It prioritized accuracy but traded off recall on minority classes.

## Results and Evaluation

### Metrics
- Evaluated on a held‑out test set using accuracy and macro‑averaged precision, recall, and F1 to reflect class imbalance.

### Scores
- Random Forest — Accuracy 0.55, Macro Recall 0.46, Macro Precision 0.39, Macro F1 0.42
- XGBoost — Accuracy 0.56, Macro Recall 0.45, Macro Precision 0.41, Macro F1 0.43
- Stacking — Accuracy 0.59, Macro Recall 0.34, Macro Precision 0.50, Macro F1 0.36

### Interpretation
- XGBoost delivered the strongest macro F1, indicating the best balance between precision and recall across classes.
- The stacking ensemble achieved the highest accuracy but at the cost of macro recall, signaling weaker performance on minority faculties.
- Random Forest was a solid baseline, slightly trailing XGBoost on balanced metrics.

### Sanity checks
- Spot checks showed predictions aligned with intuitive patterns. Business & Economics aspirants were often correctly identified across models.
- Underrepresented faculties (e.g., Law) remained challenging despite SMOTE, highlighting the need for further imbalance mitigation and better minority signal capture.

## Deployment

A FastAPI service exposes a /predict endpoint that accepts JSON and returns a predicted faculty with top‑3 probabilities for transparency.

Example request:
```json
{
    "part_time_job": 0,
    "absence_days": 3,
    "extracurricular_activities": 1,
    "weekly_self_study_hours": 15,
    "math_score": 85,
    "history_score": 78,
    "physics_score": 90,
    "chemistry_score": 88,
    "biology_score": 82,
    "english_score": 80,
    "geography_score": 75,
    "Total_Score": 578
}
```

Example response:
```json
{
    "predicted_faculty": "Engineering & Technology",
    "top_3_faculties": [
        { "faculty": "Engineering & Technology", "probability": 70.1 },
        { "faculty": "Science & Mathematics", "probability": 12.5 },
        { "faculty": "Business & Economics", "probability": 7.3 }
    ]
}
```

The API design keeps integration straightforward for web apps or advising tools and allows UI components to display alternative options with confidence.

## Lessons Learned

- Data quality and imbalance matter: SMOTE helped, but minority errors persisted; additional strategies (cost‑sensitive learning, focal loss, or stratified data collection) are warranted.
- Feature engineering pays off: Aggregate and domain‑specific features (totals, averages) improved separability and overall performance.
- Evaluate beyond accuracy: Stacking’s higher accuracy but lower recall reinforced the importance of macro metrics for imbalanced tasks.
- Iteration drives gains: Refining mappings, features, and hyperparameters produced steady improvements with diminishing returns near the current ceiling.

## Future Improvements

- Add interaction features (e.g., science–math synergies, humanities blends) and nonlinearity‑friendly transforms.
- Use advanced hyperparameter search (Bayesian optimization, early‑stopped CV) to balance performance and training cost.
- Integrate explainability (e.g., SHAP) so students and advisors can understand the drivers behind recommendations.
- Explore calibrated probabilities and thresholding to better manage precision–recall trade‑offs by faculty.
- Investigate hierarchical classification (broad faculty → specialization) to reflect real academic pathways.

## Conclusion

“Planning Student Major” demonstrates how ML can provide evidence‑based, confidence‑boosting recommendations for choosing a faculty. While class imbalance and minority coverage remain open challenges, the system already delivers practical guidance, with clear next steps to improve fairness, transparency, and overall reliability.
