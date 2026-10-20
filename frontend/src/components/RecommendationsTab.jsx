import React, { useState } from 'react';
import { Target, Film, Tv, CreditCard, UserCheck, Shuffle, Download } from 'lucide-react';
import { usersData, recommendationsData, SEGMENT_THEMES } from '../utils/mlEngine';

export default function RecommendationsTab() {
  const [selectedUserId, setSelectedUserId] = useState(usersData[0]?.UserID || 'U0001');

  const selectedUser = usersData.find(u => u.UserID === selectedUserId) || usersData[0];
  const userRec = recommendationsData.find(r => r.Cluster === selectedUser.Segment) || {};

  const handleRandomUser = () => {
    const randomIndex = Math.floor(Math.random() * usersData.length);
    setSelectedUserId(usersData[randomIndex].UserID);
  };

  const handleExportCSV = () => {
    const headers = Object.keys(usersData[0]).join(',');
    const rows = usersData.map(u => Object.values(u).join(',')).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ott_clustered_users.csv';
    a.click();
  };

  return (
    <div>
      {/* Strategy Dossiers */}
      <div className="card">
        <div className="card-title">
          <Target size={18} style={{ color: '#1e40af' }} />
          Segment-Driven Catalog & Monetization Strategy Matrix
        </div>
        <div className="grid-2">
          {recommendationsData.map(rec => {
            const theme = SEGMENT_THEMES[rec.Cluster] || { color: '#1e40af' };
            const count = usersData.filter(u => u.Segment === rec.Cluster).length;
            return (
              <div key={rec.Cluster} style={{ border: '1px solid #e2e8f0', borderLeft: `5px solid ${theme.color}`, borderRadius: '6px', padding: '16px', background: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{rec.Cluster}</div>
                  <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    {count} Users ({((count / usersData.length) * 100).toFixed(1)}%)
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Film size={16} style={{ color: '#1d4ed8', flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Movie Catalog:</strong> {rec['Recommended Movies']}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Tv size={16} style={{ color: '#047857', flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Episodic Series:</strong> {rec['Recommended Series']}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <CreditCard size={16} style={{ color: '#b45309', flexShrink: 0, marginTop: '2px' }} />
                    <div><strong>Monetization Action:</strong> {rec['Subscription Action']}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Telemetry Inspector */}
      <div className="card">
        <div className="card-title">
          <UserCheck size={18} style={{ color: '#1e40af' }} />
          Individual User Telemetry & Recommendation Delivery Inspector
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ width: '220px' }}>
            <label className="form-label">Select User ID</label>
            <select
              className="form-select"
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
            >
              {usersData.slice(0, 100).map(u => (
                <option key={u.UserID} value={u.UserID}>
                  {u.UserID} ({u.Segment})
                </option>
              ))}
            </select>
          </div>

          <div style={{ paddingTop: '20px' }}>
            <button className="btn btn-outline" onClick={handleRandomUser}>
              <Shuffle size={14} />
              Sample Random User
            </button>
          </div>
        </div>

        {selectedUser && (
          <div>
            <div className="kpi-grid" style={{ marginBottom: '16px' }}>
              <div className="kpi-card">
                <div className="kpi-label">Assigned Segment</div>
                <div className="kpi-value" style={{ fontSize: '1.25rem', color: SEGMENT_THEMES[selectedUser.Segment]?.color || '#0f172a' }}>
                  {selectedUser.Segment}
                </div>
                <div className="kpi-sub">Tier: {selectedUser.SubscriptionType}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Weekly Watch Time</div>
                <div className="kpi-value" style={{ fontSize: '1.25rem' }}>
                  {selectedUser.WatchTime} hrs
                </div>
                <div className="kpi-sub">Logins: {selectedUser.LoginFrequency} days/wk</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Format Consumption</div>
                <div className="kpi-value" style={{ fontSize: '1.25rem' }}>
                  {selectedUser.MoviesWatched} M / {selectedUser.SeriesWatched} S
                </div>
                <div className="kpi-sub">Favorite: {selectedUser.FavoriteGenre}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Engagement Score</div>
                <div className="kpi-value" style={{ fontSize: '1.25rem' }}>
                  {selectedUser.EngagementScore} / 100
                </div>
                <div className="kpi-sub">Device: {selectedUser.DeviceType}</div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: `1px solid ${SEGMENT_THEMES[selectedUser.Segment]?.border || '#e2e8f0'}`, borderLeft: `5px solid ${SEGMENT_THEMES[selectedUser.Segment]?.color || '#1e40af'}`, borderRadius: '6px', padding: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '8px' }}>
                Delivered Recommendation Package for {selectedUser.UserID}
              </div>
              <div className="grid-3" style={{ gap: '14px', fontSize: '0.85rem' }}>
                <div>
                  <strong style={{ color: '#1d4ed8' }}>🎬 Movie Catalog Priority:</strong>
                  <div style={{ marginTop: '3px', color: '#334155' }}>{userRec['Recommended Movies']}</div>
                </div>
                <div>
                  <strong style={{ color: '#047857' }}>📺 Episodic Series Hook:</strong>
                  <div style={{ marginTop: '3px', color: '#334155' }}>{userRec['Recommended Series']}</div>
                </div>
                <div>
                  <strong style={{ color: '#b45309' }}>💳 Retention & Upgrade Offer:</strong>
                  <div style={{ marginTop: '3px', color: '#334155' }}>{userRec['Subscription Action']}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Labeled Directory */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="card-title" style={{ margin: 0, padding: 0, border: 'none' }}>
            Full Labeled Audience Directory ({usersData.length} Clean Records)
          </div>
          <button className="btn btn-outline" onClick={handleExportCSV}>
            <Download size={14} />
            Download Complete Clustered Dataset (CSV)
          </button>
        </div>

        <div className="data-table-container" style={{ maxHeight: '300px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>UserID</th>
                <th>Age</th>
                <th>Gender</th>
                <th>WatchTime</th>
                <th>Movies</th>
                <th>Series</th>
                <th>Genre</th>
                <th>Tier</th>
                <th>Engagement</th>
                <th>Assigned Segment</th>
              </tr>
            </thead>
            <tbody>
              {usersData.slice(0, 25).map(u => (
                <tr key={u.UserID}>
                  <td><strong>{u.UserID}</strong></td>
                  <td>{u.Age}</td>
                  <td>{u.Gender}</td>
                  <td>{u.WatchTime} h</td>
                  <td>{u.MoviesWatched}</td>
                  <td>{u.SeriesWatched}</td>
                  <td>{u.FavoriteGenre}</td>
                  <td>{u.SubscriptionType}</td>
                  <td>{u.EngagementScore}</td>
                  <td>
                    <span className={`badge ${
                      u.Segment === 'Action Movie Lovers' ? 'badge-action' :
                      u.Segment === 'Family Viewers' ? 'badge-family' :
                      u.Segment === 'Premium Users' ? 'badge-premium' : 'badge-casual'
                    }`}>
                      {u.Segment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
