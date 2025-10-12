import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import StandardScaler

# -------------------------------
# 1️⃣ Load dataset
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
DATA_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'student-scores.csv')

df = pd.read_csv(DATA_PATH)
print("Dataset loaded. Shape:", df.shape)

# Filter out unknown career aspirations
df = df[df["career_aspiration"].str.strip().str.lower() != "unknown"]

# Drop unnecessary columns and duplicates
df = df.drop(columns=['id', 'first_name', 'last_name', 'email', 'gender'])
df = df.drop_duplicates()
print("Filtered dataset shape:", df.shape)
print(df['career_aspiration'].value_counts())

# Convert boolean columns to int
df['part_time_job'] = df['part_time_job'].astype(int)
df['extracurricular_activities'] = df['extracurricular_activities'].astype(int)

# -------------------------------
# 2️⃣ Feature Engineering
# -------------------------------
# Basic aggregates
df['total_Score'] = df[['math_score','physics_score','chemistry_score','biology_score',
                        'english_score','history_score','geography_score']].sum(axis=1)
df['avg_score'] = df['total_Score'] / 7
df['math_physics'] = df[['math_score','physics_score']].sum(axis=1)
df['biology_chemistry'] = df[['biology_score','chemistry_score']].sum(axis=1)
df['science'] = df[['math_score','physics_score','chemistry_score','biology_score']].sum(axis=1)
df['humanities'] = df[['english_score','history_score','geography_score']].sum(axis=1)

# Average STEM subjects
df['avg_science'] = df[['math_score','physics_score','chemistry_score','biology_score']].mean(axis=1)
# Average Humanities subjects
df['avg_humanities'] = df[['english_score','history_score','geography_score']].mean(axis=1)
# Average Math & Physics
df['avg_math_physics'] = df[['math_score','physics_score']].mean(axis=1)
# Average Biology & Chemistry
df['avg_bio_chem'] = df[['biology_score','chemistry_score']].mean(axis=1)
# Average English, History & Geography
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

# Relative strengths (vs average)
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

# Dominant area (STEM vs Humanities)
df['dominant_area'] = df[['science','humanities']].idxmax(axis=1)
df = pd.get_dummies(df, columns=['dominant_area'], drop_first=True)

print("Feature engineering completed. Columns now:", df.columns.tolist())

# -------------------------------
# 3️⃣ Feature Scaling
# -------------------------------
donot_scale = ['career_aspiration','part_time_job','extracurricular_activities',
               'is_high_self_study_per_week','has_more_absences',
               'high_absence_low_study','high_extracurricular_high_study',
               'low_study_high_extracurricular','high_study_low_absence']
feature_cols = [col for col in df.columns if col not in donot_scale]

scaler = StandardScaler()
df[feature_cols] = scaler.fit_transform(df[feature_cols])

# -------------------------------
# 4️⃣ Save cleaned dataset
# -------------------------------
OUTPUT_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'cleaned-student-scores.csv')
df.to_csv(OUTPUT_PATH, index=False)
print("Processed dataset saved to:", OUTPUT_PATH)
