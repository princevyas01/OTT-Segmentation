# OTT User Behavioral Segmentation & Intelligent Recommendation Analysis System
**Department of Computer Science & Engineering | Data Science & Machine Learning (DSML) Mini-Project**  
*3rd Year Engineering Practical Implementation*

---

## 📌 Executive Summary

Modern Over-The-Top (OTT) platforms (e.g., Netflix, Amazon Prime Video, Disney+ Hotstar) encounter acute subscriber churn, catalog discovery fatigue, and monetization inefficiencies caused by uniform subscription tiers. This project implements an **unsupervised machine learning pipeline** that extracts latent behavioral personas from multi-dimensional viewing telemetry, rigorously evaluates clustering validity using formal academic metrics, benchmarks **Partitional Clustering (K-Means)** against **Density-Based Spatial Clustering (DBSCAN)**, and provides tailored content curation and subscription retention policies.

---

## 🏗️ System Architecture & Workflow

```
[Raw Ingestion (1,010 Records)]
              │
              ▼
[Data Cleaning & Preprocessing]
  • Deduplication (10 duplicate records removed)
  • Missing Value Imputation (Median for numerical, Mode for categorical)
  • Ordinal Encoding (Subscription: Basic=0, Standard=1, Premium=2)
              │
              ▼
[Standard Normalization (Z-Score Scaling)]
  • Zero Mean, Unit Variance across all 8 feature dimensions
              │
              ▼
[Exploratory Data Analysis (EDA)]
  • Bivariate Distributions, Genre vs Tier, Movies vs Series, Correlation Matrix
              │
              ▼
[Unsupervised Clustering Benchmarking]
  ├── K-Means (k = 2 to 8 evaluated via Elbow WCSS & Silhouette Optimization)
  └── DBSCAN (Grid search over Epsilon ε: 0.8–3.0 and MinPts: 5, 10, 15)
              │
              ▼
[Formal Mathematical Validation]
  • Silhouette Coefficient (S)
  • Davies-Bouldin Index (DB)
  • Calinski-Harabasz Index (CH)
              │
              ▼
[Dimensionality Reduction & Profiling]
  • 2D & 3D Principal Component Analysis (PCA)
  • Centroid Radar Benchmarking & Persona Labeling
              │
              ▼
[Inference & Recommendation Engine]
  • Segment Content Mapping (Curated Movies & Episodic Series)
  • Retention & Monetization Action (Upselling, Family Plans, Churn Interventions)
  • Live User Simulation & Real-time Affinity Scoring
```

---

## 📊 Behavioral Feature Space (8 Dimensions)

| Dimension | Variable Type | Measurement Scale | Domain Significance |
| :--- | :--- | :--- | :--- |
| **`Age`** | Continuous | Years (14 – 78) | Life-stage and demographic alignment |
| **`WatchTime`** | Continuous | Hours / Week | Total consumption volume & engagement depth |
| **`MoviesWatched`** | Discrete | Count / Month | Preference for standalone, feature-length storytelling |
| **`SeriesWatched`** | Discrete | Episodes / Month | Binge-watching cadence and narrative retention hook |
| **`AvgRating`** | Continuous | Rating (1.0 – 5.0) | Viewer discernment and content satisfaction level |
| **`LoginFrequency`** | Continuous | Days / Week | Habitual return cadence; inversely correlated with churn |
| **`EngagementScore`**| Continuous | Index (1 – 100) | Platform vitality combining UI interactions & completion |
| **`SubCode`** | Ordinal | 0 (Basic), 1 (Std), 2 (Prem) | Monetization baseline and ARPU indicator |

---

## 👥 Discovered Behavioral Personas

Through K-Means clustering ($k=4$), four organic, mutually exclusive viewer archetypes emerge:

1. **🎬 Action Movie Lovers (27.9% of cohort)**:
   - *Profile*: Heavy movie consumers (avg 29.3 movies vs 7.6 series episodes), 21.3 hrs/week watch time, younger demographic (avg 23.9 yrs).
   - *Strategy*: Action, Thriller, and Sci-Fi franchises; Premium 4K trial upsell.

2. **👨‍👩‍👧‍👦 Family Viewers (26.5% of cohort)**:
   - *Profile*: Episodic series preference (avg 19.7 series vs 11.6 movies), moderate watch time (16.3 hrs/wk), mature demographic (avg 39.2 yrs), Smart TV dominant.
   - *Strategy*: Family dramas, animation, kids programming; Standard Family multi-profile plan with parental controls.

3. **💎 Premium Power Users (20.7% of cohort)**:
   - *Profile*: Highest watch volume (32.7 hrs/wk), dual high bingeing (27.5 movies, 25.1 series), peak engagement (88.3/100), 95% Premium tier subscribers.
   - *Strategy*: Exclusive platform Originals, early access releases; VIP annual retention rewards.

