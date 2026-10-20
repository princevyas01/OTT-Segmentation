"""
app.py - Academic DSML Mini-Project Frontend
OTT User Behavioral Segmentation and Recommendation Analysis System
Engineered for Academic Presentation (B.Tech / B.E. Computer Science & Engineering)
Clean, professional, research-grade design without neon or vibrant colors.
"""

import os
import json
import numpy as np
import pandas as pd
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans, DBSCAN
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score

# ==============================================================================
# Page Configuration
# ==============================================================================
st.set_page_config(
    page_title="OTT Viewer Segmentation & Recommendation | DSML Mini-Project",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Professional Academic Palette (Muted, accessible, high contrast)
PALETTE = {
    "Action Movie Lovers": "#1d4ed8",  # Academic Cobalt
    "Family Viewers": "#047857",       # Muted Emerald
    "Premium Users": "#b45309",        # Warm Ochre / Bronze
    "Casual Users": "#475569",         # Muted Slate
    "Noise": "#94a3b8"                 # Cool Gray
}

SEGMENT_COLORS = [
    PALETTE["Action Movie Lovers"],
    PALETTE["Family Viewers"],
    PALETTE["Premium Users"],
    PALETTE["Casual Users"]
]

FEATURES = [
    "Age", "WatchTime", "MoviesWatched", "SeriesWatched",
    "AvgRating", "LoginFrequency", "EngagementScore", "SubCode"
]
FEATURE_LABELS = {
    "Age": "Age (years)",
    "WatchTime": "Watch Time (hrs/week)",
    "MoviesWatched": "Movies Watched",
    "SeriesWatched": "Series Watched",
    "AvgRating": "Average Rating (1-5)",
    "LoginFrequency": "Login Frequency (days/week)",
    "EngagementScore": "Engagement Score (1-100)",
    "SubCode": "Subscription Tier (0-2)"
}
SUB_MAP = {"Basic": 0, "Standard": 1, "Premium": 2}
SUB_REV = {0: "Basic", 1: "Standard", 2: "Premium"}

# ==============================================================================
# Academic Styling (Clean, Neutral, Editorial - No Neons, No Vibe Glow)
# ==============================================================================
st.markdown("""
<style>
    /* Clean Academic Styling */
    html, body, [class*="css"] {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 3rem;
        max-width: 1300px;
    }
    
    /* Academic Banner */
    .academic-header {
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-left: 5px solid #1e3a8a;
        border-radius: 6px;
        padding: 20px 24px;
        margin-bottom: 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .academic-tag {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #1e3a8a;
        margin-bottom: 4px;
    }
    .academic-title {
        font-size: 1.55rem;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 6px 0;
        line-height: 1.3;
    }
    .academic-desc {
        font-size: 0.92rem;
        color: #475569;
        margin: 0;
        line-height: 1.5;
    }
    
    /* Metric Cards */
    .kpi-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 14px 18px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .kpi-label {
        font-size: 0.78rem;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }
    .kpi-value {
        font-size: 1.55rem;
        font-weight: 700;
        color: #0f172a;
        margin-top: 4px;
    }
    .kpi-sub {
        font-size: 0.8rem;
        color: #64748b;
        margin-top: 2px;
    }

    /* Section Cards */
    .section-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .section-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 12px;
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 8px;
    }

    /* Persona Badge */
    .persona-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.82rem;
        font-weight: 600;
        margin-right: 6px;
    }

    /* Tab styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        border-bottom: 1px solid #e2e8f0;
    }
    .stTabs [data-baseweb="tab"] {
        font-weight: 600;
        font-size: 0.9rem;
        color: #475569;
        padding: 8px 16px;
    }
    .stTabs [aria-selected="true"] {
        color: #1e3a8a !important;
        border-bottom: 2px solid #1e3a8a !important;
    }
</style>
""", unsafe_allow_html=True)

OUT = "outputs"

# ==============================================================================
# Pipeline Initializer & Cache Data Loading
# ==============================================================================
def ensure_pipeline():
    if not os.path.exists(f"{OUT}/clustered_users.csv"):
        with st.spinner("Executing pipeline (generate_data.py -> main.py)..."):
            import generate_data
            import main
            import build_report

@st.cache_data
def load_data():
    ensure_pipeline()
    df = pd.read_csv(f"{OUT}/clustered_users.csv")
    cmp_df = pd.read_csv(f"{OUT}/model_comparison.csv")
    with open(f"{OUT}/results.json", "r") as f:
        results_json = json.load(f)
    try:
        from recommendation import RECOMMENDATIONS
    except Exception:
        rec_df = pd.read_csv(f"{OUT}/recommendations.csv").set_index("Cluster")
        RECOMMENDATIONS = rec_df.to_dict("index")
    return df, cmp_df, results_json, RECOMMENDATIONS

df, cmp_df, results_json, RECS = load_data()

# Scaler & Centroids
scaler = StandardScaler().fit(df[FEATURES])
centroids = pd.DataFrame(scaler.transform(df[FEATURES]), columns=FEATURES).groupby(df["Segment"].values).mean()

# PCA computation (2D and 3D)
@st.cache_data
def compute_pca(data_features):
    pca_2d = PCA(n_components=2, random_state=42)
    coords_2d = pca_2d.fit_transform(scaler.transform(data_features))
    pca_3d = PCA(n_components=3, random_state=42)
    coords_3d = pca_3d.fit_transform(scaler.transform(data_features))
    return coords_2d, pca_2d.explained_variance_ratio_, coords_3d, pca_3d.explained_variance_ratio_

coords_2d, evr_2d, coords_3d, evr_3d = compute_pca(df[FEATURES])
df["PC1"] = coords_2d[:, 0]
df["PC2"] = coords_2d[:, 1]
df["PC3"] = coords_3d[:, 2]

def predict_segment_with_scores(row_dict):
    z = scaler.transform(pd.DataFrame([row_dict])[FEATURES])[0]
    distances = {}
    for seg, centroid_vec in centroids.iterrows():
        d = np.linalg.norm(centroid_vec.values - z)
        distances[seg] = float(d)
    
    # Invert distance to get similarity/confidence weight
    inv_d = {k: 1.0 / (v + 1e-5) for k, v in distances.items()}
    total_inv = sum(inv_d.values())
    confidence = {k: (v / total_inv) * 100 for k, v in inv_d.items()}
    best_seg = min(distances, key=distances.get)
    return best_seg, distances, confidence

# ==============================================================================
# Header Banner
# ==============================================================================
st.markdown("""
<div class="academic-header">
    <div class="academic-tag">Department of Computer Science & Engineering • DSML Mini-Project</div>
    <div class="academic-title">🎬 OTT User Behavioral Segmentation & Recommendation Analysis System</div>
    <div class="academic-desc">
        An Unsupervised Machine Learning Framework for Audience Characterization, Churn Mitigation, and Catalog Personalization.
        Benchmarking <strong>K-Means Clustering</strong> against <strong>DBSCAN</strong> across 8 behavioral viewing dimensions.
    </div>
</div>
""", unsafe_allow_html=True)

# Top Key Performance Indicators
k1, k2, k3, k4 = st.columns(4)
with k1:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-label">Analyzed User Base</div>
        <div class="kpi-value">{len(df):,}</div>
        <div class="kpi-sub">Cleaned records (10 duplicates purged)</div>
    </div>
    """, unsafe_allow_html=True)
with k2:
    median_watch = df["WatchTime"].median()
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-label">Median Watch Time</div>
        <div class="kpi-value">{median_watch:.1f} <span style="font-size:0.9rem;font-weight:normal;color:#64748b">hrs/wk</span></div>
        <div class="kpi-sub">Mean: {df['WatchTime'].mean():.1f} hrs/wk</div>
    </div>
    """, unsafe_allow_html=True)
