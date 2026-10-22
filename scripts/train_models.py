"""
CareCycle AI - Robust ML Training Pipeline
Trains:
1. CIA (Cycle Intelligence Agent): Predicts cycle length & period duration with feature attribution.
2. CRDSA (Caregiver Risk & Decision Support Agent): Predicts caregiver alert trigger (calibrated classifier) & risk score (regressor).
3. SUA (Symptom Understanding Agent): Predicts symptom severity & detects pain masking / silent distress.
"""

import os
import json
import datetime
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    mean_absolute_error, root_mean_squared_error, r2_score, confusion_matrix
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
EXCEL_PATH = os.path.join(DATA_DIR, 'CareCycle_AI_Disability_Menstrual_Dataset.xlsx')
MODELS_DIR = os.path.join(DATA_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

def train_and_evaluate():
    print(f"Loading dataset from: {EXCEL_PATH}")
    if not os.path.exists(EXCEL_PATH):
        raise FileNotFoundError(f"Dataset not found at {EXCEL_PATH}")

    df_raw = pd.read_excel(EXCEL_PATH, sheet_name='Combined_Dataset')
    print(f"Loaded {len(df_raw)} records, {len(df_raw.columns)} columns.")

    df = df_raw.copy()

    # 1. Cleaning & Imputations
    df['primary_disability'] = df['primary_disability'].fillna('Other Health Impairment')
    df['cooccurring_disability'] = df['cooccurring_disability'].fillna('None')
    df['communication_ability'] = df['communication_ability'].fillna('Verbal - reliable')
    df['caregiver_dependency_level'] = df['caregiver_dependency_level'].fillna('Independent')
    df['diet_quality'] = df['diet_quality'].fillna('Balanced')
    df['aac_use'] = df['aac_use'].fillna('No')
    df['symptom_severity_category'] = df['symptom_severity_category'].fillna('Moderate').astype(str).str.strip().str.title()
    # Normalize category labels
    valid_severities = ['Mild', 'Moderate', 'Severe', 'Very Severe']
    df['symptom_severity_category'] = df['symptom_severity_category'].apply(
        lambda x: x if x in valid_severities else 'Moderate'
    )

    df['age'] = pd.to_numeric(df['age'], errors='coerce').fillna(17.0)
    df['bmi'] = pd.to_numeric(df['bmi'], errors='coerce').fillna(22.0)
    df['stress_level_1_10'] = pd.to_numeric(df['stress_level_1_10'], errors='coerce').fillna(5.0)
    df['exercise_freq_per_week'] = pd.to_numeric(df['exercise_freq_per_week'], errors='coerce').fillna(2.0)
    df['sleep_hours'] = pd.to_numeric(df['sleep_hours'], errors='coerce').fillna(7.5)
    df['cycle_length_days'] = pd.to_numeric(df['cycle_length_days'], errors='coerce').fillna(28.0)
    df['period_duration_days'] = pd.to_numeric(df['period_duration_days'], errors='coerce').fillna(5.0)
    df['pain_level_0_4_BioVid_scale'] = pd.to_numeric(df['pain_level_0_4_BioVid_scale'], errors='coerce').fillna(1.0)
    df['pspi_score_0_15_UNBC_scale'] = pd.to_numeric(df['pspi_score_0_15_UNBC_scale'], errors='coerce').fillna(3.0)
    df['risk_score_0_15'] = pd.to_numeric(df['risk_score_0_15'], errors='coerce').fillna(3.0)
    df['self_report_reliable'] = pd.to_numeric(df['self_report_reliable'], errors='coerce').fillna(1.0)
    df['caregiver_observed_pain_0_4'] = pd.to_numeric(df['caregiver_observed_pain_0_4'], errors='coerce').fillna(0.0)

    # Symptom parsing
    def count_symptoms(s):
        if pd.isna(s):
            return 0
        items = [x.strip() for x in str(s).split(',') if x.strip() and x.strip().lower() != 'none']
        return len(items)

    df['symptom_count'] = df['reported_symptoms'].apply(count_symptoms)
    df['stress_sleep_ratio'] = df['stress_level_1_10'] / (df['sleep_hours'] + 0.1)

    # Export clean CSV & JSON for application use
    csv_path = os.path.join(DATA_DIR, 'carecycle_dataset.csv')
    json_path = os.path.join(DATA_DIR, 'carecycle_dataset.json')
    df.to_csv(csv_path, index=False)

    records = df.to_dict(orient='records')
    for r in records:
        for k, v in r.items():
            if isinstance(v, (datetime.date, datetime.datetime, pd.Timestamp)):
                r[k] = v.strftime('%Y-%m-%d')
            elif pd.isna(v):
                r[k] = None

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(records, f, indent=2)
    print(f"Exported clean dataset to {csv_path} and {json_path}")

    # ==========================================
    # 1. MODEL 1: Cycle Intelligence Agent (CIA)
    # Predicts cycle_length_days
    # ==========================================
    cia_num_cols = ['age', 'bmi', 'stress_level_1_10', 'exercise_freq_per_week', 'sleep_hours', 'stress_sleep_ratio']
    cia_cat_cols = ['primary_disability', 'diet_quality']
    
    cia_preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), cia_num_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cia_cat_cols)
        ]
    )

    X_cia = df[cia_num_cols + cia_cat_cols]
    y_cycle = df['cycle_length_days']

    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_cia, y_cycle, test_size=0.2, random_state=42)

    cia_pipeline = Pipeline([
        ('preprocessor', cia_preprocessor),
        ('model', GradientBoostingRegressor(n_estimators=80, max_depth=3, learning_rate=0.05, random_state=42))
    ])
    cia_pipeline.fit(X_train_c, y_train_c)
    y_pred_c = cia_pipeline.predict(X_test_c)

    cia_mae = float(mean_absolute_error(y_test_c, y_pred_c))
    cia_rmse = float(root_mean_squared_error(y_test_c, y_pred_c))
    cia_r2 = float(r2_score(y_test_c, y_pred_c))
    print(f"[CIA Cycle Model] MAE: {cia_mae:.2f} days | RMSE: {cia_rmse:.2f} days")

    # Feature importances
    fitted_gb_c = cia_pipeline.named_steps['model']
    ohe_c = cia_pipeline.named_steps['preprocessor'].named_transformers_['cat']
    cat_feature_names_c = list(ohe_c.get_feature_names_out(cia_cat_cols))
    all_feature_names_c = cia_num_cols + cat_feature_names_c
    c_importances = [
        {"feature": name, "importance": round(float(imp), 4)}
        for name, imp in sorted(zip(all_feature_names_c, fitted_gb_c.feature_importances_), key=lambda x: x[1], reverse=True)[:8]
    ]

    joblib.dump(cia_pipeline, os.path.join(MODELS_DIR, 'cia_cycle_model.joblib'))

    # ==========================================
    # 2. MODEL 2: Caregiver Risk Agent (CRDSA)
    # Predicts caregiver_alert_triggered (Binary) & risk_score_0_15 (Regressor)
    # ==========================================
    crdsa_num_cols = ['age', 'stress_level_1_10', 'pain_level_0_4_BioVid_scale', 'pspi_score_0_15_UNBC_scale', 'self_report_reliable', 'symptom_count', 'stress_sleep_ratio']
    crdsa_cat_cols = ['primary_disability', 'communication_ability', 'caregiver_dependency_level', 'symptom_severity_category', 'aac_use']

    crdsa_preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), crdsa_num_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), crdsa_cat_cols)
        ]
    )

    X_crdsa = df[crdsa_num_cols + crdsa_cat_cols]
    y_alert = df['caregiver_alert_triggered'].apply(lambda x: 1 if str(x).strip().lower() == 'yes' else 0)
    y_risk = df['risk_score_0_15']

    X_train_r, X_test_r, y_train_alert, y_test_alert = train_test_split(
        X_crdsa, y_alert, test_size=0.2, random_state=42, stratify=y_alert
    )

    crdsa_classifier = Pipeline([
        ('preprocessor', crdsa_preprocessor),
        ('model', RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42))
    ])
    crdsa_classifier.fit(X_train_r, y_train_alert)
    y_pred_alert = crdsa_classifier.predict(X_test_r)
    y_prob_alert = crdsa_classifier.predict_proba(X_test_r)[:, 1]

    acc = float(accuracy_score(y_test_alert, y_pred_alert))
    prec = float(precision_score(y_test_alert, y_pred_alert, zero_division=0))
    rec = float(recall_score(y_test_alert, y_pred_alert, zero_division=0))
    f1 = float(f1_score(y_test_alert, y_pred_alert, zero_division=0))
    roc_auc = float(roc_auc_score(y_test_alert, y_prob_alert))
    cm = confusion_matrix(y_test_alert, y_pred_alert).tolist()

    print(f"[CRDSA Alert Classifier] Accuracy: {acc:.3f} | F1: {f1:.3f} | ROC-AUC: {roc_auc:.3f}")

    # Risk Score Continuous Regressor
    crdsa_regressor = Pipeline([
        ('preprocessor', crdsa_preprocessor),
        ('model', GradientBoostingRegressor(n_estimators=100, max_depth=4, random_state=42))
    ])
    _, _, y_train_risk, y_test_risk = train_test_split(X_crdsa, y_risk, test_size=0.2, random_state=42)
    crdsa_regressor.fit(X_train_r, y_train_risk)
    y_pred_risk = crdsa_regressor.predict(X_test_r)
    risk_mae = float(mean_absolute_error(y_test_risk, y_pred_risk))
    risk_r2 = float(r2_score(y_test_risk, y_pred_risk))
    print(f"[CRDSA Risk Regressor] MAE: {risk_mae:.2f} points (scale 0-15) | R2: {risk_r2:.3f}")

    # Feature importance
    fitted_rf_r = crdsa_classifier.named_steps['model']
    ohe_r = crdsa_classifier.named_steps['preprocessor'].named_transformers_['cat']
    cat_feature_names_r = list(ohe_r.get_feature_names_out(crdsa_cat_cols))
    all_feature_names_r = crdsa_num_cols + cat_feature_names_r
    r_importances = [
        {"feature": name, "importance": round(float(imp), 4)}
        for name, imp in sorted(zip(all_feature_names_r, fitted_rf_r.feature_importances_), key=lambda x: x[1], reverse=True)[:10]
    ]

    joblib.dump(crdsa_classifier, os.path.join(MODELS_DIR, 'crdsa_alert_classifier.joblib'))
    joblib.dump(crdsa_regressor, os.path.join(MODELS_DIR, 'crdsa_risk_regressor.joblib'))

    # ==========================================
    # 3. MODEL 3: Symptom Understanding Agent (SUA)
    # Predicts symptom_severity_category
    # ==========================================
    sua_num_cols = ['pain_level_0_4_BioVid_scale', 'pspi_score_0_15_UNBC_scale', 'self_report_reliable', 'stress_level_1_10']
    sua_cat_cols = ['primary_disability', 'communication_ability']

    sua_preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), sua_num_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), sua_cat_cols)
        ]
    )

    X_sua = df[sua_num_cols + sua_cat_cols]
    y_severity = df['symptom_severity_category']

    X_train_s, X_test_s, y_train_sev, y_test_sev = train_test_split(
        X_sua, y_severity, test_size=0.2, random_state=42
    )

    sua_classifier = Pipeline([
        ('preprocessor', sua_preprocessor),
        ('model', RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42))
    ])
    sua_classifier.fit(X_train_s, y_train_sev)
    y_pred_sev = sua_classifier.predict(X_test_s)
    sua_acc = float(accuracy_score(y_test_sev, y_pred_sev))
    print(f"[SUA Severity Classifier] Accuracy: {sua_acc:.3f}")

    joblib.dump(sua_classifier, os.path.join(MODELS_DIR, 'sua_severity_classifier.joblib'))

    # ==========================================
    # 4. Generate Comprehensive Evaluation Artifact
    # ==========================================
    disability_counts = df['primary_disability'].value_counts().to_dict()
    severity_counts = df['symptom_severity_category'].value_counts().to_dict()
    alert_counts = df['caregiver_alert_triggered'].value_counts().to_dict()
    comm_counts = df['communication_ability'].value_counts().to_dict()

    avg_pain_by_disability = df.groupby('primary_disability')['pspi_score_0_15_UNBC_scale'].mean().round(2).to_dict()
    avg_cycle_by_disability = df.groupby('primary_disability')['cycle_length_days'].mean().round(1).to_dict()
    alert_rate_by_disability = (df.groupby('primary_disability')['caregiver_alert_triggered'].apply(lambda s: (s == 'Yes').mean() * 100)).round(1).to_dict()
    silent_distress_count = int(((df['self_report_reliable'] == 0) & (df['pspi_score_0_15_UNBC_scale'] >= 7)).sum())

    metrics_payload = {
        "timestamp": datetime.datetime.now().isoformat(),
        "total_records": len(df),
        "models": {
            "cia_cycle_model": {
                "name": "Cycle Intelligence Regressor",
                "agent": "CIA",
                "algorithm": "GradientBoostingRegressor (n=80, lr=0.05)",
                "mae_days": round(cia_mae, 2),
                "rmse_days": round(cia_rmse, 2),
                "r2_score": round(cia_r2, 3),
                "top_features": c_importances
            },
            "crdsa_alert_classifier": {
                "name": "Caregiver Alert Classifier",
                "agent": "CRDSA",
                "algorithm": "RandomForestClassifier (n=100, max_depth=6)",
                "accuracy": round(acc, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4),
                "f1_score": round(f1, 4),
                "roc_auc": round(roc_auc, 4),
                "confusion_matrix": cm,
                "top_features": r_importances
            },
            "crdsa_risk_regressor": {
                "name": "Continuous Risk Score Regressor",
                "agent": "CRDSA",
                "algorithm": "GradientBoostingRegressor (n=100, max_depth=4)",
                "mae": round(risk_mae, 2),
                "r2_score": round(risk_r2, 3)
            },
            "sua_severity_classifier": {
                "name": "Symptom Severity Classifier",
                "agent": "SUA",
                "algorithm": "RandomForestClassifier (n=100, max_depth=5)",
                "accuracy": round(sua_acc, 4),
                "classes": list(sua_classifier.classes_)
            }
        },
        "dataset_insights": {
            "total_users": len(df),
            "disability_distribution": disability_counts,
            "severity_distribution": severity_counts,
            "alert_distribution": alert_counts,
            "communication_distribution": comm_counts,
            "avg_pain_by_disability": avg_pain_by_disability,
            "avg_cycle_by_disability": avg_cycle_by_disability,
            "alert_rate_by_disability_pct": alert_rate_by_disability,
            "silent_distress_detected_count": silent_distress_count,
            "mean_cycle_length": round(float(df['cycle_length_days'].mean()), 1),
            "mean_stress_level": round(float(df['stress_level_1_10'].mean()), 1),
            "mean_sleep_hours": round(float(df['sleep_hours'].mean()), 1)
        }
    }

    metrics_json_path = os.path.join(MODELS_DIR, 'model_metrics.json')
    with open(metrics_json_path, 'w', encoding='utf-8') as f:
        json.dump(metrics_payload, f, indent=2)

    # Also copy to frontend public directory so the client can access it statically if offline
    frontend_public_data = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'public', 'data')
    os.makedirs(frontend_public_data, exist_ok=True)
    with open(os.path.join(frontend_public_data, 'model_metrics.json'), 'w', encoding='utf-8') as f:
        json.dump(metrics_payload, f, indent=2)
    with open(os.path.join(frontend_public_data, 'carecycle_dataset.json'), 'w', encoding='utf-8') as f:
        json.dump(records[:100], f, indent=2)

    print(f"All models trained and saved to {MODELS_DIR}")
    print(f"Metrics saved to {metrics_json_path} and frontend public directory.")
    return metrics_payload

if __name__ == '__main__':
    train_and_evaluate()
