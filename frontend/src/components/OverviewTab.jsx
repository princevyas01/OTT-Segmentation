import React from 'react';
import { BookOpen, GitBranch, CheckCircle2, Sliders } from 'lucide-react';
import { resultsData } from '../utils/mlEngine';

export default function OverviewTab() {
  const clean = resultsData.cleaning || {};

  const featureDocs = [
    { name: 'Age', type: 'Continuous', range: '14 - 78 years', role: 'Demographic anchor for content life-stage profiling.' },
    { name: 'WatchTime', type: 'Continuous', range: '0.0 - 75.0 hrs/wk', role: 'Primary volume indicator of platform retention & consumption depth.' },
    { name: 'MoviesWatched', type: 'Discrete', range: '0 - 58 count/mo', role: 'Preference for standalone, feature-length storytelling formats.' },
    { name: 'SeriesWatched', type: 'Discrete', range: '0 - 55 episodes/mo', role: 'Episodic bingeing loyalty and narrative hook retention rate.' },
    { name: 'AvgRating', type: 'Continuous', range: '1.0 - 5.0 stars', role: 'Viewer satisfaction, critique tendency, and engagement discernment.' },
    { name: 'LoginFrequency', type: 'Continuous', range: '0.5 - 7.0 days/wk', role: 'Habitual session return cadence; highly inverse to churn hazard.' },
    { name: 'EngagementScore', type: 'Continuous', range: '1.0 - 100.0 score', role: 'Composite vitality index combining UI interactions & completion.' },
    { name: 'SubCode', type: 'Ordinal', range: '0 (Basic), 1 (Std), 2 (Prem)', role: 'Monetization baseline determining Average Revenue Per User (ARPU).' }
  ];

  return (
    <div>
      <div className="card">
        <div className="card-title">
          <BookOpen size={18} style={{ color: '#1e40af' }} />
          Project Abstract & Problem Formulation
        </div>
        <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '12px' }}>
          Over-The-Top (OTT) streaming platforms face intense customer churn and recommendation fatigue. 
          Broad demographic targeting fails because users with identical ages often exhibit vastly differing binge behaviors. 
          This project implements an end-to-end unsupervised machine learning pipeline to discover organic behavioral personas 
          from continuous viewing telemetry (watch hours, content formats, login cadence, engagement scores), 
          benchmarking <strong>Partitional Clustering (K-Means)</strong> against <strong>Density-Based Clustering (DBSCAN)</strong>, 
          and mapping each segment to rule-based retention and catalog recommendations.
        </p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            <GitBranch size={18} style={{ color: '#1e40af' }} />
            Machine Learning Pipeline Architecture
          </div>
          <div className="code-block" style={{ lineHeight: '1.9' }}>
            <div>1. <strong>Raw Telemetry Ingestion</strong>: 1,010 records with real-world noise, duplicates & nulls.</div>
            <div>2. <strong>Data Preprocessing</strong>:</div>
            <div style={{ paddingLeft: '16px' }}>• Deduplication: 10 redundant records eliminated.</div>
            <div style={{ paddingLeft: '16px' }}>• Numerical Imputation: Median substitution for Age, WatchTime, AvgRating.</div>
            <div style={{ paddingLeft: '16px' }}>• Categorical Imputation: Mode substitution for Gender, Genre, Device.</div>
            <div style={{ paddingLeft: '16px' }}>• Ordinal Encoding: Subscription mapping (Basic=0, Standard=1, Premium=2).</div>
            <div>3. <strong>Standard Scaling</strong>: Z-score normalization: z = (x - &mu;) / &sigma; across 8 dimensions.</div>
            <div>4. <strong>Unsupervised Clustering</strong>: K-Means (k=2..8, Elbow & Silhouette) vs DBSCAN (&epsilon;, MinPts).</div>
            <div>5. <strong>Formal Validation</strong>: Silhouette Score, Davies-Bouldin Index, Calinski-Harabasz Index.</div>
            <div>6. <strong>Persona Characterization</strong>: Centroid profiling into 4 actionable business segments.</div>
            <div>7. <strong>Inference Engine</strong>: Client-side Z-score distance classifier & targeted catalog curation.</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <CheckCircle2 size={18} style={{ color: '#047857' }} />
            Data Preprocessing & Quality Audit
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Audit Stage Metric</th>
                  <th>Value</th>
                  <th>Methodology Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Initial Raw Ingested Rows</td>
                  <td><strong>{clean['Rows Before Cleaning'] || 1010}</strong></td>
                  <td>Synthetic telemetry with noise</td>
                </tr>
                <tr>
                  <td>Duplicate Rows Purged</td>
                  <td><strong>{clean['Duplicate Rows'] || 10}</strong></td>
                  <td>Pandas drop_duplicates()</td>
                </tr>
                <tr>
                  <td>Missing Age Values Imputed</td>
                  <td><strong>{clean['Missing Values']?.Age || 21}</strong></td>
                  <td>Median Imputation (Robust to outliers)</td>
                </tr>
                <tr>
                  <td>Missing WatchTime Imputed</td>
                  <td><strong>{clean['Missing Values']?.WatchTime || 21}</strong></td>
                  <td>Median Imputation</td>
                </tr>
                <tr>
                  <td>Missing AvgRating Imputed</td>
                  <td><strong>{clean['Missing Values']?.AvgRating || 21}</strong></td>
                  <td>Median Imputation</td>
                </tr>
                <tr>
                  <td>Final Clean Analytical Sample</td>
                  <td><strong>{clean['Rows After Cleaning'] || 1000}</strong></td>
                  <td>Standardized for clustering</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <Sliders size={18} style={{ color: '#1e40af' }} />
          Mathematical Feature Space (8 Dimensions)
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature Dimension</th>
                <th>Variable Type</th>
                <th>Measurement Scale</th>
                <th>Domain Significance in Recommendation & Churn</th>
              </tr>
            </thead>
            <tbody>
              {featureDocs.map(f => (
                <tr key={f.name}>
                  <td><code>{f.name}</code></td>
                  <td>{f.type}</td>
                  <td>{f.range}</td>
                  <td>{f.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
