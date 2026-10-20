import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Sliders, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { predictSegment, getFeatureDeviations, SEGMENT_THEMES, FEATURES, FEATURE_METADATA } from '../utils/mlEngine';

export default function ClassifierTab() {
  const [formData, setFormData] = useState({
    Age: 25,
    WatchTime: 22.0,
    MoviesWatched: 28,
    SeriesWatched: 8,
    AvgRating: 3.8,
    LoginFrequency: 6.0,
    EngagementScore: 65,
    SubCode: 1 // Standard
  });

  const handleChange = (feat, val) => {
    setFormData(prev => ({ ...prev, [feat]: Number(val) }));
  };

  // Live prediction
  const predictionResult = useMemo(() => {
    return predictSegment(formData);
  }, [formData]);

  // Affinity chart data
  const affinityData = useMemo(() => {
    return Object.entries(predictionResult.affinities).map(([seg, val]) => ({
      segment: seg,
      affinity: val,
      fill: SEGMENT_THEMES[seg]?.color || '#1e40af'
    }));
  }, [predictionResult]);

  // Feature deviations
  const deviations = useMemo(() => {
    return getFeatureDeviations(formData, predictionResult.predictedSegment);
  }, [formData, predictionResult]);

  const currentTheme = SEGMENT_THEMES[predictionResult.predictedSegment] || { color: '#1e40af' };

  return (
    <div>
      <div className="card">
        <div className="card-title">
          <Sliders size={18} style={{ color: '#1e40af' }} />
          Real-Time Persona Inference & What-If Behavioral Simulator
        </div>
        <p style={{ fontSize: '0.86rem', color: '#475569', marginBottom: '16px' }}>
          Adjust viewer behavioral parameters below. The client-side inference engine executes standardized Z-score transformation 
          and Euclidean distance minimization against trained cluster centroids with zero latency.
        </p>

        <div className="grid-2">
          {/* Inputs */}
          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '14px' }}>
              Viewing Telemetry Parameters
            </div>

            <div className="grid-2" style={{ gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Viewer Age: <strong>{formData.Age} yrs</strong></label>
                <input
                  type="range"
                  min="14"
                  max="80"
                  step="1"
                  value={formData.Age}
                  onChange={e => handleChange('Age', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weekly Watch Time: <strong>{formData.WatchTime} hrs/wk</strong></label>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="0.5"
                  value={formData.WatchTime}
                  onChange={e => handleChange('WatchTime', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Movies Watched / Mo: <strong>{formData.MoviesWatched}</strong></label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={formData.MoviesWatched}
                  onChange={e => handleChange('MoviesWatched', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Series Episodes / Mo: <strong>{formData.SeriesWatched}</strong></label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={formData.SeriesWatched}
                  onChange={e => handleChange('SeriesWatched', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Average Rating Given: <strong>{formData.AvgRating} stars</strong></label>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={formData.AvgRating}
                  onChange={e => handleChange('AvgRating', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Login Frequency: <strong>{formData.LoginFrequency} days/wk</strong></label>
                <input
                  type="range"
                  min="0.5"
                  max="7.0"
                  step="0.5"
                  value={formData.LoginFrequency}
                  onChange={e => handleChange('LoginFrequency', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subscription Tier</label>
                <select
                  className="form-select"
                  value={formData.SubCode}
                  onChange={e => handleChange('SubCode', e.target.value)}
                >
                  <option value={0}>Basic (0)</option>
                  <option value={1}>Standard (1)</option>
                  <option value={2}>Premium (2)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Engagement Score: <strong>{formData.EngagementScore} / 100</strong></label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={formData.EngagementScore}
                  onChange={e => handleChange('EngagementScore', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', alignSelf: 'center' }}>Presets:</span>
              <button
                className="btn btn-outline"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                onClick={() => setFormData({ Age: 22, WatchTime: 24, MoviesWatched: 32, SeriesWatched: 6, AvgRating: 3.9, LoginFrequency: 6.0, EngagementScore: 68, SubCode: 1 })}
              >
                Action Enthusiast
              </button>
              <button
                className="btn btn-outline"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                onClick={() => setFormData({ Age: 42, WatchTime: 18, MoviesWatched: 10, SeriesWatched: 24, AvgRating: 4.1, LoginFrequency: 4.5, EngagementScore: 48, SubCode: 1 })}
              >
                Family Household
              </button>
              <button
                className="btn btn-outline"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                onClick={() => setFormData({ Age: 31, WatchTime: 38, MoviesWatched: 30, SeriesWatched: 28, AvgRating: 4.6, LoginFrequency: 6.8, EngagementScore: 92, SubCode: 2 })}
              >
                Premium VIP
              </button>
              <button
                className="btn btn-outline"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                onClick={() => setFormData({ Age: 26, WatchTime: 4.5, MoviesWatched: 2, SeriesWatched: 2, AvgRating: 2.8, LoginFrequency: 1.5, EngagementScore: 14, SubCode: 0 })}
              >
                High Churn Casual
              </button>
            </div>
          </div>

          {/* Real-Time Prediction Output */}
          <div>
            <div style={{ background: '#ffffff', border: `1px solid ${currentTheme.border || '#e2e8f0'}`, borderLeft: `5px solid ${currentTheme.color}`, borderRadius: '6px', padding: '18px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: currentTheme.color }}>
                Predicted Persona Classification
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>
                {predictionResult.predictedSegment}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#475569' }}>
                Cluster Affinity: <strong>{predictionResult.affinities[predictionResult.predictedSegment]}%</strong> | 
                Centroid Euclidean Distance: <strong>{predictionResult.minDistance}</strong>
              </div>
            </div>

            {/* Affinity Bar Chart */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                Membership Probability Across All Segments
              </div>
              <div style={{ height: '140px', width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={affinityData} layout="vertical" margin={{ top: 5, right: 30, left: 110, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="segment" tick={{ fontSize: 10, fill: '#334155' }} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Probability']} contentStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="affinity" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tailored Action Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', fontSize: '0.84rem', lineHeight: '1.6' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Tailored Marketing Delivery</div>
              <div><strong>🎬 Movie Focus:</strong> {predictionResult.recommendations.movies}</div>
              <div><strong>📺 Series Focus:</strong> {predictionResult.recommendations.series}</div>
              <div><strong>💳 Monetization:</strong> {predictionResult.recommendations.plan}</div>
            </div>
          </div>
        </div>

        {/* Feature Deviations Table */}
        <div style={{ marginTop: '20px' }}>
          <div className="card-title" style={{ fontSize: '0.95rem' }}>
            Input Telemetry Variance vs. {predictionResult.predictedSegment} Centroid Benchmark
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feature Dimension</th>
                  <th>Your Input Value</th>
                  <th>Segment Centroid Average</th>
                  <th>Deviation from Benchmark</th>
                  <th>Alignment Assessment</th>
                </tr>
              </thead>
              <tbody>
                {deviations.map(d => {
                  const isClose = Math.abs(d.deviationPct) < 20;
                  return (
                    <tr key={d.feature}>
                      <td><strong>{d.label}</strong> (<code>{d.feature}</code>)</td>
                      <td>{d.userValue}</td>
                      <td>{d.segmentAvg}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: d.deviationPct > 0 ? '#1e40af' : '#b45309', fontWeight: 600 }}>
                          {d.deviationPct > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {d.deviationPct > 0 ? `+${d.deviationPct}%` : `${d.deviationPct}%`}
                        </span>
                      </td>
                      <td>
                        {isClose ? (
                          <span style={{ color: '#047857', fontSize: '0.8rem', fontWeight: 600 }}>✓ Within typical archetype range</span>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Exceeds typical cluster dispersion</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
