import pandas as pd
import numpy as np
import os

from sklearn.preprocessing import StandardScaler


# -------------------------------
# 1️⃣ Load dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
DATA_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'student-scores.csv')

df = pd.read_csv(DATA_PATH)
print("Dataset loaded. Shape:", df.shape)
print(df.columns)
# career_aspiration == not unknown
df = df[df["career_aspiration"].str.strip().str.lower() != "unknown"]
print(df['career_aspiration'].value_counts())

# Remove Duplicate rows if any
df = df.drop_duplicates()


# 6) IQR capping
def iqr_fun(series, k=1.5):
    q1, q3 = series.quantile([0.25, 0.75])
    iqr = q3 - q1
    lower = q1 - k * iqr
    upper = q3 + k * iqr
    return lower, upper

lower_self_study, upper_self_study = iqr_fun(df['weekly_self_study_hours'])
lower_absence, upper_absence = iqr_fun(df['absence_days'])

df['weekly_self_study_hours'] = df['weekly_self_study_hours'].clip(lower_self_study, upper_self_study)
df['absence_days'] = df['absence_days'].clip(lower_absence, upper_absence)

# The dictionary used to map the student's **career aspiration** to the relevant **faculty** is as follows:

faculty_mapping = {
    'Software Engineer': 'Faculty of Computer and Information Technology',
    'Game Developer': 'Faculty of Computer and Information Technology',
    'Construction Engineer': 'Faculty of Engineering',
    'Scientist': 'Faculty of Science',
    'Doctor': 'Faculty of Medicine and Surgery',
    'Lawyer': 'Faculty of Law',
    'Teacher': 'Faculty of Education',
    'Government Officer': 'Faculty of Social Science',
    'Business Owner': 'Faculty of Economic and Management Science',
    'Banker': 'Faculty of Economic and Management Science',
    'Accountant': 'Faculty of Economic and Management Science',
    'Stock Investor': 'Faculty of Economic and Management Science',
    'Real Estate Developer': 'Faculty of Economic and Management Science',
    'Writer': 'Faculty of Languages',
    'Artist': 'Faculty of Languages',
    'Designer': 'Faculty of Languages'
}

df['Faculty'] = df['career_aspiration'].map(faculty_mapping)
print(df['Faculty'].value_counts())

# -------------------------------
# 2️⃣ feature engineering (enhanced)
# -------------------------------

# define subject groups
math_phy = ['math_score', 'physics_score']
che_bio = ['chemistry_score', 'biology_score']
geo_bio = ['geography_score', 'biology_score']
eng_hist = ['english_score', 'history_score']
stem = ['math_score', 'physics_score', 'chemistry_score', 'biology_score']
non_stem = ['english_score', 'geography_score', 'history_score']

# -------------------------------
# calculate total scores
# -------------------------------
df['math_physics_total'] = df[math_phy].sum(axis=1)
df['chem_biology_total'] = df[che_bio].sum(axis=1)
df['geo_biology_total'] = df[geo_bio].sum(axis=1)
df['english_history_total'] = df[eng_hist].sum(axis=1)
df['stem_total'] = df[stem].sum(axis=1)
df['non_stem_total'] = df[non_stem].sum(axis=1)

# ------------------------------- avgerage scores
df['math_physics_avg'] = df[math_phy].mean(axis=1).round(2)
df['chem_biology_avg'] = df[che_bio].mean(axis=1).round(2)
df['geo_biology_avg'] = df[geo_bio].mean(axis=1).round(2)
df['english_history_avg'] = df[eng_hist].mean(axis=1).round(2)
df['stem_avg'] = df[stem].mean(axis=1).round(2)
df['non_stem_avg'] = df[non_stem].mean(axis=1).round(2)
df['overall_average_score'] = df[stem + non_stem].mean(axis=1).round(2)

# overall total score across all subjects
df['overall_total_score'] = df[math_phy + che_bio + geo_bio + eng_hist].sum(axis=1)

# high achiever in stem
df['high_stem_achiever'] = (df['stem_total'] >= 340).astype(int)  # ~85 * 4 subjects

# -------------------------------
# binary comparison indicators
# -------------------------------
df['is_higher_math_phy'] = (df['math_physics_total'] > df['chem_biology_total']).astype(int)
df['is_higher_che_bio'] = (df['chem_biology_total'] > df['math_physics_total']).astype(int)
df['is_higher_non_stem'] = (df['non_stem_total'] > 255).astype(int)  # ~85 * 3
df['is_higher_geo_bio'] = (df['geo_biology_total'] > 180).astype(int)  # ~90 * 2
df['is_higher_eng_hist'] = (df['english_history_total'] > 180).astype(int)  # ~90 * 2

# -------------------------------
# study efficiency metric
# -------------------------------
df['study_efficiency'] = df['weekly_self_study_hours'] / (df['absence_days'] + 1)
df['study_efficiency'] = (
    df['study_efficiency']
    .replace([np.inf, -np.inf], 0)
    .fillna(0)
    .round(2)
)

