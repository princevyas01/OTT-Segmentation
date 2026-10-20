import React from 'react';
import { Database, Clock, Award, ShieldCheck } from 'lucide-react';
import { usersData, modelComparisonData } from '../utils/mlEngine';

export default function Header() {
  const totalUsers = usersData.length;
  
  // Calculate median watch time
  const watchTimes = [...usersData].map(u => u.WatchTime).sort((a, b) => a - b);
  const mid = Math.floor(watchTimes.length / 2);
  const medianWatch = watchTimes.length % 2 !== 0 ? watchTimes[mid] : (watchTimes[mid - 1] + watchTimes[mid]) / 2;
  const meanWatch = (watchTimes.reduce((a, b) => a + b, 0) / watchTimes.length).toFixed(1);

  // K-Means Silhouette
  const kmRow = modelComparisonData.find(m => m.Algorithm === 'K-Means') || {};
  const kmSil = kmRow.Silhouette ?? 0.370;

  // Premium share
  const premiumCount = usersData.filter(u => u.SubscriptionType === 'Premium').length;
  const premiumPct = ((premiumCount / totalUsers) * 100).toFixed(1);
  const standardPct = ((usersData.filter(u => u.SubscriptionType === 'Standard').length / totalUsers) * 100).toFixed(1);
  const basicPct = ((usersData.filter(u => u.SubscriptionType === 'Basic').length / totalUsers) * 100).toFixed(1);

  return (
    <header>
      <div className="academic-banner">
        <div className="institution-tag">Department of Computer Science & Engineering • DSML Mini-Project (Semester VI)</div>
        <h1 className="project-title">🎬 OTT User Behavioral Segmentation & Recommendation Analysis System</h1>
        <p className="project-subtitle">
          An Unsupervised Machine Learning Framework for Audience Characterization, Churn Mitigation, and Catalog Personalization.
          Benchmarking <strong>K-Means Clustering</strong> against <strong>DBSCAN</strong> across 8 behavioral telemetry dimensions.
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Analyzed User Base</div>
          <div className="kpi-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={22} style={{ color: '#1e40af' }} />
            {totalUsers.toLocaleString()}
          </div>
          <div className="kpi-sub">Cleaned records (10 duplicates purged)</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Median Watch Time</div>
          <div className="kpi-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={22} style={{ color: '#047857' }} />
            {medianWatch.toFixed(1)} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>hrs/wk</span>
          </div>
          <div className="kpi-sub">Mean: {meanWatch} hrs/week</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Optimal Model (K-Means)</div>
          <div className="kpi-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={22} style={{ color: '#b45309' }} />
            k = 4
          </div>
          <div className="kpi-sub">Silhouette Score: <strong>{kmSil}</strong> (0 noise)</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Premium Tier Share</div>
          <div className="kpi-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} style={{ color: '#475569' }} />
            {premiumPct}%
          </div>
          <div className="kpi-sub">Standard: {standardPct}% | Basic: {basicPct}%</div>
        </div>
      </div>
    </header>
  );
}
