"""
server.py - FastAPI Backend API for OTT User Segmentation & Recommendation
Allows demonstration of full-stack React + Python / FastAPI architecture.
Run with: python server.py
"""

import json
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.preprocessing import StandardScaler

app = FastAPI(
    title="OTT User Segmentation & Recommendation API",
    description="REST API for real-time viewer behavioral inference and persona classification",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default: http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data and fit scaler on startup
OUT = "outputs"
FEATURES = ["Age", "WatchTime", "MoviesWatched", "SeriesWatched", "AvgRating", "LoginFrequency", "EngagementScore", "SubCode"]
SUB_MAP = {"Basic": 0, "Standard": 1, "Premium": 2}

try:
    df = pd.read_csv(f"{OUT}/clustered_users.csv")
    cmp_df = pd.read_csv(f"{OUT}/model_comparison.csv")
    recs_df = pd.read_csv(f"{OUT}/recommendations.csv")
    with open(f"{OUT}/results.json") as f:
        results_json = json.load(f)
        
    scaler = StandardScaler().fit(df[FEATURES])
    centroids = pd.DataFrame(scaler.transform(df[FEATURES]), columns=FEATURES).groupby(df["Segment"].values).mean()
except Exception as e:
    print(f"Warning: Failed to load pipeline outputs: {e}")
    df, cmp_df, recs_df, results_json = None, None, None, {}
    scaler, centroids = None, None

class UserPredictionInput(BaseModel):
    Age: float = 25.0
    WatchTime: float = 22.0
    MoviesWatched: int = 28
    SeriesWatched: int = 8
    AvgRating: float = 3.8
    LoginFrequency: float = 6.0
    EngagementScore: float = 65.0
    SubCode: int = 1

@app.get("/api/health")
def health():
    return {"status": "healthy", "model": "K-Means (k=4)", "total_users": len(df) if df is not None else 0}

@app.get("/api/users")
def get_users(limit: int = 50):
    if df is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded")
    return df.head(limit).to_dict(orient="records")

@app.get("/api/model-comparison")
def get_model_comparison():
    if cmp_df is None:
        raise HTTPException(status_code=500, detail="Model comparison not loaded")
    return cmp_df.to_dict(orient="records")

@app.get("/api/recommendations")
def get_recommendations():
    if recs_df is None:
        raise HTTPException(status_code=500, detail="Recommendations not loaded")
    return recs_df.to_dict(orient="records")

@app.post("/api/predict")
def predict_user_segment(payload: UserPredictionInput):
    if scaler is None or centroids is None:
        raise HTTPException(status_code=500, detail="Model artifacts not available")
    
    input_data = pd.DataFrame([payload.model_dump()])[FEATURES]
    z_vector = scaler.transform(input_data)[0]
    
    distances = {}
    for seg, centroid_vec in centroids.iterrows():
        d = float(np.linalg.norm(centroid_vec.values - z_vector))
        distances[seg] = round(d, 3)
    
    best_seg = min(distances, key=distances.get)
    
    # Calculate inverse distance affinities
    inv_d = {k: 1.0 / (v + 1e-4) for k, v in distances.items()}
    total_inv = sum(inv_d.values())
    affinities = {k: round((v / total_inv) * 100, 1) for k, v in inv_d.items()}
    
    # Get recommendation
    rec_row = recs_df[recs_df["Cluster"] == best_seg].iloc[0] if recs_df is not None else {}
    
    return {
        "predicted_segment": best_seg,
        "euclidean_distance": distances[best_seg],
        "all_distances": distances,
        "affinity_probabilities": affinities,
        "recommendations": {
            "movies": rec_row.get("Recommended Movies", "Curated catalog selection."),
            "series": rec_row.get("Recommended Series", "Trending episodic series."),
            "subscription_plan": rec_row.get("Subscription Action", "Optimized retention intervention.")
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