# -------------------------------
# normalize study efficiency (optional)
# -------------------------------
df['study_efficiency_norm'] = (
    (df['study_efficiency'] - df['study_efficiency'].min()) /
    (df['study_efficiency'].max() - df['study_efficiency'].min())
).round(3)

# -------------------------------
# 🎓Faculty Recommendation Logic 

def recommend_faculty(row):
    ACADEMIC_HIGH = 90.0
    ACADEMIC_MID_HIGH = 85.0
    ACADEMIC_MID = 80.0
    EFFICIENCY_NORM_HIGH = 0.6

    efficiency_norm = row['study_efficiency_norm']
    has_job = row['part_time_job']
    extracurricular = row['extracurricular_activities']
    
    stem_avg = row['stem_avg']
    non_stem_avg = row['non_stem_avg']
    math_phy_avg = row['math_physics_avg']
    chem_bio_avg = row['chem_biology_avg']
    geo_bio_avg = row['geo_biology_avg']
    eng_hist_avg = row['english_history_avg']

    # Medicine & Health Sciences
    if chem_bio_avg >= ACADEMIC_HIGH and efficiency_norm > 0.1:
        return "Faculty of Medicine and Surgery"
    elif chem_bio_avg >= ACADEMIC_MID_HIGH and efficiency_norm > 0.1:
        return "Faculty of Biomedical Engineering"
    elif chem_bio_avg >= ACADEMIC_MID and efficiency_norm > 0.1:
        return "Faculty of Veterinary Medicine & Animal Husbandry"

    # Engineering / IT
    if math_phy_avg >= ACADEMIC_HIGH and efficiency_norm > EFFICIENCY_NORM_HIGH:
        return "Faculty of Engineering"
    elif math_phy_avg >= ACADEMIC_MID_HIGH and efficiency_norm > 0.1:
        return "Faculty of Computer and Information Technology"

    # Science & Agriculture
    if stem_avg >= ACADEMIC_MID_HIGH and chem_bio_avg >= ACADEMIC_MID:
        return "Faculty of Science"
    elif geo_bio_avg >= ACADEMIC_MID_HIGH:
        return "Faculty of Agriculture Environmental Science"

    # Business / Economics / Law
    if non_stem_avg >= ACADEMIC_HIGH and efficiency_norm > 0.5:
        return "Faculty of Economic and Management Science"
    elif eng_hist_avg >= ACADEMIC_MID_HIGH and has_job:
        return "Faculty of Law"

    # Education & Languages
    if eng_hist_avg >= ACADEMIC_MID_HIGH and extracurricular:
        return "Faculty of Education"
    elif eng_hist_avg >= ACADEMIC_MID:
        return "Faculty of Languages"

    # Sharia & Social Sciences
    if non_stem_avg >= 70 and extracurricular:
        return "Faculty of Sharia"
    elif non_stem_avg >= ACADEMIC_MID_HIGH:
        return "Faculty of Social Science"

    # Default fallback
    return "Faculty of Social Science"

# apply logic
df['recommended_faculty'] = df.apply(recommend_faculty, axis=1)

# view results summary
print(df['recommended_faculty'].value_counts())

# Convert boolean to int (1 for True, 0 for False)
df['high_stem_achiever'] = df['high_stem_achiever'].astype(int)
df['part_time_job'] = df['part_time_job'].astype(int)
df['extracurricular_activities'] = df['extracurricular_activities'].astype(int)
# -------------------------------
# # 3️⃣ Scale numeric features
# # -------------------------------
score_cols = [
    'math_physics_avg','chem_biology_avg','geo_biology_avg','english_history_avg','overall_average_score',
    'overall_total_score','stem_avg','non_stem_avg',
    'stem_total','non_stem_total','math_physics_total' ,'chem_biology_total', 'geo_biology_total', 'english_history_total', 'weekly_self_study_hours', 'study_efficiency', 'math_score', 'history_score', 
    'physics_score', 'chemistry_score', 'biology_score', 'english_score', 'geography_score'
]
numeric_cols = score_cols + ['absence_days'] 

scaler = StandardScaler()
df[numeric_cols] = scaler.fit_transform(df[numeric_cols])


# -------------------------------
# drop columns we don't need
# -------------------------------
df = df.drop(columns=['id', 'first_name', 'last_name', 'email','gender','career_aspiration',
                      'stem_total','non_stem_total',
                      'stem_avg','non_stem_avg','high_stem_achiever'])

# # # -------------------------------
# # # 4️⃣ Save processed dataset
# # -------------------------------
OUTPUT_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'cleaned-student-scores.csv')
df.to_csv(OUTPUT_PATH, index=False)
print("Processed dataset saved to:", OUTPUT_PATH)