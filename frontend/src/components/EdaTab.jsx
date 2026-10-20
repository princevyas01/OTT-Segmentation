import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, CartesianGrid, Legend } from 'recharts';
import { BarChart3, Filter, Download, Search } from 'lucide-react';
import { usersData, FEATURES, FEATURE_METADATA, SEGMENT_THEMES } from '../utils/mlEngine';

export default function EdaTab() {
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [selectedSub, setSelectedSub] = useState('All');
  const [selectedDevice, setSelectedDevice] = useState('All');
  const [ageRange, setAgeRange] = useState([14, 80]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered Cohort
  const filteredUsers = useMemo(() => {
    return usersData.filter(u => {
      if (selectedSegment !== 'All' && u.Segment !== selectedSegment) return false;
      if (selectedSub !== 'All' && u.SubscriptionType !== selectedSub) return false;
      if (selectedDevice !== 'All' && u.DeviceType !== selectedDevice) return false;
      if (u.Age < ageRange[0] || u.Age > ageRange[1]) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return u.UserID.toLowerCase().includes(q) || u.FavoriteGenre.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedSegment, selectedSub, selectedDevice, ageRange, searchQuery]);

  // 1. Watch Time Histogram Bins
  const watchTimeBins = useMemo(() => {
    const bins = [
      { range: '0-10h', count: 0 },
      { range: '10-20h', count: 0 },
      { range: '20-30h', count: 0 },
      { range: '30-40h', count: 0 },
      { range: '40-50h', count: 0 },
      { range: '50h+', count: 0 }
    ];
    filteredUsers.forEach(u => {
      const wt = u.WatchTime;
      if (wt < 10) bins[0].count++;
      else if (wt < 20) bins[1].count++;
      else if (wt < 30) bins[2].count++;
      else if (wt < 40) bins[3].count++;
      else if (wt < 50) bins[4].count++;
      else bins[5].count++;
    });
    return bins;
  }, [filteredUsers]);

  // 2. Genre by Subscription
  const genreData = useMemo(() => {
    const genres = ['Action', 'Comedy', 'Drama', 'Family', 'Sci-Fi', 'Thriller'];
    return genres.map(g => {
      const basic = filteredUsers.filter(u => u.FavoriteGenre === g && u.SubscriptionType === 'Basic').length;
      const standard = filteredUsers.filter(u => u.FavoriteGenre === g && u.SubscriptionType === 'Standard').length;
      const premium = filteredUsers.filter(u => u.FavoriteGenre === g && u.SubscriptionType === 'Premium').length;
      return { genre: g, Basic: basic, Standard: standard, Premium: premium };
    });
  }, [filteredUsers]);

  // 3. Movies vs Series Scatter sample (limit 250 for crisp rendering)
  const scatterData = useMemo(() => {
    return filteredUsers.slice(0, 250).map(u => ({
      movies: u.MoviesWatched,
      series: u.SeriesWatched,
      segment: u.Segment,
      userId: u.UserID,
      watchTime: u.WatchTime
    }));
  }, [filteredUsers]);

  // 4. Feature Correlation Matrix
  const correlationMatrix = useMemo(() => {
    const feats = ['WatchTime', 'MoviesWatched', 'SeriesWatched', 'LoginFrequency', 'EngagementScore'];
    const matrix = [];
    
    // Helper to compute Pearson r
    const getCorrelation = (f1, f2) => {
      const n = filteredUsers.length;
      if (n < 2) return 0;
      let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
      for (const u of filteredUsers) {
        const x = Number(u[f1]);
        const y = Number(u[f2]);
        sum1 += x;
        sum2 += y;
        sum1Sq += x * x;
        sum2Sq += y * y;
        pSum += x * y;
      }
      const num = pSum - (sum1 * sum2 / n);
      const den = Math.sqrt((sum1Sq - (sum1 * sum1 / n)) * (sum2Sq - (sum2 * sum2 / n)));
      return den === 0 ? 0 : Number((num / den).toFixed(2));
    };

    feats.forEach(f1 => {
      const row = { feature: f1 };
      feats.forEach(f2 => {
        row[f2] = getCorrelation(f1, f2);
      });
      matrix.push(row);
    });
    return matrix;
  }, [filteredUsers]);

  // Export CSV
  const handleExportCSV = () => {
    if (!filteredUsers.length) return;
    const headers = Object.keys(filteredUsers[0]).join(',');
    const rows = filteredUsers.map(u => Object.values(u).join(',')).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ott_active_cohort.csv';
    a.click();
  };

  return (
    <div>
      {/* Filters Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 600, fontSize: '0.9rem', color: '#1e40af' }}>
          <Filter size={16} />
          Interactive Cohort Filters (Dynamic Recalculation across {filteredUsers.length} of {usersData.length} Users)
        </div>
        <div className="grid-4" style={{ gap: '12px' }}>
          <div>
            <label className="form-label">Audience Segment</label>
            <select className="form-select" value={selectedSegment} onChange={e => setSelectedSegment(e.target.value)}>
              <option value="All">All Segments</option>
              <option value="Action Movie Lovers">Action Movie Lovers</option>
              <option value="Family Viewers">Family Viewers</option>
              <option value="Premium Users">Premium Users</option>
              <option value="Casual Users">Casual Users</option>
            </select>
          </div>
          <div>
            <label className="form-label">Subscription Tier</label>
            <select className="form-select" value={selectedSub} onChange={e => setSelectedSub(e.target.value)}>
              <option value="All">All Tiers</option>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="form-label">Device Type</label>
            <select className="form-select" value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)}>
              <option value="All">All Devices</option>
              <option value="Smart TV">Smart TV</option>
              <option value="Mobile">Mobile</option>
              <option value="Laptop">Laptop</option>
            </select>
          </div>
          <div>
            <label className="form-label">Age Range ({ageRange[0]} - {ageRange[1]} yrs)</label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input
                type="number"
                className="form-input"
                style={{ width: '70px', padding: '6px 8px' }}
                value={ageRange[0]}
                min={14}
                max={ageRange[1]}
                onChange={e => setAgeRange([Number(e.target.value), ageRange[1]])}
              />
              <span style={{ color: '#64748b' }}>to</span>
              <input
                type="number"
                className="form-input"
                style={{ width: '70px', padding: '6px 8px' }}
                value={ageRange[1]}
                min={ageRange[0]}
                max={80}
                onChange={e => setAgeRange([ageRange[0], Number(e.target.value)])}
              />
              <button
                className="btn btn-outline"
                style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                onClick={() => {
                  setSelectedSegment('All');
                  setSelectedSub('All');
                  setSelectedDevice('All');
                  setAgeRange([14, 80]);
                  setSearchQuery('');
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Charts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            <BarChart3 size={18} style={{ color: '#1e40af' }} />
            Weekly Watch Time Distribution (Hours/Week)
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={watchTimeBins} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} name="Users Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
            Bimodal distribution highlighting heavy bingers (&gt;30h) vs casual viewers (&lt;10h).
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <BarChart3 size={18} style={{ color: '#1e40af' }} />
            Favorite Genre Preferences across Subscription Tiers
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={genreData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="genre" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Basic" fill="#64748b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Standard" fill="#1d4ed8" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Premium" fill="#b45309" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
            Action and Sci-Fi show highest penetration in Premium tiers; Comedy leads in Basic.
          </div>
        </div>
      </div>

      {/* Row 2: Scatter & Correlations */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            <BarChart3 size={18} style={{ color: '#1e40af' }} />
            Content Consumption: Movies Watched vs Series Episodes
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="movies" name="Movies" unit="" label={{ value: 'Movies Watched / Mo', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#64748b' }} tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="series" name="Series" unit="" label={{ value: 'Series Episodes', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }} tick={{ fontSize: 11 }} />
                <ZAxis range={[25, 25]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 12px', fontSize: '11px', borderRadius: '4px' }}>
                        <div><strong>User {d.userId}</strong> ({d.segment})</div>
                        <div>Movies: {d.movies} | Series: {d.series}</div>
                        <div>Watch Time: {d.watchTime}h/wk</div>
                      </div>
                    );
                  }}
                />
                <Scatter name="Users" data={scatterData} fill="#1d4ed8" fillOpacity={0.65} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
            Clear cluster separation along movie-heavy (horizontal) and series-heavy (vertical) axes.
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <BarChart3 size={18} style={{ color: '#1e40af' }} />
            Pairwise Pearson Correlation Coefficients (Linear Dependencies)
          </div>
          <div className="data-table-container">
            <table className="data-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>WatchTime</th>
                  <th>Movies</th>
                  <th>Series</th>
                  <th>Logins</th>
                  <th>Engagement</th>
                </tr>
              </thead>
              <tbody>
                {correlationMatrix.map(row => (
                  <tr key={row.feature}>
                    <td><strong>{row.feature}</strong></td>
                    <td style={{ backgroundColor: Math.abs(row.WatchTime) > 0.5 ? '#eff6ff' : 'transparent', fontWeight: Math.abs(row.WatchTime) > 0.5 ? 600 : 400 }}>{row.WatchTime}</td>
                    <td style={{ backgroundColor: Math.abs(row.MoviesWatched) > 0.5 ? '#eff6ff' : 'transparent', fontWeight: Math.abs(row.MoviesWatched) > 0.5 ? 600 : 400 }}>{row.MoviesWatched}</td>
                    <td style={{ backgroundColor: Math.abs(row.SeriesWatched) > 0.5 ? '#eff6ff' : 'transparent', fontWeight: Math.abs(row.SeriesWatched) > 0.5 ? 600 : 400 }}>{row.SeriesWatched}</td>
                    <td style={{ backgroundColor: Math.abs(row.LoginFrequency) > 0.5 ? '#eff6ff' : 'transparent', fontWeight: Math.abs(row.LoginFrequency) > 0.5 ? 600 : 400 }}>{row.LoginFrequency}</td>
                    <td style={{ backgroundColor: Math.abs(row.EngagementScore) > 0.5 ? '#eff6ff' : 'transparent', fontWeight: Math.abs(row.EngagementScore) > 0.5 ? 600 : 400 }}>{row.EngagementScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
            WatchTime and EngagementScore exhibit strong mutual linearity (&gt;0.80), forming the primary axis of platform stickiness.
          </div>
        </div>
      </div>

      {/* Cohort Explorer Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div className="card-title" style={{ margin: 0, padding: 0, border: 'none' }}>
            <Search size={18} style={{ color: '#1e40af' }} />
            Active Cohort Explorer ({filteredUsers.length} Users)
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search User ID or Genre..."
              className="form-input"
              style={{ width: '220px', padding: '6px 10px', fontSize: '0.82rem' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={handleExportCSV}>
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="data-table-container" style={{ maxHeight: '340px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>UserID</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Watch Time</th>
                <th>Movies</th>
                <th>Series</th>
                <th>Genre</th>
                <th>Tier</th>
                <th>Engagement</th>
                <th>Segment</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.slice(0, 30).map(u => (
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
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px', textAlign: 'right' }}>
          Showing initial 30 records of {filteredUsers.length} matching rows. Use export button for full dataset.
        </div>
      </div>
    </div>
  );
}
