# OTT User Segmentation and Recommendation Analysis System (DSML Mini Project)

Segments OTT users with **K-Means** and **DBSCAN** from viewing behaviour and recommends content and subscription plans per segment.

## Run
```
pip install -r requirements.txt
python generate_data.py     # creates data/ott_users.csv (synthetic; replace with a real CSV if you have one)
python main.py              # runs the whole pipeline, saves charts and CSVs in outputs/
python build_report.py      # builds report.html (all charts + results in one page)
```

## Files
| File | Purpose |
|---|---|
| generate_data.py | Creates the OTT dataset (with missing values and duplicates) |
| preprocessing.py | Duplicates, missing values, encoding, scaling |
| eda.py | Histograms, bar charts, box plot, scatter, correlation heatmap |
| clustering.py | K-Means (elbow, silhouette) and DBSCAN (eps search) |
| evaluation.py | Silhouette, Davies-Bouldin, Calinski-Harabasz |
| recommendation.py | Names segments and gives rule-based recommendations |
| visualization.py | PCA cluster plots, profile heatmap, segment summary |
| main.py | Runs everything |

## Workflow
Dataset -> Preprocessing -> EDA -> Feature selection -> Scaling -> K-Means -> DBSCAN -> Evaluation -> Segmentation -> Recommendation -> Visualization

## Result
K-Means with k = 4 (best silhouette, 0.382) gave Action Movie Lovers, Family Viewers, Premium Users and Casual Users. DBSCAN found 2 clusters and 65 noise points, so K-Means suits this data better.

## Front end (Streamlit)
```
pip install -r requirements.txt
streamlit run app.py
```
Opens a dashboard at http://localhost:8501 with filters, charts, segments, K-Means vs DBSCAN, recommendations and a "try a new user" form.
