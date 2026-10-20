import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, Compass, Film, Tv, Crown, Layers } from 'lucide-react';
import { usersData, resultsData, SEGMENT_THEMES, FEATURES, FEATURE_METADATA } from '../utils/mlEngine';

export default function SegmentsTab() {
  const profile = resultsData.cluster_profile || [];
  const sizes = resultsData.segment_sizes || {};

  // 1. Radar Chart Data (Normalized 0 to 100)
  const radarData = useMemo(() => {
    const radarFeatures = ['WatchTime', 'MoviesWatched', 'SeriesWatched', 'LoginFrequency', 'EngagementScore', 'Age'];
    
    // Calculate global min and max for each feature
    const minMax = {};
    radarFeatures.forEach(f => {
      const vals = usersData.map(u => Number(u[f] || 0));
      minMax[f] = { min: Math.min(...vals), max: Math.max(...vals) };
    });

    return radarFeatures.map(f => {
      const row = {
        feature: FEATURE_METADATA[f]?.label || f
      };
      profile.forEach(p => {
        const raw = Number(p[f] || 0);
        const { min, max } = minMax[f];
        const norm = max > min ? ((raw - min) / (max - min)) * 100 : 50;
        row[p.Segment] = Math.round(norm);
      });
      return row;
    });
  }, [profile]);

  // 2. PCA 2D Scatter Sample
  const pcaScatterData = useMemo(() => {
    return usersData.slice(0, 300).map(u => ({
      pc1: Number((u.PC1 || 0).toFixed(2)),
      pc2: Number((u.PC2 || 0).toFixed(2)),
      segment: u.Segment,
      userId: u.UserID,
      watchTime: u.WatchTime,
      engagement: u.EngagementScore
    }));
  }, []);

  const actionPts = pcaScatterData.filter(d => d.segment === 'Action Movie Lovers');
  const familyPts = pcaScatterData.filter(d => d.segment === 'Family Viewers');
  const premiumPts = pcaScatterData.filter(d => d.segment === 'Premium Users');
  const casualPts = pcaScatterData.filter(d => d.segment === 'Casual Users');

  return (
    <div>
      {/* 4 Persona Cards */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        <div className="card" style={{ borderTop: '4px solid #1d4ed8', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Film size={20} style={{ color: '#1d4ed8' }} />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Action Movie Lovers</div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
            Cohort: <strong>{sizes['Action Movie Lovers'] || 279}</strong> (27.9%)
          </div>
          <ul style={{ fontSize: '0.82rem', color: '#334155', paddingLeft: '16px', lineHeight: '1.7', margin: 0 }}>
            <li><strong>Watch Time</strong>: 21.3 hrs/wk</li>
            <li><strong>Format Ratio</strong>: 29.3 Movies vs 7.6 Series</li>
            <li><strong>Demographic</strong>: Avg Age 23.9 years</li>
            <li><strong>Hardware</strong>: Smart TV & Mobile split</li>
          </ul>
        </div>

        <div className="card" style={{ borderTop: '4px solid #047857', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={20} style={{ color: '#047857' }} />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Family Viewers</div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
            Cohort: <strong>{sizes['Family Viewers'] || 265}</strong> (26.5%)
          </div>
          <ul style={{ fontSize: '0.82rem', color: '#334155', paddingLeft: '16px', lineHeight: '1.7', margin: 0 }}>
            <li><strong>Watch Time</strong>: 16.3 hrs/wk</li>
            <li><strong>Format Ratio</strong>: 19.7 Series vs 11.6 Movies</li>
            <li><strong>Demographic</strong>: Avg Age 39.2 years</li>
            <li><strong>Hardware</strong>: Smart TV Dominant</li>
          </ul>
        </div>

        <div className="card" style={{ borderTop: '4px solid #b45309', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Crown size={20} style={{ color: '#b45309' }} />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Premium Users</div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
            Cohort: <strong>{sizes['Premium Users'] || 207}</strong> (20.7%)
          </div>
          <ul style={{ fontSize: '0.82rem', color: '#334155', paddingLeft: '16px', lineHeight: '1.7', margin: 0 }}>
            <li><strong>Watch Time</strong>: 32.7 hrs/wk (Heavy)</li>
            <li><strong>Format Ratio</strong>: 27.5 M / 25.1 S dual binge</li>
            <li><strong>Engagement</strong>: 88.3 / 100 (Peak vitality)</li>
            <li><strong>Monetization</strong>: 95% on Premium Tier</li>
          </ul>
        </div>

        <div className="card" style={{ borderTop: '4px solid #475569', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Tv size={20} style={{ color: '#475569' }} />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Casual Users</div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
            Cohort: <strong>{sizes['Casual Users'] || 249}</strong> (24.9%)
          </div>
          <ul style={{ fontSize: '0.82rem', color: '#334155', paddingLeft: '16px', lineHeight: '1.7', margin: 0 }}>
            <li><strong>Watch Time</strong>: 5.6 hrs/wk (Infrequent)</li>
            <li><strong>Format Ratio</strong>: 3.6 M / 2.4 S low volume</li>
            <li><strong>Cadence</strong>: 2.1 logins/week</li>
            <li><strong>Risk Profile</strong>: High subscriber churn</li>
          </ul>
        </div>
      </div>

      {/* Visualizations: Radar & PCA */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            <Compass size={18} style={{ color: '#1e40af' }} />
            Multidimensional Centroid Radar Benchmark (Normalized Feature Index)
          </div>
          <div style={{ height: '340px', width: '100%' }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="feature" tick={{ fontSize: 11, fill: '#334155' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
                <Radar name="Action Movie Lovers" dataKey="Action Movie Lovers" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.25} />
                <Radar name="Family Viewers" dataKey="Family Viewers" stroke="#047857" fill="#047857" fillOpacity={0.25} />
                <Radar name="Premium Users" dataKey="Premium Users" stroke="#b45309" fill="#b45309" fillOpacity={0.25} />
                <Radar name="Casual Users" dataKey="Casual Users" stroke="#475569" fill="#475569" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
            Normalized scale [0-100] demonstrates strong hyper-plane separation between segments.
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <Layers size={18} style={{ color: '#1e40af' }} />
            2D Principal Component Space (PCA Eigenvector Projection)
          </div>
          <div style={{ height: '340px', width: '100%' }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="pc1" name="PC1" label={{ value: 'Principal Component 1 (56.6% Var)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#64748b' }} tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="pc2" name="PC2" label={{ value: 'Principal Component 2 (16.5% Var)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }} tick={{ fontSize: 11 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 12px', fontSize: '11px', borderRadius: '4px' }}>
                        <div><strong>User {d.userId}</strong></div>
                        <div>Segment: <strong>{d.segment}</strong></div>
                        <div>PC1: {d.pc1} | PC2: {d.pc2}</div>
                        <div>Watch Time: {d.watchTime} h/wk</div>
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Scatter name="Action Movie Lovers" data={actionPts} fill="#1d4ed8" fillOpacity={0.7} />
                <Scatter name="Family Viewers" data={familyPts} fill="#047857" fillOpacity={0.7} />
                <Scatter name="Premium Users" data={premiumPts} fill="#b45309" fillOpacity={0.7} />
                <Scatter name="Casual Users" data={casualPts} fill="#475569" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
            Orthogonal eigenvectors capture 73.1% cumulative variance, confirming compact cluster convexity.
          </div>
        </div>
      </div>

      {/* Cluster Centroid Profiles Table */}
      <div className="card">
        <div className="card-title">
          <Users size={18} style={{ color: '#1e40af' }} />
          Cluster Profiles & Centroid Averages
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Segment Name</th>
                <th>Users</th>
                <th>Share</th>
                <th>Watch Time</th>
                <th>Movies</th>
                <th>Series</th>
                <th>Engagement</th>
                <th>Avg Age</th>
                <th>Sub Tier Index</th>
              </tr>
            </thead>
            <tbody>
              {profile.map(p => (
                <tr key={p.Segment}>
                  <td>
                    <span className={`badge ${
                      p.Segment === 'Action Movie Lovers' ? 'badge-action' :
                      p.Segment === 'Family Viewers' ? 'badge-family' :
                      p.Segment === 'Premium Users' ? 'badge-premium' : 'badge-casual'
                    }`}>
                      {p.Segment}
                    </span>
                  </td>
                  <td><strong>{sizes[p.Segment] || 0}</strong></td>
                  <td>{(((sizes[p.Segment] || 0) / usersData.length) * 100).toFixed(1)}%</td>
                  <td>{p.WatchTime} hrs/wk</td>
                  <td>{p.MoviesWatched}</td>
                  <td>{p.SeriesWatched}</td>
                  <td>{p.EngagementScore} / 100</td>
                  <td>{p.Age} yrs</td>
                  <td>{p.SubCode} ({p.SubCode > 1.5 ? 'Premium' : p.SubCode > 0.5 ? 'Standard' : 'Basic'})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