with k3:
    km_sil = cmp_df.loc[cmp_df["Algorithm"] == "K-Means", "Silhouette"].values[0]
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-label">Optimal Model (K-Means)</div>
        <div class="kpi-value">k = 4</div>
        <div class="kpi-sub">Silhouette Score: <strong>{km_sil:.3f}</strong> (0 noise)</div>
    </div>
    """, unsafe_allow_html=True)
with k4:
    prem_pct = (df["SubscriptionType"] == "Premium").mean() * 100
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-label">Premium Tier Share</div>
        <div class="kpi-value">{prem_pct:.1f}%</div>
        <div class="kpi-sub">Standard: {(df['SubscriptionType'] == 'Standard').mean()*100:.1f}% | Basic: {(df['SubscriptionType'] == 'Basic').mean()*100:.1f}%</div>
    </div>
    """, unsafe_allow_html=True)

st.write("")

# ==============================================================================
# Sidebar - Academic Controls & Cohort Filters
# ==============================================================================
st.sidebar.markdown("### 🎓 Project Controls")
st.sidebar.caption("Filter active cohort for statistical recalculation.")

# Segment Filter
all_segments = sorted(df["Segment"].unique())
selected_segments = st.sidebar.multiselect("Audience Segments", all_segments, default=all_segments)

# Subscription Filter
all_subs = ["Basic", "Standard", "Premium"]
selected_subs = st.sidebar.multiselect("Subscription Tiers", all_subs, default=all_subs)

# Device Filter
all_devices = sorted(df["DeviceType"].unique())
selected_devices = st.sidebar.multiselect("Streaming Devices", all_devices, default=all_devices)

# Age Filter
min_age, max_age = int(df["Age"].min()), int(df["Age"].max())
selected_age = st.sidebar.slider("Viewer Age Range", min_age, max_age, (min_age, max_age))

# Quick Filter Buttons
st.sidebar.write("")
col_sb1, col_sb2 = st.sidebar.columns(2)
if col_sb1.button("Reset Filters", use_container_width=True):
    st.rerun()

# Apply filter
filtered_df = df[
    df["Segment"].isin(selected_segments) &
    df["SubscriptionType"].isin(selected_subs) &
    df["DeviceType"].isin(selected_devices) &
    df["Age"].between(*selected_age)
]

st.sidebar.markdown("---")
st.sidebar.markdown(f"""
**Cohort Status:**  
Filtered: **{len(filtered_df):,}** / **{len(df):,}** users  
Coverage: **{(len(filtered_df)/len(df))*100:.1f}%**
""")
st.sidebar.markdown("---")
st.sidebar.markdown("""
**Academic Details:**  
- **Course**: CS603 Data Science & ML  
- **Batch**: 3rd Year (Semester VI)  
- **Techniques**: K-Means, DBSCAN, PCA, Standard Scaling
""")

# ==============================================================================
# Main Tabs Navigation
# ==============================================================================
tabs = st.tabs([
    "📋 Executive Brief & Pipeline",
    "📊 Exploratory Data Analysis",
    "👥 Segment Profiles & 3D PCA",
    "⚖️ K-Means vs DBSCAN Evaluation",
    "🎯 Targeted Recommendation Engine",
    "🧪 Live Persona Classifier",
    "🎓 Academic Defense & Viva Q&A"
])

