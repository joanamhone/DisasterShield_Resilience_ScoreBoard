import React, { useState } from 'react'
import { Target, CheckCircle, Clock, AlertCircle, TrendingUp, Award, Calendar } from 'lucide-react'
import { useReadiness } from '../contexts/ReadinessContext'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'

const Recommendations: React.FC = () => {
  const { assessmentHistory, currentScore } = useReadiness()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'recommendations' | 'assessments' | 'achievements'>('recommendations')

  // Mock personalized recommendations based on user role and score
  const getPersonalizedRecommendations = () => {
    const baseRecommendations = [
      {
        id: 1,
        title: 'Update Emergency Kit',
        description: 'Your emergency kit needs fresh water and food supplies',
        priority: 'high' as const,
        category: 'Emergency Supplies',
        estimatedTime: '2 hours',
        impact: '+8 points',
        completed: false
      },
      {
        id: 2,
        title: 'Practice Evacuation Route',
        description: 'Conduct a family evacuation drill to test your emergency plan',
        priority: 'medium' as const,
        category: 'Emergency Planning',
        estimatedTime: '1 hour',
        impact: '+6 points',
        completed: false
      },
      {
        id: 3,
        title: 'First Aid Training',
        description: 'Complete basic first aid and CPR certification',
        priority: 'medium' as const,
        category: 'Skills Development',
        estimatedTime: '4 hours',
        impact: '+12 points',
        completed: true
      }
    ]

    // Add role-specific recommendations
    const roleSpecificRecommendations = []
    
    if (user?.userType === 'community_leader') {
      roleSpecificRecommendations.push({
        id: 4,
        title: 'Organize Community Drill',
        description: 'Schedule and conduct a community-wide emergency drill',
        priority: 'high' as const,
        category: 'Community Leadership',
        estimatedTime: '3 hours',
        impact: '+15 points',
        completed: false
      })
    }
    
    if (user?.userType === 'school_admin') {
      roleSpecificRecommendations.push({
        id: 5,
        title: 'Update School Emergency Plan',
        description: 'Review and update school evacuation procedures',
        priority: 'high' as const,
        category: 'School Safety',
        estimatedTime: '2 hours',
        impact: '+10 points',
        completed: false
      })
    }

    return [...baseRecommendations, ...roleSpecificRecommendations]
  }

  const recommendations = getPersonalizedRecommendations()
  const completedCount = recommendations.filter(r => r.completed).length
  const pendingCount = recommendations.filter(r => !r.completed).length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-error bg-error/20 border-error'
      case 'medium':
        return 'text-warning bg-warning/20 border-warning'
      case 'low':
        return 'text-accent bg-accent/20 border-accent'
      default:
        return 'text-text-secondary bg-surface border-border'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="text-error" size={20} />
      case 'medium':
        return <Clock className="text-warning" size={20} />
      case 'low':
        return <Target className="text-accent" size={20} />
      default:
        return <CheckCircle className="text-success" size={20} />
    }
  }

  const mockAchievements = [
    {
      id: 1,
      title: 'First Assessment Complete',
      description: 'Completed your first readiness assessment',
      earned: true,
      earnedDate: '2024-01-15',
      icon: '🎯'
    },
    {
      id: 2,
      title: 'Emergency Kit Builder',
      description: 'Built your first emergency kit',
      earned: true,
      earnedDate: '2024-01-20',
      icon: '📦'
    },
    {
      id: 3,
      title: 'Consistent Improver',
      description: 'Improved readiness score 3 times in a row',
      earned: false,
      earnedDate: null,
      icon: '📈'
    },
    {
      id: 4,
      title: 'Well Prepared',
      description: 'Achieved readiness score above 80%',
      earned: false,
      earnedDate: null,
      icon: '🏆'
    }
  ]

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Personalized Recommendations
        </h2>
        <p className="text-text-secondary">
          Track your progress and discover what you can do next to improve your disaster preparedness
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Current Score</h3>
            <TrendingUp className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold text-primary">{currentScore}%</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Completed Actions</h3>
            <CheckCircle className="text-success" size={20} />
          </div>
          <div className="text-2xl font-bold text-success">{completedCount}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Pending Actions</h3>
            <Clock className="text-warning" size={20} />
          </div>
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
              const Icon = tab.icon
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
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Personalized Action Items</h3>
              <div className="space-y-4">
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
                          {rec.completed ? (
                            <CheckCircle className="text-success" size={20} />
                          ) : (
                            getPriorityIcon(rec.priority)
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold ${rec.completed ? 'text-success line-through' : 'text-text-primary'}`}>
                            {rec.title}
                          </h4>
                          <p className="text-text-secondary text-sm mt-1 leading-relaxed">
                            {rec.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-text-tertiary">
                            <span className="bg-surface px-2 py-1 rounded-full">
                              {rec.category}
                            </span>
                            <span>⏱️ {rec.estimatedTime}</span>
                            <span className="text-success font-medium">{rec.impact}</span>
                          </div>
                        </div>
                      </div>
                      {!rec.completed && (
                        <button className="btn-primary text-sm">
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Assessment History</h3>
              {assessmentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto mb-3 text-text-tertiary" size={48} />
                  <p className="text-text-secondary">No assessments completed yet</p>
                  <button className="btn-primary mt-4">Take Your First Assessment</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {assessmentHistory.map((assessment) => (
                    <div key={assessment.id} className="p-4 bg-surface rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assessment.type === 'seasonal' 
                                ? 'bg-secondary/20 text-secondary' 
                                : 'bg-primary/20 text-primary'
                            }`}>
                              {assessment.type === 'seasonal' ? 'Seasonal' : 'General'}
                            </span>
                            <span className="font-bold text-lg" style={{ 
                              color: assessment.score < 30 ? '#D32F2F' :
                                     assessment.score < 60 ? '#FFA000' :
                                     assessment.score < 80 ? '#F57C00' : '#43A047'
                            }}>
                              {assessment.score}%
                            </span>
                          </div>
                          <div className="text-sm text-text-secondary">
                            {assessment.location && assessment.season ? (
                              <>{assessment.location} • {assessment.season.charAt(0).toUpperCase() + assessment.season.slice(1)}</>
                            ) : (
                              'General Assessment'
                            )}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            {format(assessment.date, 'MMM dd, yyyy • HH:mm')}
                          </div>
                        </div>
                        <button className="text-primary text-sm hover:underline">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Achievements & Milestones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAchievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned 
                        ? 'border-success bg-success/10' 
                        : 'border-border bg-surface'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold ${
                          achievement.earned ? 'text-text-primary' : 'text-text-secondary'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-text-secondary mb-1">
                          {achievement.description}
                        </p>
                        {achievement.earned && achievement.earnedDate && (
                          <p className="text-xs text-success">
                            Earned on {format(new Date(achievement.earnedDate), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                      {achievement.earned && (
                        <Award className="text-success" size={20} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recommendations