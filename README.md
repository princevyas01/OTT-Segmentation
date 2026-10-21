# OTT User Behavioral Segmentation & Intelligent Recommendation Analysis System
**Department of Computer Science & Engineering | Data Science & Machine Learning (DSML) Mini-Project**  
*3rd Year Engineering Practical Implementation*

---

## 📌 Executive Summary

Modern Over-The-Top (OTT) platforms (e.g., Netflix, Amazon Prime Video, Disney+ Hotstar) encounter acute subscriber churn, catalog discovery fatigue, and monetization inefficiencies caused by uniform subscription tiers. This project implements an **unsupervised machine learning pipeline** that extracts latent behavioral personas from multi-dimensional viewing telemetry, rigorously evaluates clustering validity using formal academic metrics, benchmarks **Partitional Clustering (K-Means)** against **Density-Based Spatial Clustering (DBSCAN)**, and provides tailored content curation and subscription retention policies.

---

## 🖥️ Modern React Frontend Dashboard

The frontend is built using **React 19 + Vite + Recharts + Lucide Icons**, engineered specifically for academic presentations:
- **Clean Academic Styling**: Muted Oxford cobalt, forest sage, warm ochre, and slate neutral palette. **Zero neon, zero glowing borders, zero "vibe-coded" tropes**.
- **Interactive Recharts Visualizations**: Dynamic watch time histogram, genre preferences by subscription tier, bivariate scatter plots, and Pearson correlation matrices.
- **Multidimensional Centroid Radar Benchmark**: Normalized [0–100] spider chart illustrating high-dimensional separation across all 4 segments.
- **2D & 3D PCA Projections**: Visualizing dimensionality reduction and cluster convexity ($PC_1: 56.6\%, PC_2: 16.5\%, PC_3: 14.1\%$).
- **Live Examiner Sandbox**: Real-time interactive sliders allowing professors to test variations in $k$ or DBSCAN $\varepsilon$ and $MinPts$.
- **Zero-Latency Client-Side Inference Engine**: Instant standardized Z-score transformation ($z = \frac{x - \mu}{\sigma}$) and Euclidean centroid distance calculation for real-time persona prediction.
- **Viva Voce Defense Guide**: 5 curated examination questions and answers for Semester VI practical evaluations.

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

## 🚀 Execution Guide

### 1. Launch the React Web Application (Recommended)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 2. Optional: Run FastAPI Python REST Backend
```bash
python server.py
```
Starts API server on **`http://127.0.0.1:8001`** (Swagger docs available at `http://127.0.0.1:8001/docs`).

### 3. Re-run Machine Learning Pipeline
```bash
python generate_data.py   # Generates raw dataset data/ott_users.csv (N=1,010)
python main.py            # Executes cleaning, scaling, K-Means, DBSCAN, and exports metrics
python build_report.py    # Compiles standalone offline HTML report (report.html)
```

---

## 📂 Repository Structure

```
├── frontend/                     # React 19 + Vite Application
│   ├── src/
│   │   ├── components/           # Academic Tabbed Components
│   │   │   ├── Header.jsx        # Institution branding & KPI cards
│   │   │   ├── OverviewTab.jsx   # Abstract, pipeline flowchart & audit
│   │   │   ├── EdaTab.jsx        # Recharts distributions, filters & CSV
│   │   │   ├── SegmentsTab.jsx   # Persona dossiers, radar & PCA plots
│   │   │   ├── ModelCompareTab.jsx# Mathematical metrics & live sandbox
│   │   │   ├── RecommendationsTab.jsx# Strategy matrix & user lookup
│   │   │   ├── ClassifierTab.jsx # Real-time what-if simulator
│   │   │   └── VivaTab.jsx       # Viva defense Q&A & downloads
│   │   ├── data/                 # Exported ML datasets & parameters
│   │   │   ├── scalerParams.json # Mean, scale, and centroid weights
│   │   │   ├── users.json        # 1,000 processed user records
│   │   │   ├── results.json      # Evaluation metrics & sweep data
│   │   │   ├── modelComparison.json# Benchmark comparison metrics
│   │   │   └── recommendations.json# Segment-to-action dictionary
│   │   ├── utils/
│   │   │   └── mlEngine.js       # Client-side Z-score & Euclidean inference
│   │   ├── App.jsx               # Navigation router
│   │   └── index.css             # Neutral academic CSS design system
│   ├── package.json
│   └── vite.config.js
├── data/
│   └── ott_users.csv             # Raw viewer telemetry dataset
├── outputs/
│   ├── clustered_users.csv       # Labeled dataset with cluster assignments
│   ├── model_comparison.csv      # K-Means vs DBSCAN formal metrics
│   ├── recommendations.csv       # Persona-to-recommendation mapping
│   ├── results.json              # Full pipeline evaluation audit
│   └── *.png                     # Static visualization figures
├── server.py                     # Optional FastAPI REST Backend
├── app.py                        # Streamlit Python dashboard (alternative)
├── build_report.py               # Standalone HTML report generator
├── clustering.py                 # K-Means & DBSCAN clustering implementations
├── eda.py                        # Exploratory data analysis routines
├── evaluation.py                 # Silhouette, Davies-Bouldin, Calinski-Harabasz
├── generate_data.py              # Telemetry generator with noise injection
├── main.py                       # Central ML pipeline orchestrator
├── preprocessing.py              # Imputation, encoding, and Z-score scaling
├── recommendation.py             # Centroid characterization and business mapping
├── visualization.py              # PCA and profile plotting helpers
├── requirements.txt              # Python package dependencies
└── README.md                     # Comprehensive academic project documentation
```