4. **🛋️ Casual Users (24.9% of cohort)**:
   - *Profile*: Infrequent viewing (5.6 hrs/wk), low login cadence (2.1 days/wk), Basic plan dominance. Severe churn hazard.
   - *Strategy*: Snackable comedy, mobile-optimized episodes, ad-supported tier discount.

---

## ⚖️ Model Benchmarking: K-Means vs DBSCAN

| Evaluation Metric | K-Means ($k=4$) | DBSCAN ($\varepsilon=1.4, MinPts=15$) | Theoretical Preference |
| :--- | :---: | :---: | :--- |
| **Cluster Count** | **4** | 2 | Actionable persona separation |
| **Unclassified Noise** | **0 users (0%)** | 59 users (5.9%) | Every customer requires assignment |
| **Silhouette Score ($S$)** | **0.370** | 0.331 | Higher is superior ([-1, +1]) |
| **Davies-Bouldin ($DB$)** | 1.095 | **0.937** | Lower is superior |
| **Calinski-Harabasz ($CH$)** | **642.9** | 428.8 | Higher is superior |

### Why K-Means is Superior for this Domain:
Customer behavioral telemetry forms continuous Gaussian-like distributions rather than isolated arbitrary-density shapes. DBSCAN flags 59 valuable customers as noise and merges distinct customer behaviors into only 2 mega-clusters. In contrast, K-Means partitions 100% of the audience into four commercially viable, mutually exclusive cohorts with superior cohesion ($S=0.370$, $CH=642.9$).

---

## 🖥️ Enhanced Frontend Dashboard (Streamlit & Plotly)

Designed following clean, dignified academic guidelines (no neon, no vibrant hype colors, crisp neutral slate palette):

- **Tab 1: Executive Brief & ML Pipeline**: Research abstract, pipeline architecture, and data preprocessing audit.
- **Tab 2: Exploratory Data Analysis (EDA)**: Interactive Plotly distributions, bivariate scatter, violin plots, and correlation matrix.
- **Tab 3: Segment Profiles & 3D PCA**: 4 persona dossiers, normalized centroid radar chart, and **interactive 2D / 3D PCA rotatable projection**.
- **Tab 4: Model Comparison & Validation**: Mathematical formulas ($S, DB, CH$), Elbow & Silhouette curves, and **live parameter sandbox**.
- **Tab 5: Targeted Recommendation Engine**: Segment strategy dossiers, individual user lookup with telemetry cards, and CSV export.
- **Tab 6: Live Persona Classifier & Simulator**: Real-time user input simulator computing standardized Euclidean centroid distances and affinity probabilities.
- **Tab 7: Academic Defense & Viva Q&A**: 5 comprehensive viva questions with rigorous academic answers, plus report download buttons.

---

## 🚀 Execution Guide

### 1. Environment Setup
```bash
pip install -r requirements.txt
```

### 2. Run Data Generation & Machine Learning Pipeline
```bash
python generate_data.py   # Generates raw dataset data/ott_users.csv (N=1,010)
python main.py            # Executes cleaning, scaling, K-Means, DBSCAN, and exports metrics
python build_report.py    # Compiles standalone offline HTML report (report.html)
```

### 3. Launch Interactive Academic Web Application
```bash
streamlit run app.py
```
Open **`http://localhost:8501`** in your browser.

---

## 📂 Repository Structure

```
├── .streamlit/
│   └── config.toml         # Professional academic theme configuration
├── data/
│   └── ott_users.csv       # Raw synthetic viewer telemetry dataset
├── outputs/
│   ├── clustered_users.csv # Final dataset with cluster assignments
│   ├── model_comparison.csv# K-Means vs DBSCAN formal metrics
│   ├── recommendations.csv # Segment-to-recommendation mapping
│   ├── results.json        # Full pipeline evaluation audit
│   └── *.png               # Generated static visual figures
├── app.py                  # Streamlit & Plotly interactive web application
├── build_report.py         # Automated HTML report generator
├── clustering.py           # K-Means & DBSCAN clustering implementations
├── eda.py                  # Exploratory data analysis routines
├── evaluation.py           # Silhouette, Davies-Bouldin, Calinski-Harabasz metrics
├── generate_data.py        # Telemetry generator with intentional real-world noise
├── main.py                 # Central execution pipeline orchestrator
├── preprocessing.py        # Imputation, encoding, and Z-score scaling
├── recommendation.py       # Centroid characterization and business mapping
├── visualization.py        # PCA and profile plotting helpers
├── requirements.txt        # Python package dependencies
└── README.md               # Comprehensive project documentation
```
