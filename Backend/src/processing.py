import pandas as pd
import numpy as np
import os

from sklearn.preprocessing import StandardScaler, LabelEncoder

# -------------------------------
# 1️⃣ Load dataset
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
DATA_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'student-scores.csv')

df = pd.read_csv(DATA_PATH)
print("Dataset loaded. Shape:", df.shape)

# Filter out unknown career aspirations
df = df[df["career_aspiration"].str.strip().str.lower() != "unknown"]
df = df.drop(columns=['id', 'first_name', 'last_name', 'email','gender'])
df = df.drop_duplicates()
print("Filtered dataset shape:", df.shape)
print(df['career_aspiration'].value_counts())

# boolean columns to int
df['part_time_job'] = df['part_time_job'].astype(int)
df['extracurricular_activities'] = df['extracurricular_activities'].astype(int)

# ------------------------------
# Feature Engineering
#------------------------------
df['Total_Score'] = df[['math_score', 'physics_score', 'chemistry_score', 'biology_score', 'english_score', 'history_score', 'geography_score']].sum(axis=1)

# -------------------------------
# 4️⃣ Feature scaling
# -------------------------------
donot_scale = ['career_aspiration']
feature_cols = [col for col in df.columns if col not in donot_scale]
scaler = StandardScaler()
df[feature_cols] = scaler.fit_transform(df[feature_cols])

print(df.columns)
# -------------------------------
# 5️⃣ Save cleaned dataset
# -------------------------------
OUTPUT_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'cleaned-student-scores.csv')
df.to_csv(OUTPUT_PATH, index=False)
print("Processed dataset saved to:", OUTPUT_PATH)
