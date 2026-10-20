// mlEngine.js - Client-Side Unsupervised ML Inference Engine
// Implements exact StandardScaler Z-score transformation and Euclidean Centroid Distance
import scalerParams from '../data/scalerParams.json';
import usersData from '../data/users.json';
import resultsData from '../data/results.json';
import recommendationsData from '../data/recommendations.json';
import modelComparisonData from '../data/modelComparison.json';

export const FEATURES = scalerParams.features;

export const FEATURE_METADATA = {
  Age: { label: 'Viewer Age', unit: 'years', min: 14, max: 80, step: 1, default: 25 },
  WatchTime: { label: 'Weekly Watch Time', unit: 'hrs/week', min: 0, max: 70, step: 0.5, default: 22 },
  MoviesWatched: { label: 'Movies Watched', unit: 'per month', min: 0, max: 60, step: 1, default: 28 },
  SeriesWatched: { label: 'Series Episodes', unit: 'per month', min: 0, max: 60, step: 1, default: 8 },
  AvgRating: { label: 'Average Rating Given', unit: 'stars (1-5)', min: 1.0, max: 5.0, step: 0.1, default: 3.8 },
  LoginFrequency: { label: 'Login Frequency', unit: 'days/week', min: 0.5, max: 7.0, step: 0.5, default: 6.0 },
  EngagementScore: { label: 'Engagement Score', unit: 'index (1-100)', min: 1, max: 100, step: 1, default: 65 },
  SubCode: { label: 'Subscription Tier', unit: '0=Basic, 1=Std, 2=Prem', min: 0, max: 2, step: 1, default: 1 }
};

export const SEGMENT_THEMES = {
  'Action Movie Lovers': {
    color: '#1d4ed8', // Oxford Cobalt
    bg: '#eff6ff',
    border: '#bfdbfe',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: 'Film'
  },
  'Family Viewers': {
    color: '#047857', // Forest Sage
    bg: '#ecfdf5',
    border: '#a7f3d0',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: 'Users'
  },
  'Premium Users': {
    color: '#b45309', // Warm Ochre
    bg: '#fffbeb',
    border: '#fde68a',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: 'Crown'
  },
  'Casual Users': {
    color: '#475569', // Charcoal Slate
    bg: '#f8fafc',
    border: '#e2e8f0',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    icon: 'Tv'
  }
};

/**
 * Standardize input feature vector using trained scaler parameters: z = (x - mu) / sigma
 */
export function standardizeFeatures(inputDict) {
  return FEATURES.map((feat, idx) => {
    const rawVal = Number(inputDict[feat] ?? 0);
    const mean = scalerParams.mean[idx];
    const scale = scalerParams.scale[idx];
    return (rawVal - mean) / (scale || 1.0);
  });
}

/**
 * Predict segment by computing Euclidean distance to all cluster centroids
 */
export function predictSegment(inputDict) {
  const zVector = standardizeFeatures(inputDict);
  const distances = {};
  const centroids = scalerParams.centroids;

  let minDistance = Infinity;
  let predictedSegment = Object.keys(centroids)[0];

  for (const [segmentName, centroidVector] of Object.entries(centroids)) {
    let sumSq = 0;
    for (let i = 0; i < zVector.length; i++) {
      const diff = zVector[i] - centroidVector[i];
      sumSq += diff * diff;
    }
    const dist = Math.sqrt(sumSq);
    distances[segmentName] = Number(dist.toFixed(3));

    if (dist < minDistance) {
      minDistance = dist;
      predictedSegment = segmentName;
    }
  }

  // Calculate inverse distance affinities/probabilities
  const invDistances = {};
  let totalInv = 0;
  for (const [seg, dist] of Object.entries(distances)) {
    const inv = 1.0 / (dist + 0.0001);
    invDistances[seg] = inv;
    totalInv += inv;
  }

  const affinities = {};
  for (const [seg, inv] of Object.entries(invDistances)) {
    affinities[seg] = Number(((inv / totalInv) * 100).toFixed(1));
  }

  // Find recommendations
  const recItem = recommendationsData.find(r => r.Cluster === predictedSegment) || {};

  return {
    predictedSegment,
    minDistance: Number(minDistance.toFixed(3)),
    distances,
    affinities,
    recommendations: {
      movies: recItem['Recommended Movies'] || 'Curated catalog according to cluster viewing habits.',
      series: recItem['Recommended Series'] || 'Trending multi-episode series.',
      plan: recItem['Subscription Action'] || 'Optimized retention offer.'
    }
  };
}

/**
 * Calculate feature deviations between user input and segment centroid averages
 */
export function getFeatureDeviations(inputDict, segmentName) {
  const segUsers = usersData.filter(u => u.Segment === segmentName);
  if (!segUsers.length) return [];

  return FEATURES.map(feat => {
    const sum = segUsers.reduce((acc, u) => acc + Number(u[feat] || 0), 0);
    const avg = sum / segUsers.length;
    const userVal = Number(inputDict[feat] || 0);
    const pctDiff = avg !== 0 ? ((userVal - avg) / avg) * 100 : 0;

    return {
      feature: feat,
      label: FEATURE_METADATA[feat]?.label || feat,
      userValue: userVal,
      segmentAvg: Number(avg.toFixed(2)),
      deviationPct: Number(pctDiff.toFixed(1))
    };
  });
}

export { usersData, resultsData, recommendationsData, modelComparisonData, scalerParams };
