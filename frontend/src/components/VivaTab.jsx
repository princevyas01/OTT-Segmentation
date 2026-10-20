import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Download, Code, Layers, ShieldCheck } from 'lucide-react';
import { usersData, modelComparisonData, resultsData } from '../utils/mlEngine';

export default function VivaTab() {
  const [openIdx, setOpenIdx] = useState(0);

  const vivaQuestions = [
    {
      q: 'Q1: Why is feature standardization (Z-score scaling) mandatory before executing K-Means?',
      a: 'K-Means clustering relies on Euclidean distance: d(x, c) = sqrt(sum((x_i - c_i)^2)). When feature dimensions possess vastly disparate numerical intervals—such as EngagementScore (ranging from 1 to 100) compared to LoginFrequency (ranging from 0.5 to 7.0)—the feature with the larger variance dominates the Euclidean distance function. StandardScaler normalizes each feature to have a mean of 0 and standard deviation of 1 (z = (x - mu) / sigma), giving each behavioral attribute equal mathematical weight during centroid updates.'
    },
    {
      q: 'Q2: Why did K-Means outperform DBSCAN on this OTT dataset?',
      a: 'DBSCAN assumes clusters are dense regions separated by areas of lower density. Human viewing telemetry naturally follows a continuous multi-modal distribution without stark empty voids. As a result, DBSCAN flagged 59 valid paying users (5.9% of the cohort) as noise/outliers and merged distinct behavioral modes into only 2 mega-clusters (Silhouette: 0.331). In customer analytics, every active subscriber must be assigned a segment for CRM. K-Means (k=4) cleanly partitions 100% of users into 4 distinct, actionable cohorts with superior silhouette cohesion (0.370) and higher Calinski-Harabasz separation (642.9 vs 428.8).'
    },
    {
      q: 'Q3: How was optimal k determined in K-Means?',
      a: 'We implemented a two-stage validation strategy: (1) The Elbow Method: tracking the Within-Cluster Sum of Squares (Inertia) across k in [2, 8]. The curve demonstrates a sharp rate-of-decay inflection point at k=4. (2) Silhouette Optimization: calculating the silhouette width across k in [2, 8]. The coefficient peaks globally at k=4 (0.370) before dropping monotonically at k=5 (0.322) and k=6 (0.265).'
    },
    {
      q: 'Q4: How does the recommendation system bridge unsupervised clustering with business actions?',
      a: 'Clustering discovers latent personas without ground truth target labels. Once clusters are computed, we profile the centroid means along business-critical KPIs: Movie-to-Series ratio, watch hours per week, and subscription tier. Once the persona is characterized (e.g., Action Movie Lovers vs Family Viewers), rule-based decision trees map curated catalog content and targeted monetization actions (e.g., 4K upsell trial for action fans, multi-screen parental controls for family accounts).'
    },
    {
      q: 'Q5: How would this architecture scale into enterprise production?',
      a: 'In a real-world streaming architecture (e.g., Netflix, Hotstar), heavy model retraining runs as a weekly or monthly batch pipeline (via Apache Spark or Airflow on AWS/GCP). The fitted StandardScaler and cluster centroids are exported into serialized weight vectors. A lightweight inference microservice (such as FastAPI or Go) evaluates incoming real-time viewer events and assigns users to personas in sub-millisecond latency via dot-product distance calculation.'
    }
  ];

  const handleDownloadReport = () => {
    window.open('/report.html', '_blank');
  };

  const handleDownloadClusteredCSV = () => {
    const headers = Object.keys(usersData[0]).join(',');
    const rows = usersData.map(u => Object.values(u).join(',')).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clustered_users.csv';
    a.click();
  };

  const handleDownloadResultsJSON = () => {
    const blob = new Blob([JSON.stringify(resultsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.json';
    a.click();
  };

  return (
    <div>
      {/* Viva Accordion */}
      <div className="card">
        <div className="card-title">
          <HelpCircle size={18} style={{ color: '#1e40af' }} />
          College Mini-Project Defense & Viva Voce Guide
        </div>
        <p style={{ fontSize: '0.86rem', color: '#475569', marginBottom: '16px' }}>
          Key theoretical questions, mathematical principles, and architectural justifications for Semester VI DSML evaluations.
        </p>

        <div>
          {vivaQuestions.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="viva-item">
                <div
                  className="viva-question"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {isOpen && (
                  <div className="viva-answer">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Artifacts Download Center */}
      <div className="card">
        <div className="card-title">
          <Download size={18} style={{ color: '#1e40af' }} />
          Project Artifacts & Offline Technical Deliverables
        </div>
        <div className="grid-3">
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '6px' }}>
              Offline Technical Report (HTML)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
              Standalone single-file technical report embedding all EDA figures, cluster heatmaps, and tables.
            </p>
            <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.82rem' }} onClick={handleDownloadReport}>
              <Download size={14} />
              Open report.html
            </button>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '6px' }}>
              Labeled Audience Dataset (CSV)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
              1,000 processed user records with behavioral telemetry and assigned KMeans/DBSCAN cluster IDs.
            </p>
            <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.82rem' }} onClick={handleDownloadClusteredCSV}>
              <Download size={14} />
              Download clustered_users.csv
            </button>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '6px' }}>
              Model Evaluation Audit (JSON)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
              Machine-readable audit trail containing cleaning stats, inertias, silhouette sweeps, and centroids.
            </p>
            <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.82rem' }} onClick={handleDownloadResultsJSON}>
              <Download size={14} />
              Download results.json
            </button>
          </div>
        </div>
      </div>

      {/* Academic Credits */}
      <div className="card" style={{ fontSize: '0.84rem', color: '#475569', lineHeight: '1.6' }}>
        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
          Course & Project Metadata
        </div>
        <div>• <strong>Course</strong>: CS603 Data Science & Machine Learning (Semester VI Mini-Project)</div>
        <div>• <strong>Department</strong>: Department of Computer Science & Engineering</div>
        <div>• <strong>Technologies</strong>: React 19, Vite, Recharts, Lucide Icons, Python 3.13, Scikit-learn, Pandas, NumPy</div>
      </div>
    </div>
  );
}
