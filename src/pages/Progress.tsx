import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useRoleAccess } from '../hooks/useRoleAccess'
import { useProgress } from '../hooks/useProgress'
import { useDrills } from '../hooks/useDrills'
import { useActivity } from '../hooks/useActivity'
import { TrendingUp, Calendar, Target, Award, ChevronRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { format, subDays } from 'date-fns'

const Progress: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { canAccessCommunityFeatures } = useRoleAccess()
  const { personalProgress, loading: progressLoading } = useProgress()
  const { completedDrills, loading: drillsLoading } = useDrills()
  const { stats, loading: activityLoading } = useActivity()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [activeTab, setActiveTab] = useState<'community' | 'personal'>('community')

  // Mock progress data
  const generateProgressData = () => {
    const now = new Date()
    let data: any[] = []
    
    switch (timeRange) {
      case 'week':
        for (let i = 6; i >= 0; i--) {
          const date = subDays(now, i)
          data.push({
            date: format(date, 'MMM dd'),
            score: Math.max(30, Math.min(100, 65 + (Math.random() - 0.5) * 20 + i * 2)),
            improvements: Math.floor(Math.random() * 3),
            assessments: i === 0 ? 1 : Math.random() > 0.7 ? 1 : 0
          })
        }
        break
      case 'month':
        for (let i = 29; i >= 0; i--) {
          const date = subDays(now, i)
          data.push({
            date: format(date, 'MMM dd'),
            score: Math.max(30, Math.min(100, 50 + (Math.random() - 0.3) * 30 + (29 - i) * 0.8)),
            improvements: Math.floor(Math.random() * 2),
            assessments: Math.random() > 0.8 ? 1 : 0
          })
        }
        break
      case 'year':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          data.push({
            date: format(date, 'MMM yyyy'),
            score: Math.max(30, Math.min(100, 40 + (Math.random() - 0.2) * 40 + (11 - i) * 3)),
            improvements: Math.floor(Math.random() * 8),
            assessments: Math.floor(Math.random() * 3) + 1
          })
        }
        break
    }
    
    return data
  }

  const progressData = generateProgressData()
  const currentScore = progressData[progressData.length - 1]?.score || 65
  const previousScore = progressData[progressData.length - 2]?.score || 60
  const scoreChange = currentScore - previousScore

  const achievements = [
    {
      id: 1,
      title: 'First Assessment',
      description: 'Completed your first readiness assessment',
      date: '2024-01-15',
      icon: '🎯',
      earned: true
    },
    {
      id: 2,
      title: 'Emergency Kit Builder',
      description: 'Built your first emergency kit',
      date: '2024-01-20',
      icon: '📦',
      earned: true
    },
    {
      id: 3,
      title: 'Consistent Improver',
      description: 'Improved readiness score 3 times in a row',
      date: '2024-02-01',
      icon: '📈',
      earned: true
    },
    {
      id: 4,
      title: 'Well Prepared',
      description: 'Achieved readiness score above 80%',
      date: null,
      icon: '🏆',
      earned: false
    },
    {
      id: 5,
      title: 'Community Helper',
      description: 'Shared preparedness tips with others',
      date: null,
      icon: '🤝',
      earned: false
    }
  ]

  const recentImprovements = [
    {
      id: 1,
      action: 'Added emergency water supply',
      impact: '+5 points',
      date: '2 days ago',
      category: 'Water & Food'
    },
    {
      id: 2,
      action: 'Updated evacuation plan',
      impact: '+8 points',
      date: '1 week ago',
      category: 'Planning'
    },
    {
      id: 3,
      action: 'Completed first aid training',
      impact: '+12 points',
      date: '2 weeks ago',
      category: 'Skills'
    },
    {
      id: 4,
      action: 'Installed smoke detectors',
      impact: '+6 points',
      date: '3 weeks ago',
      category: 'Safety Equipment'
    }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.dataKey === 'score' ? '%' : ''}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Loading state
  if (progressLoading || drillsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const availableCourses = [
    { id: 1, title: 'Emergency Response Leadership', duration: '4 hours', certification: true, completed: true },
    { id: 2, title: 'Community Risk Assessment', duration: '3 hours', certification: true, completed: false },
    { id: 3, title: 'Crisis Communication', duration: '2 hours', certification: false, completed: false }
  ]

  return (
    <div className="space-y-6 pb-6">
      {/* Header with current score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary">Current Score</h3>
            <TrendingUp className="text-primary" size={24} />
          </div>
          <div className="text-3xl font-bold text-primary mb-2">
            {Math.round(currentScore)}%
          </div>
          <div className={`flex items-center text-sm ${
            scoreChange >= 0 ? 'text-success' : 'text-error'
          }`}>
            <span>{scoreChange >= 0 ? '+' : ''}{Math.round(scoreChange)}%</span>
            <span className="ml-1">from last assessment</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary">Total Improvements</h3>
            <Target className="text-accent" size={24} />
          </div>
          <button 
            onClick={() => navigate('/recommendations')}
            className="text-3xl font-bold text-accent mb-2 hover:underline"
          >
            {recentImprovements.length}
          </button>
          <div className="text-sm text-text-secondary">
            Actions completed this month
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary">Achievements</h3>
            <Award className="text-warning" size={24} />
          </div>
          <button 
            onClick={() => navigate('/recommendations')}
            className="text-3xl font-bold text-warning mb-2 hover:underline"
          >
            {achievements.filter(a => a.earned).length}
          </button>
          <div className="text-sm text-text-secondary">
            Out of {achievements.length} available
          </div>
        </div>
      </div>

      {/* Tab Navigation for Community Leaders */}
      {canAccessCommunityFeatures() && (
        <div className="flex justify-center">
          <div className="flex bg-surface rounded-lg p-1">
            <button
              onClick={() => setActiveTab('community')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'community'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Community Progress
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Personal Progress
            </button>
          </div>
        </div>
      )}

      {/* Time range selector */}
      {(!canAccessCommunityFeatures() || activeTab === 'community') && (
        <div className="flex justify-center">
        <div className="flex bg-surface rounded-lg p-1">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Progress chart */}
      {(!canAccessCommunityFeatures() || activeTab === 'community') && (
        <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Readiness Score Progress</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="date" 
                stroke="#718096"
                fontSize={12}
                tick={{ fill: '#718096' }}
              />
              <YAxis 
                stroke="#718096"
                fontSize={12}
                tick={{ fill: '#718096' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#2E7D32" 
                strokeWidth={3}
                name="Readiness Score"
                dot={{ fill: '#2E7D32', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      )}

      {/* Recent improvements */}
      {(!canAccessCommunityFeatures() || activeTab === 'community') && (
        <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Recent Improvements</h3>
        <div className="space-y-4">
          {recentImprovements.map((improvement) => (
            <div key={improvement.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-text-primary mb-1">
                  {improvement.action}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <span>{improvement.date}</span>
                  <span className="bg-accent/20 text-accent px-2 py-1 rounded-full">
                    {improvement.category}
                  </span>
                </div>
              </div>
              <div className="text-success font-bold">
                {improvement.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Achievements */}
      {(!canAccessCommunityFeatures() || activeTab === 'community') && (
        <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
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
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-success">
                      Earned on {format(new Date(achievement.date), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
                {achievement.earned && (
                  <div className="text-success">
                    <Award size={20} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Personal Progress Tab for Community Leaders */}
      {canAccessCommunityFeatures() && activeTab === 'personal' && (
        <div className="space-y-6">
          {/* Personal Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-text-secondary">Courses Completed</h3>
                <Target className="text-primary" size={20} />
              </div>
              <div className="text-2xl font-bold text-primary">{personalProgress?.coursesCompleted || 0}</div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-text-secondary">Certifications</h3>
                <Award className="text-success" size={20} />
              </div>
              <div className="text-2xl font-bold text-success">{personalProgress?.certificationsEarned || 0}</div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-text-secondary">Drills Led</h3>
                <TrendingUp className="text-accent" size={20} />
              </div>
              <div className="text-2xl font-bold text-accent">{personalProgress?.drillsLed || 0}</div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-text-secondary">Engagement Score</h3>
                <TrendingUp className="text-warning" size={20} />
              </div>
              <div className="text-2xl font-bold text-warning">{personalProgress?.engagementScore || 0}%</div>
            </div>
          </div>

          {/* Completed Drills */}
          <div className="card p-6">
            <h3 className="font-bold text-text-primary mb-4">Drills You've Led</h3>
            <div className="space-y-4">
              {completedDrills.length > 0 ? completedDrills.map((drill) => (
                <div key={drill.id} className="p-4 bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary">{drill.title}</h4>
                    <span className="text-sm text-text-secondary">{format(new Date(drill.scheduled_date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Participants:</span>
                      <div className="font-medium text-text-primary">{drill.participants_count}</div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Type:</span>
                      <div className="font-medium text-success">{drill.drill_type}</div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Status:</span>
                      <div className="font-medium text-text-primary">{drill.status}</div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-text-secondary">
                  No completed drills yet. <button onClick={() => navigate('/schedule-drill')} className="text-primary hover:underline">Schedule your first drill</button>
                </div>
              )}
            </div>
          </div>

          {/* Learning Progress */}
          <div className="card p-6">
            <h3 className="font-bold text-text-primary mb-4">Learning Progress</h3>
            <div className="space-y-3">
              {availableCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{course.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      <span>{course.duration}</span>
                      {course.certification && <span className="text-accent">• Certification Available</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {course.completed ? (
                      <span className="text-success text-sm font-medium">Completed</span>
                    ) : (
                      <button 
                        onClick={() => navigate('/learning')}
                        className="btn-primary text-sm"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership Activities */}
          <div className="card p-6">
            <h3 className="font-bold text-text-primary mb-4">Leadership Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Workshops Held</span>
                  <Calendar className="text-primary" size={16} />
                </div>
                <div className="text-xl font-bold text-text-primary">{personalProgress?.workshopsHeld || 0}</div>
              </div>
              <div className="p-4 bg-surface rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Alerts Sent</span>
                  <TrendingUp className="text-warning" size={16} />
                </div>
                <div className="text-xl font-bold text-text-primary">{personalProgress?.alertsSent || 0}</div>
              </div>
              <div className="p-4 bg-surface rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Assessments Conducted</span>
                  <Target className="text-secondary" size={16} />
                </div>
                <div className="text-xl font-bold text-text-primary">{personalProgress?.assessmentsConducted || 0}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Progress
