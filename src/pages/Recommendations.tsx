import React, { useState } from 'react';
import { Target, CheckCircle, Clock, AlertCircle, Award, Calendar } from 'lucide-react';
import { useReadiness } from '../contexts/ReadinessContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const Recommendations: React.FC = () => {
  const { assessmentHistory, latestScore } = useReadiness(); // Use latestScore
  useAuth();
  const [activeTab, setActiveTab] = useState<'recommendations' | 'assessments' | 'achievements'>('recommendations');

  // This function can be replaced with a real implementation later
  const getPersonalizedRecommendations = () => {
    return [
      { id: 1, title: 'Update Emergency Kit', description: 'Your emergency kit needs fresh water and food supplies', priority: 'high' as const, completed: false, category: 'Emergency Supplies', estimatedTime: '2 hours', impact: '+8 points' },
      { id: 2, title: 'Practice Evacuation Route', description: 'Conduct a family evacuation drill', priority: 'medium' as const, completed: false, category: 'Emergency Planning', estimatedTime: '1 hour', impact: '+6 points' },
    ];
  };

  const recommendations = getPersonalizedRecommendations();
  const completedCount = recommendations.filter(r => r.completed).length;
  const pendingCount = recommendations.length - completedCount;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/20 border-error';
      case 'medium': return 'text-warning bg-warning/20 border-warning';
      default: return 'text-text-secondary bg-surface border-border';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="text-error" size={20} />;
      case 'medium': return <Clock className="text-warning" size={20} />;
      default: return <CheckCircle className="text-success" size={20} />;
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Personalized Recommendations
        </h2>
        <p className="text-text-secondary">
          Track your progress and discover what you can do next to improve your disaster preparedness.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="font-medium text-text-secondary">Current Score</h3>
          <div className="text-2xl font-bold text-primary">{latestScore}%</div>
        </div>
        <div className="card p-4">
          <h3 className="font-medium text-text-secondary">Completed Actions</h3>
          <div className="text-2xl font-bold text-success">{completedCount}</div>
        </div>
        <div className="card p-4">
          <h3 className="font-medium text-text-secondary">Pending Actions</h3>
          <div className="text-2xl font-bold text-warning">{pendingCount}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'recommendations', label: 'Recommendations', icon: Target },
              { id: 'assessments', label: 'Assessment History', icon: Calendar },
              { id: 'achievements', label: 'Achievements', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Personalized Action Items</h3>
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.completed ? 'bg-success/5 border-l-success' : getPriorityColor(rec.priority)
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {rec.completed ? <CheckCircle className="text-success" size={20} /> : getPriorityIcon(rec.priority)}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold ${rec.completed ? 'text-success line-through' : 'text-text-primary'}`}>
                          {rec.title}
                        </h4>
                        <p className="text-text-secondary text-sm mt-1">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Assessment History</h3>
              {assessmentHistory.map((assessment) => (
                <div key={assessment.id} className="p-4 bg-surface rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg" style={{ color: assessment.score < 60 ? '#FFA000' : '#43A047' }}>
                        {assessment.score}%
                      </p>
                      <div className="text-sm text-text-secondary">
                        {/* Correctly format the date */}
                        {format(new Date(assessment.created_at), 'MMM dd, yyyy • HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