# ------------------------------------------------------------------------------
# TAB 1: EXECUTIVE BRIEF & PIPELINE
# ------------------------------------------------------------------------------
with tabs[0]:
    st.markdown("""
    <div class="section-card">
        <div class="section-title">📌 Project Abstract & Problem Formulation</div>
        <p style="color:#334155;line-height:1.6;font-size:0.95rem;">
            Over-The-Top (OTT) streaming platforms face intense customer churn and recommendation fatigue. 
            Broad demographic targeting fails because users with identical ages often exhibit vastly differing binge behaviors. 
            This research presents an end-to-end unsupervised machine learning pipeline to discover organic behavioral personas 
            from continuous viewing telemetry (watch hours, content formats, login cadence, engagement scores), 
            benchmarking <strong>Partitional Clustering (K-Means)</strong> against <strong>Density-Based Clustering (DBSCAN)</strong>, 
            and mapping each segment to rule-based retention and catalog recommendations.
        </p>
    </div>
    """, unsafe_allow_html=True)

    c1, c2 = st.columns([3, 2])
    with c1:
        st.markdown("""
        <div class="section-card">
            <div class="section-title">⚙️ Machine Learning Pipeline Architecture</div>
            <div style="font-family: monospace; font-size: 0.84rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; line-height: 1.8; color: #1e293b;">
                1. <strong>Raw Ingestion</strong>: 1,010 records collected with synthetic noise, duplicates, and missing values.<br>
                2. <strong>Preprocessing & Cleaning</strong>:<br>
                   &nbsp;&nbsp;• Duplicates: 10 redundant rows removed.<br>
                   &nbsp;&nbsp;• Numerical Imputation: Median substitution for Age (21), WatchTime (21), AvgRating (21).<br>
                   &nbsp;&nbsp;• Categorical Imputation: Mode substitution for Gender, Genre, DeviceType, Subscription.<br>
                   &nbsp;&nbsp;• Feature Encoding: Ordinal mapping for Subscription (Basic=0, Standard=1, Premium=2).<br>
                3. <strong>Feature Scaling</strong>: Standard Z-score Normalization (mean=0, variance=1) across 8 dimensions.<br>
                4. <strong>Unsupervised Clustering</strong>: K-Means ($k=2..8$) with Elbow & Silhouette analysis vs DBSCAN (&epsilon;, MinPts).<br>
                5. <strong>Validation & Evaluation</strong>: Silhouette Score, Davies-Bouldin Index, Calinski-Harabasz Index.<br>
                6. <strong>Persona Profiling</strong>: Centroid characterization into 4 actionable business segments.<br>
                7. <strong>Inference & Recommendation Engine</strong>: Targeted catalog delivery & live classifier for incoming users.
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with c2:
        st.markdown("""
        <div class="section-card">
            <div class="section-title">📑 Preprocessing Data Audit</div>
        """, unsafe_allow_html=True)
        clean_rep = results_json.get("cleaning", {})
        audit_df = pd.DataFrame([
            {"Stage Metric": "Initial Raw Rows", "Value": clean_rep.get("Rows Before Cleaning", 1010)},
            {"Stage Metric": "Duplicate Records Removed", "Value": clean_rep.get("Duplicate Rows", 10)},
            {"Stage Metric": "Missing Age Values Imputed", "Value": clean_rep.get("Missing Values", {}).get("Age", 21)},
            {"Stage Metric": "Missing WatchTime Imputed", "Value": clean_rep.get("Missing Values", {}).get("WatchTime", 21)},
            {"Stage Metric": "Missing Rating Imputed", "Value": clean_rep.get("Missing Values", {}).get("AvgRating", 21)},
            {"Stage Metric": "Final Clean Analytical Sample", "Value": clean_rep.get("Rows After Cleaning", 1000)},
        ])
        st.dataframe(audit_df, use_container_width=True, hide_index=True)
        st.markdown("</div>", unsafe_allow_html=True)

    # Feature Matrix Table
    st.markdown("""
    <div class="section-card">
        <div class="section-title">📊 Mathematical Feature Space (8 Dimensions)</div>
    """, unsafe_allow_html=True)
    feat_desc = [
        {"Feature": "Age", "Type": "Continuous", "Scale": "Years (14 - 78)", "Significance": "Demographic anchor for content life-stage profiling."},
        {"Feature": "WatchTime", "Type": "Continuous", "Scale": "Hours / Week", "Significance": "Primary volume indicator of platform retention."},
        {"Feature": "MoviesWatched", "Type": "Discrete", "Scale": "Count / Month", "Significance": "Indicates preference for standalone, feature-length storytelling."},
        {"Feature": "SeriesWatched", "Type": "Discrete", "Scale": "Episodes / Month", "Significance": "Indicates binge-watching loyalty and episodic hook rate."},
        {"Feature": "AvgRating", "Type": "Continuous", "Scale": "Scale 1.0 - 5.0", "Significance": "Viewer satisfaction and discernment level."},
        {"Feature": "LoginFrequency", "Type": "Continuous", "Scale": "Days / Week", "Significance": "Session cadence indicator; high correlation with low churn."},
        {"Feature": "EngagementScore", "Type": "Continuous", "Scale": "Index 1 - 100", "Significance": "Composite platform vitality metric combining interactions and completion rates."},
        {"Feature": "SubCode", "Type": "Ordinal", "Scale": "0 (Basic), 1 (Standard), 2 (Premium)", "Significance": "Monetization tier determining ARPU (Average Revenue Per User)."}
    ]
    st.dataframe(pd.DataFrame(feat_desc), use_container_width=True, hide_index=True)
    st.markdown("</div>", unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# TAB 2: EXPLORATORY DATA ANALYSIS (INTERACTIVE EDA)
# ------------------------------------------------------------------------------
with tabs[1]:
    if len(filtered_df) == 0:
        st.warning("⚠️ No users match the selected sidebar filters. Please broaden your selection.")
    else:
        st.markdown("#### 🔬 Exploratory Data Analysis & Bivariate Feature Distributions")
        st.caption("All charts dynamically reflect your active sidebar cohort filters.")

        # Row 1
        r1_col1, r1_col2 = st.columns(2)
        with r1_col1:
            fig_watch = px.histogram(
                filtered_df,
                x="WatchTime",
                nbins=30,
                marginal="box",
                title="Weekly Watch Time Distribution (Hours/Week)",
                labels={"WatchTime": "Watch Time (Hours/Week)"},
                color_discrete_sequence=["#1e40af"]
            )
            fig_watch.update_layout(
                template="plotly_white",
                plot_bgcolor="#ffffff",
                paper_bgcolor="#ffffff",
                margin=dict(l=20, r=20, t=40, b=20),
                font=dict(family="sans-serif", size=11, color="#334155")
            )
            st.plotly_chart(fig_watch, use_container_width=True)

        with r1_col2:
            fig_genre = px.histogram(
                filtered_df,
                x="FavoriteGenre",
                color="SubscriptionType",
                barmode="group",
                title="Favorite Genre Distribution by Subscription Tier",
                labels={"FavoriteGenre": "Preferred Genre", "SubscriptionType": "Tier"},
                color_discrete_map={"Basic": "#64748b", "Standard": "#2563eb", "Premium": "#b45309"}
            )
            fig_genre.update_layout(
                template="plotly_white",
                plot_bgcolor="#ffffff",
                paper_bgcolor="#ffffff",
                margin=dict(l=20, r=20, t=40, b=20),
                font=dict(family="sans-serif", size=11, color="#334155")
            )
            st.plotly_chart(fig_genre, use_container_width=True)

        # Row 2
        r2_col1, r2_col2 = st.columns(2)
        with r2_col1:
            fig_scatter = px.scatter(
                filtered_df,
                x="MoviesWatched",
                y="SeriesWatched",
                color="Segment",
                color_discrete_map=PALETTE,
                hover_data=["UserID", "WatchTime", "EngagementScore"],
                title="Content Format Consumption: Movies vs Series",
                labels={"MoviesWatched": "Movies Watched", "SeriesWatched": "Series Watched"}
            )
            fig_scatter.update_layout(
                template="plotly_white",
                plot_bgcolor="#ffffff",
                paper_bgcolor="#ffffff",
                margin=dict(l=20, r=20, t=40, b=20),
                font=dict(family="sans-serif", size=11, color="#334155")
            )
            st.plotly_chart(fig_scatter, use_container_width=True)

        with r2_col2:
            fig_box = px.violin(
                filtered_df,
                x="SubscriptionType",
                y="EngagementScore",
                color="SubscriptionType",
                box=True,
                points="all",
                title="Engagement Score Distribution across Subscription Tiers",
                category_orders={"SubscriptionType": ["Basic", "Standard", "Premium"]},
                color_discrete_map={"Basic": "#64748b", "Standard": "#2563eb", "Premium": "#b45309"}
            )
            fig_box.update_layout(
                template="plotly_white",
                plot_bgcolor="#ffffff",
                paper_bgcolor="#ffffff",
                margin=dict(l=20, r=20, t=40, b=20),
                showlegend=False,
                font=dict(family="sans-serif", size=11, color="#334155")
            )
            st.plotly_chart(fig_box, use_container_width=True)

        # Row 3 - Heatmap
        st.markdown("#### 📐 Feature Correlation Matrix")
        corr_matrix = filtered_df[FEATURES].corr().round(2)
        fig_heat = px.imshow(
            corr_matrix,
            text_auto=True,
            aspect="auto",
            color_continuous_scale="RdBu_r",
            zmin=-1,
            zmax=1,
            title="Pearson Correlation Coefficients (Pairwise Feature Linear Dependencies)"
        )
        fig_heat.update_layout(
            template="plotly_white",
            plot_bgcolor="#ffffff",
            paper_bgcolor="#ffffff",
            margin=dict(l=20, r=20, t=40, b=20),
            font=dict(family="sans-serif", size=11, color="#334155")
        )
        st.plotly_chart(fig_heat, use_container_width=True)

        # Download Cohort Data
        st.markdown("#### 📥 Filtered Cohort Data Export")
        c_exp1, c_exp2 = st.columns([3, 1])
        c_exp1.caption(f"Currently viewing {len(filtered_df)} records with all 16 attributes including segment labels.")
        csv_data = filtered_df.to_csv(index=False).encode("utf-8")
        c_exp2.download_button(
            "Download Active Cohort CSV",
            data=csv_data,
            file_name="ott_active_cohort.csv",
            mime="text/csv",
            use_container_width=True
        )

# ------------------------------------------------------------------------------
# TAB 3: CLUSTER PERSONAS & 3D PCA
# ------------------------------------------------------------------------------
with tabs[2]:
    st.markdown("#### 👥 Unsupervised Persona Characterization & High-Dimensional Profiling")
    st.caption("Centroid behavioral benchmarks and Principal Component Projections.")

    # 4 Persona Cards
    p1, p2, p3, p4 = st.columns(4)
    with p1:
        st.markdown(f"""
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:4px solid {PALETTE['Action Movie Lovers']};border-radius:6px;padding:14px;">
            <div style="font-weight:700;color:#0f172a;font-size:1.05rem;">🎬 Action Movie Lovers</div>
            <div style="font-size:0.82rem;color:#64748b;margin:4px 0 10px 0;">Count: <strong>{(df['Segment'] == 'Action Movie Lovers').sum()}</strong> ({((df['Segment'] == 'Action Movie Lovers').mean()*100):.1f}%)</div>
            <ul style="font-size:0.83rem;color:#334155;padding-left:16px;line-height:1.6;margin:0;">
                <li><strong>Avg Watch Time</strong>: 21.3 hrs/wk</li>
                <li><strong>Format Preference</strong>: 29.3 Movies vs 7.6 Series</li>
                <li><strong>Demographic</strong>: Younger cohort (Avg 23.9 yrs)</li>
                <li><strong>Primary Devices</strong>: Smart TV & Mobile</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    with p2:
        st.markdown(f"""
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:4px solid {PALETTE['Family Viewers']};border-radius:6px;padding:14px;">
            <div style="font-weight:700;color:#0f172a;font-size:1.05rem;">👨‍👩‍👧‍👦 Family Viewers</div>
            <div style="font-size:0.82rem;color:#64748b;margin:4px 0 10px 0;">Count: <strong>{(df['Segment'] == 'Family Viewers').sum()}</strong> ({((df['Segment'] == 'Family Viewers').mean()*100):.1f}%)</div>
            <ul style="font-size:0.83rem;color:#334155;padding-left:16px;line-height:1.6;margin:0;">
                <li><strong>Avg Watch Time</strong>: 16.3 hrs/wk</li>
                <li><strong>Format Preference</strong>: 19.7 Series vs 11.6 Movies</li>
                <li><strong>Demographic</strong>: Mature household (Avg 39.2 yrs)</li>
                <li><strong>Primary Devices</strong>: Smart TV Dominant</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    with p3:
        st.markdown(f"""
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:4px solid {PALETTE['Premium Users']};border-radius:6px;padding:14px;">
            <div style="font-weight:700;color:#0f172a;font-size:1.05rem;">💎 Premium Users</div>
            <div style="font-size:0.82rem;color:#64748b;margin:4px 0 10px 0;">Count: <strong>{(df['Segment'] == 'Premium Users').sum()}</strong> ({((df['Segment'] == 'Premium Users').mean()*100):.1f}%)</div>
            <ul style="font-size:0.83rem;color:#334155;padding-left:16px;line-height:1.6;margin:0;">
                <li><strong>Avg Watch Time</strong>: 32.7 hrs/wk (Heavy)</li>
                <li><strong>Format Preference</strong>: Dual heavy (27.5 M / 25.1 S)</li>
                <li><strong>Engagement Score</strong>: 88.3 / 100 (Peak)</li>
                <li><strong>Monetization</strong>: 95% Premium Plan subscribers</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    with p4:
        st.markdown(f"""
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:4px solid {PALETTE['Casual Users']};border-radius:6px;padding:14px;">
            <div style="font-weight:700;color:#0f172a;font-size:1.05rem;">🛋️ Casual Users</div>
            <div style="font-size:0.82rem;color:#64748b;margin:4px 0 10px 0;">Count: <strong>{(df['Segment'] == 'Casual Users').sum()}</strong> ({((df['Segment'] == 'Casual Users').mean()*100):.1f}%)</div>
            <ul style="font-size:0.83rem;color:#334155;padding-left:16px;line-height:1.6;margin:0;">
                <li><strong>Avg Watch Time</strong>: 5.6 hrs/wk (Infrequent)</li>
                <li><strong>Format Preference</strong>: Low volume (3.6 M / 2.4 S)</li>
                <li><strong>Login Frequency</strong>: 2.1 days/wk</li>
                <li><strong>Risk Status</strong>: Severe churn hazard</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    st.write("")

    # Interactive PCA Projection (2D vs 3D)
    col_pca_ctrl, col_pca_plot = st.columns([1, 3])
    with col_pca_ctrl:
        st.markdown("""
        <div class="section-card">
            <div class="section-title">🧭 PCA Projection Control</div>
        """, unsafe_allow_html=True)
        pca_mode = st.radio("Dimensionality Projection", ["2D PCA Projection", "3D Interactive PCA Projection"])
        st.markdown("""
        <p style="font-size:0.83rem;color:#475569;line-height:1.5;">
            Principal Component Analysis (PCA) projects the 8-dimensional standardized space onto orthogonal eigenvectors capturing maximum variance.
        </p>
        """, unsafe_allow_html=True)
        st.markdown(f"""
        **Variance Explained**:
        - **PC1**: `{evr_2d[0]*100:.1f}%`
        - **PC2**: `{evr_2d[1]*100:.1f}%`
        - **PC3**: `{evr_3d[2]*100:.1f}%`  
        **Cumulative (3D)**: `{(sum(evr_3d))*100:.1f}%`
        """)
        st.markdown("</div>", unsafe_allow_html=True)

    with col_pca_plot:
        if pca_mode == "2D PCA Projection":
            fig_pca2d = px.scatter(
                df,
                x="PC1",
                y="PC2",
                color="Segment",
                color_discrete_map=PALETTE,
                hover_name="UserID",
                hover_data=["WatchTime", "EngagementScore", "SubscriptionType", "FavoriteGenre"],
                title=f"2D Principal Component Space (Explained Variance: {(evr_2d[0]+evr_2d[1])*100:.1f}%)",
                labels={"PC1": f"Principal Component 1 ({evr_2d[0]*100:.1f}%)", "PC2": f"Principal Component 2 ({evr_2d[1]*100:.1f}%)"}
            )
            fig_pca2d.update_layout(
                template="plotly_white",
                plot_bgcolor="#ffffff",
                paper_bgcolor="#ffffff",
                margin=dict(l=20, r=20, t=40, b=20),
                height=480,
                font=dict(family="sans-serif", size=11, color="#334155")
            )
            st.plotly_chart(fig_pca2d, use_container_width=True)
        else:
            fig_pca3d = px.scatter_3d(
                df,
                x="PC1",
                y="PC2",
                z="PC3",
                color="Segment",
                color_discrete_map=PALETTE,
                hover_name="UserID",
                hover_data=["WatchTime", "EngagementScore", "SubscriptionType"],
                title="3D Principal Component Space (Rotate & Zoom to Inspect Manifold Boundaries)",
                labels={
                    "PC1": f"PC1 ({evr_3d[0]*100:.1f}%)",
                    "PC2": f"PC2 ({evr_3d[1]*100:.1f}%)",
                    "PC3": f"PC3 ({evr_3d[2]*100:.1f}%)"
                }
            )
            fig_pca3d.update_layout(
                margin=dict(l=0, r=0, t=30, b=0),
                height=520,
                scene=dict(
                    xaxis=dict(backgroundcolor="#f8fafc"),
                    yaxis=dict(backgroundcolor="#f8fafc"),
                    zaxis=dict(backgroundcolor="#f8fafc")
                )
            )
            st.plotly_chart(fig_pca3d, use_container_width=True)

    # Radar Chart - Normalized Centroids
    st.markdown("#### 🕸️ Multidimensional Centroid Radar Benchmark")
    st.caption("Standardized feature profiles illustrating clear geometric separation between all four clusters.")

    # Compute normalized means between 0 and 1 for radar plot
    radar_features = ["Age", "WatchTime", "MoviesWatched", "SeriesWatched", "LoginFrequency", "EngagementScore", "SubCode"]
    norm_df = df[radar_features].copy()
    norm_df = (norm_df - norm_df.min()) / (norm_df.max() - norm_df.min())
    norm_df["Segment"] = df["Segment"]
    radar_means = norm_df.groupby("Segment").mean()

    fig_radar = go.Figure()
    for seg_name in all_segments:
        vals = radar_means.loc[seg_name].tolist()
        vals.append(vals[0]) # close loop
        feats_loop = radar_features + [radar_features[0]]
        fig_radar.add_trace(go.Scatterpolar(
            r=vals,
            theta=feats_loop,
            fill='toself',
            name=seg_name,
            line=dict(color=PALETTE[seg_name], width=2)
        ))

    fig_radar.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 1], tickfont=dict(size=9, color="#64748b")),
            angularaxis=dict(tickfont=dict(size=11, color="#1e293b"))
        ),
        showlegend=True,
        template="plotly_white",
        height=450,
        margin=dict(l=40, r=40, t=30, b=30)
    )
    st.plotly_chart(fig_radar, use_container_width=True)

# ------------------------------------------------------------------------------
# TAB 4: K-MEANS VS DBSCAN EVALUATION
# ------------------------------------------------------------------------------
with tabs[3]:
    st.markdown("#### ⚖️ Unsupervised Model Validation & Algorithmic Comparison")
    st.caption("Rigorous metric benchmarking of Partitioning (K-Means) against Density-Based Clustering (DBSCAN).")

    # Evaluation Metric Table
    st.markdown("""
    <div class="section-card">
        <div class="section-title">📊 Formal Cluster Validity Metrics</div>
    """, unsafe_allow_html=True)
    st.dataframe(cmp_df, use_container_width=True, hide_index=True)
    st.markdown("</div>", unsafe_allow_html=True)

    # Mathematical Explanations
    c_m1, c_m2, c_m3 = st.columns(3)
    with c_m1:
        st.markdown("""
        <div class="section-card" style="height:100%;">
            <div style="font-weight:700;color:#1e3a8a;margin-bottom:6px;">1. Silhouette Score (S)</div>
            <p style="font-size:0.83rem;color:#475569;margin-bottom:8px;">
                Measures cohesion within clusters versus separation from nearest neighbor clusters. Range: [-1, +1].
            </p>
        """, unsafe_allow_html=True)
        st.latex(r"S = \frac{b(i) - a(i)}{\max(a(i), b(i))}")
        st.caption("Higher is superior. K-Means (0.370) > DBSCAN (0.331).")
        st.markdown("</div>", unsafe_allow_html=True)
    with c_m2:
        st.markdown("""
        <div class="section-card" style="height:100%;">
            <div style="font-weight:700;color:#1e3a8a;margin-bottom:6px;">2. Davies-Bouldin Index (DB)</div>
            <p style="font-size:0.83rem;color:#475569;margin-bottom:8px;">
                Similarity measure comparing cluster diameter against pairwise cluster separation distance.
            </p>
        """, unsafe_allow_html=True)
        st.latex(r"DB = \frac{1}{k}\sum_{i=1}^k \max_{j\neq i} R_{ij}")
        st.caption("Lower is superior. DBSCAN (0.937) achieves tight cores but ignores 59 noise users.")
        st.markdown("</div>", unsafe_allow_html=True)
    with c_m3:
        st.markdown("""
        <div class="section-card" style="height:100%;">
            <div style="font-weight:700;color:#1e3a8a;margin-bottom:6px;">3. Calinski-Harabasz Index (CH)</div>
            <p style="font-size:0.83rem;color:#475569;margin-bottom:8px;">
                Variance Ratio Criterion: ratio of between-cluster dispersion to within-cluster dispersion.
            </p>
        """, unsafe_allow_html=True)
        st.latex(r"CH = \frac{\text{Tr}(B_k)}{\text{Tr}(W_k)} \times \frac{N - k}{k - 1}")
        st.caption("Higher is superior. K-Means (642.9) exhibits far stronger separation than DBSCAN (428.8).")
        st.markdown("</div>", unsafe_allow_html=True)

    # Elbow and Silhouette Plot
    st.write("")
    st.markdown("#### 📉 Elbow Method (Inertia) & Silhouette Optimization Curve")
    
    k_vals = results_json["k_values"]
    inertias = results_json["inertia"]
    silhouettes = results_json["silhouette"]

    fig_curves = make_subplots(
        rows=1, cols=2,
        subplot_titles=("Elbow Method (Within-Cluster Sum of Squares)", "Silhouette Score vs Number of Clusters (k)")
    )
    fig_curves.add_trace(
        go.Scatter(x=k_vals, y=inertias, mode='lines+markers', name="Inertia (WCSS)", line=dict(color="#1e3a8a", width=2.5)),
        row=1, col=1
    )
    # Add vertical line at k=4
    fig_curves.add_vline(x=4, line_width=1.5, line_dash="dash", line_color="#b45309", row=1, col=1)
    
    fig_curves.add_trace(
        go.Scatter(x=k_vals, y=silhouettes, mode='lines+markers', name="Silhouette Score", line=dict(color="#047857", width=2.5)),
        row=1, col=2
    )
    fig_curves.add_vline(x=4, line_width=1.5, line_dash="dash", line_color="#b45309", row=1, col=2)

    fig_curves.update_layout(
        template="plotly_white",
        plot_bgcolor="#ffffff",
        paper_bgcolor="#ffffff",
        height=380,
        margin=dict(l=20, r=20, t=40, b=20),
        font=dict(family="sans-serif", size=11, color="#334155"),
        showlegend=False
    )
    st.plotly_chart(fig_curves, use_container_width=True)

    # Interactive Sandbox for Viva Demonstration
    st.markdown("#### 🧪 Live Algorithmic Playground (Examiner Interactive Sandbox)")
    st.caption("Test how changing cluster counts or DBSCAN density thresholds affects cluster formation in real time.")
    
    sb_tab1, sb_tab2 = st.tabs(["K-Means Parameter Sandbox", "DBSCAN Sensitivity Sandbox"])
    with sb_tab1:
        custom_k = st.slider("Select k for live K-Means fit:", min_value=2, max_value=8, value=4, step=1)
        X_scaled = scaler.transform(df[FEATURES])
        live_km = KMeans(n_clusters=custom_k, n_init=10, random_state=42).fit(X_scaled)
        live_sil = silhouette_score(X_scaled, live_km.labels_)
        live_db = davies_bouldin_score(X_scaled, live_km.labels_)
        live_ch = calinski_harabasz_score(X_scaled, live_km.labels_)
        
        c_k1, c_k2, c_k3, c_k4 = st.columns(4)
        c_k1.metric("Tested k", custom_k)
        c_k2.metric("Silhouette Score", f"{live_sil:.3f}", delta=f"{live_sil - km_sil:.3f}")
        c_k3.metric("Davies-Bouldin Index", f"{live_db:.3f}")
        c_k4.metric("Calinski-Harabasz", f"{live_ch:.1f}")

    with sb_tab2:
        c_db_p1, c_db_p2 = st.columns(2)
        test_eps = c_db_p1.slider("Epsilon (ε radius):", min_value=0.5, max_value=3.0, value=1.4, step=0.1)
        test_minpts = c_db_p2.slider("MinPts (Minimum core samples):", min_value=3, max_value=25, value=15, step=1)
        
        live_dbscan = DBSCAN(eps=test_eps, min_samples=test_minpts).fit(X_scaled)
        db_labels = live_dbscan.labels_
        valid_mask = db_labels != -1
        n_clusters_db = len(set(db_labels[valid_mask]))
        n_noise_db = int((~valid_mask).sum())
        
        c_db1, c_db2, c_db3 = st.columns(3)
        c_db1.metric("Discovered Clusters", n_clusters_db)
        c_db2.metric("Noise Points Filtered", n_noise_db, delta=f"{n_noise_db/len(df)*100:.1f}% of users", delta_color="inverse")
        if n_clusters_db >= 2 and valid_mask.sum() > 50:
            db_sil_live = silhouette_score(X_scaled[valid_mask], db_labels[valid_mask])
            c_db3.metric("Core Silhouette", f"{db_sil_live:.3f}")
        else:
            c_db3.metric("Core Silhouette", "N/A (< 2 valid clusters)")

# ------------------------------------------------------------------------------
# TAB 5: TARGETED RECOMMENDATION ENGINE
# ------------------------------------------------------------------------------
with tabs[4]:
    st.markdown("#### 🎯 Business Strategy & Segment-Driven Recommendation Engine")
    st.caption("Automated content catalog curation and subscription retention policies mapped per user persona.")

    # Strategy Matrix
    for seg_name, rec in RECS.items():
        with st.expander(f"📁 Strategy Dossier: {seg_name} ({(df['Segment'] == seg_name).sum():,} Users)", expanded=(seg_name == "Action Movie Lovers")):
            c_rec1, c_rec2, c_rec3 = st.columns(3)
            with c_rec1:
                st.markdown(f"**🎥 Movie Catalog Focus**")
                st.info(rec["movies"])
            with c_rec2:
                st.markdown(f"**📺 Episodic Series Focus**")
                st.info(rec["series"])
            with c_rec3:
                st.markdown(f"**💳 Monetization & Plan Action**")
                st.success(rec["plan"])

    st.write("")
    st.markdown("#### 🔍 Individual User Telemetry & Recommendation Lookup")
    
    col_u_sel, col_u_rnd = st.columns([3, 1])
    user_list = df["UserID"].tolist()
    if "selected_user_id" not in st.session_state:
        st.session_state.selected_user_id = user_list[0]
    
    if col_u_rnd.button("🎲 Random User Sample", use_container_width=True):
        st.session_state.selected_user_id = np.random.choice(user_list)
        st.rerun()
    
    current_uid = col_u_sel.selectbox("Select UserID to inspect:", user_list, index=user_list.index(st.session_state.selected_user_id))
    u_row = df[df["UserID"] == current_uid].iloc[0]

    # User profile cards
    u_c1, u_c2, u_c3, u_c4 = st.columns(4)
    u_c1.metric("Assigned Segment", u_row["Segment"])
    u_c2.metric("Subscription Tier", u_row["SubscriptionType"])
    u_c3.metric("Weekly Watch Time", f"{u_row['WatchTime']:.1f} hrs")
    u_c4.metric("Engagement Score", f"{u_row['EngagementScore']:.1f} / 100")

    st.markdown(f"""
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:5px solid {PALETTE[u_row['Segment']]};border-radius:6px;padding:16px;margin:12px 0;">
        <div style="font-weight:700;color:#0f172a;font-size:1.05rem;margin-bottom:8px;">
            Targeted Recommendation Package for User {current_uid}
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;font-size:0.88rem;color:#334155;">
            <div><strong>🎬 Recommended Movies:</strong> {RECS[u_row['Segment']]['movies']}</div>
            <div><strong>📺 Recommended Series:</strong> {RECS[u_row['Segment']]['series']}</div>
            <div><strong>💳 Account Retention Strategy:</strong> {RECS[u_row['Segment']]['plan']}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Full table download
    st.markdown("#### 📋 Comprehensive Clustered User Directory")
    disp_cols = ["UserID", "Age", "Gender", "WatchTime", "MoviesWatched", "SeriesWatched", "FavoriteGenre", "SubscriptionType", "EngagementScore", "Segment"]
    st.dataframe(df[disp_cols].head(50), use_container_width=True, hide_index=True)
    st.caption("Displaying initial 50 records. Download full dataset below.")

# ------------------------------------------------------------------------------
# TAB 6: LIVE PERSONA CLASSIFIER & SIMULATOR
# ------------------------------------------------------------------------------
with tabs[5]:
    st.markdown("#### 🧪 Real-Time Persona Inference & What-If Behavioral Simulator")
    st.caption("Input arbitrary telemetry values to predict segment membership via standardized Euclidean distance to centroids.")

    sim_c1, sim_c2 = st.columns([1, 1])
    
    with sim_c1:
        st.markdown("""
        <div class="section-card">
            <div class="section-title">📝 Input Telemetry Features</div>
        """, unsafe_allow_html=True)
        
        in_col1, in_col2 = st.columns(2)
        sim_age = in_col1.number_input("Viewer Age", min_value=14, max_value=85, value=25, step=1)
        sim_watch = in_col1.number_input("Watch Time (hrs/week)", min_value=0.0, max_value=80.0, value=22.0, step=0.5)
        sim_movies = in_col1.number_input("Movies Watched / Month", min_value=0, max_value=80, value=28, step=1)
        sim_series = in_col1.number_input("Series Episodes / Month", min_value=0, max_value=80, value=8, step=1)
        
        sim_rating = in_col2.number_input("Average Rating Given", min_value=1.0, max_value=5.0, value=3.8, step=0.1)
        sim_login = in_col2.number_input("Logins per Week", min_value=0.5, max_value=14.0, value=6.0, step=0.5)
        sim_sub = in_col2.selectbox("Subscription Tier", ["Basic", "Standard", "Premium"], index=1)
        sim_eng = in_col2.slider("Engagement Score", min_value=1, max_value=100, value=65, step=1)
        
        sim_input_dict = {
            "Age": sim_age,
            "WatchTime": sim_watch,
            "MoviesWatched": sim_movies,
            "SeriesWatched": sim_series,
            "AvgRating": sim_rating,
            "LoginFrequency": sim_login,
            "EngagementScore": sim_eng,
            "SubCode": SUB_MAP[sim_sub]
        }
        st.markdown("</div>", unsafe_allow_html=True)

    with sim_c2:
        st.markdown("""
        <div class="section-card">
            <div class="section-title">🔮 Real-Time Classifier Output</div>
        """, unsafe_allow_html=True)
        
        pred_seg, dists, confs = predict_segment_with_scores(sim_input_dict)
        
        st.markdown(f"""
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:5px solid {PALETTE[pred_seg]};border-radius:6px;padding:16px;margin-bottom:14px;">
            <div style="font-size:0.8rem;text-transform:uppercase;font-weight:700;color:{PALETTE[pred_seg]};">Predicted Segment Assignment</div>
            <div style="font-size:1.5rem;font-weight:700;color:#0f172a;margin:2px 0;">{pred_seg}</div>
            <div style="font-size:0.86rem;color:#475569;">Affinity Probability: <strong>{confs[pred_seg]:.1f}%</strong> (Euclidean distance: {dists[pred_seg]:.2f})</div>
        </div>
        """, unsafe_allow_html=True)

        # Affinity probability breakdown chart
        fig_conf = px.bar(
            x=list(confs.values()),
            y=list(confs.keys()),
            orientation="h",
            labels={"x": "Affinity Confidence (%)", "y": "Segment"},
            color=list(confs.keys()),
            color_discrete_map=PALETTE,
            title="Cluster Proximity / Membership Probability"
        )
        fig_conf.update_layout(
            template="plotly_white",
            plot_bgcolor="#ffffff",
            paper_bgcolor="#ffffff",
            margin=dict(l=20, r=20, t=35, b=20),
            height=200,
            showlegend=False,
            font=dict(family="sans-serif", size=10, color="#334155")
        )
        st.plotly_chart(fig_conf, use_container_width=True)

        # Tailored Action Card
        st.markdown(f"""
        <div style="font-size:0.86rem;color:#334155;line-height:1.6;">
            <strong>🎬 Movie Package</strong>: {RECS[pred_seg]['movies']}<br>
            <strong>📺 Series Package</strong>: {RECS[pred_seg]['series']}<br>
            <strong>💳 Monetization Strategy</strong>: {RECS[pred_seg]['plan']}
        </div>
        """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    # Feature Deviation vs Segment Centroid
    st.markdown("#### 📊 Input Deviation from Assigned Segment Benchmark")
    seg_means = df[df["Segment"] == pred_seg][FEATURES].mean()
    dev_data = []
    for f in FEATURES:
        inp_v = sim_input_dict[f]
        bench_v = seg_means[f]
        pct_diff = ((inp_v - bench_v) / (bench_v + 1e-5)) * 100
        dev_data.append({"Feature": f, "Input Value": inp_v, "Segment Average": round(bench_v, 2), "Deviation (%)": round(pct_diff, 1)})
    
    st.dataframe(pd.DataFrame(dev_data), use_container_width=True, hide_index=True)

# ------------------------------------------------------------------------------
# TAB 7: ACADEMIC DEFENSE & VIVA Q&A
# ------------------------------------------------------------------------------
with tabs[6]:
    st.markdown("#### 🎓 College Mini-Project Defense & Viva Voce Guide")
    st.caption("Prepared for Semester VI Data Science & Machine Learning Practical Viva.")

    vivas = [
        {
            "q": "Q1: Why is feature standardization (Z-score scaling) mandatory before applying K-Means?",
            "a": "K-Means relies on Euclidean distance: d(x, c) = sqrt(sum((x_i - c_i)^2)). If features exist on disparate numerical scales—such as EngagementScore (1 to 100) versus LoginFrequency (1 to 7)—the feature with the larger variance will completely dominate the distance metric, rendering the smaller features statistically irrelevant. StandardScaler enforces zero mean and unit variance across all dimensions."
        },
        {
            "q": "Q2: Why did K-Means outperform DBSCAN on this dataset?",
            "a": "DBSCAN looks for density-connected components separated by lower-density areas. In customer behavioral telemetry, user distributions typically follow continuous Gaussian-like distributions rather than isolated arbitrary islands. DBSCAN flagged 59 users as outliers/noise and merged the remaining dense regions into only 2 mega-clusters (Silhouette: 0.331). K-Means partitioning (k=4) cleanly segmented all 1,000 users into 4 actionable, mutually exclusive business cohorts with higher silhouette cohesion (0.370)."
        },
        {
            "q": "Q3: How was optimal k determined in K-Means?",
            "a": "Using a dual-criteria heuristic: (1) The Elbow Method: tracking the inflection point where within-cluster sum of squares (Inertia) reduction drops sharply (from k=3 to k=4), and (2) Silhouette Coefficient optimization: testing k from 2 to 8 revealed a distinct global peak at k=4 (0.370) compared to k=3 (0.317) and k=5 (0.322)."
        },
        {
            "q": "Q4: How does the recommendation system bridge unsupervised clustering with business decisions?",
            "a": "Clustering discovers latent personas without ground truth labels. We then profile each cluster centroid along key business drivers: ratio of movies to series, watch hours, and subscription tier. Once the behavioral archetype is characterized (e.g. 'Action Movie Lovers' vs 'Casual Users'), rule-based heuristic engines map content catalog tags and retention workflows to each specific persona."
        },
        {
            "q": "Q5: How would this pipeline be deployed in an enterprise production environment?",
            "a": "In production, model retraining would run on a weekly/monthly batch schedule (e.g. via Apache Airflow on AWS/GCP). The fitted StandardScaler and cluster centroids would be serialized. Incoming real-time streaming telemetry would pass through a low-latency microservice (FastAPI) that executes vector distance calculations in <5 milliseconds to assign new users to personas dynamically."
        }
    ]

    for item in vivas:
        with st.expander(f"📌 {item['q']}", expanded=False):
            st.markdown(f"<div style='font-size:0.9rem;color:#1e293b;line-height:1.6;'>{item['a']}</div>", unsafe_allow_html=True)

    st.write("")
    st.markdown("#### 📦 Project Artifacts & Comprehensive Offline Reports")
    d1, d2, d3 = st.columns(3)
    
    with d1:
        if os.path.exists("report.html"):
            with open("report.html", "rb") as f_rep:
                st.download_button(
                    "📄 Download Offline Technical Report (HTML)",
                    data=f_rep.read(),
                    file_name="OTT_Segmentation_MiniProject_Report.html",
                    mime="text/html",
                    use_container_width=True
                )
    with d2:
        if os.path.exists("outputs/clustered_users.csv"):
            with open("outputs/clustered_users.csv", "rb") as f_csv:
                st.download_button(
                    "📊 Download Labeled Clustered Dataset (CSV)",
                    data=f_csv.read(),
                    file_name="clustered_users.csv",
                    mime="text/csv",
                    use_container_width=True
                )
    with d3:
        if os.path.exists("outputs/results.json"):
            with open("outputs/results.json", "rb") as f_json:
                st.download_button(
                    "📋 Download Model Metrics Summary (JSON)",
                    data=f_json.read(),
                    file_name="results.json",
                    mime="application/json",
                    use_container_width=True
                )

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align:center;font-size:0.8rem;color:#64748b;padding-bottom:1rem;">
    OTT User Behavioral Segmentation and Recommendation Analysis System • B.Tech Computer Science & Engineering (DSML Mini-Project)
</div>
""", unsafe_allow_html=True)
