import React, { useState } from 'react';
import { BookOpen, BarChart3, Users, Scale, Target, Sliders, HelpCircle } from 'lucide-react';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import EdaTab from './components/EdaTab';
import SegmentsTab from './components/SegmentsTab';
import ModelCompareTab from './components/ModelCompareTab';
import RecommendationsTab from './components/RecommendationsTab';
import ClassifierTab from './components/ClassifierTab';
import VivaTab from './components/VivaTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Executive Brief & Pipeline', icon: BookOpen },
    { id: 'eda', label: 'Exploratory Data Analysis', icon: BarChart3 },
    { id: 'segments', label: 'Segment Personas & Profiling', icon: Users },
    { id: 'compare', label: 'K-Means vs DBSCAN Evaluation', icon: Scale },
    { id: 'recommendations', label: 'Recommendation Engine', icon: Target },
    { id: 'classifier', label: 'Live Persona Classifier', icon: Sliders },
    { id: 'viva', label: 'Academic Defense & Viva Q&A', icon: HelpCircle }
  ];

  return (
    <div className="app-container">
      {/* Institution Banner & KPIs */}
      <Header />

      {/* Main Tab Navigation */}
      <nav className="tab-nav" aria-label="Project Navigation">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Active Tab Content */}
      <main>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'eda' && <EdaTab />}
        {activeTab === 'segments' && <SegmentsTab />}
        {activeTab === 'compare' && <ModelCompareTab />}
        {activeTab === 'recommendations' && <RecommendationsTab />}
        {activeTab === 'classifier' && <ClassifierTab />}
        {activeTab === 'viva' && <VivaTab />}
      </main>

      {/* Academic Footer */}
      <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
        OTT User Behavioral Segmentation and Recommendation Analysis System • B.Tech Computer Science & Engineering (DSML Mini-Project)
      </footer>
    </div>
  );
}
