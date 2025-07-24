import React from 'react'
import { Users, TrendingUp, AlertTriangle, Calendar } from 'lucide-react'

const CommunityOverview: React.FC = () => {
  // Mock community data
  const communityStats = {
    totalMembers: 247,
    averageReadiness: 72,
    activeAlerts: 3,
    upcomingDrills: 2,
    vulnerableHouseholds: 15
  }

  const recentActivity = [
    { id: 1, action: 'Emergency drill completed', participants: 45, date: '2 days ago' },
    { id: 2, action: 'Weather alert sent', recipients: 247, date: '1 week ago' },
    { id: 3, action: 'Preparedness workshop', participants: 32, date: '2 weeks ago' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Community Overview</h2>
        <button className="btn-primary">
          Send Community Alert
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Total Members</h3>
            <Users className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold text-text-primary">{communityStats.totalMembers}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Avg. Readiness</h3>
            <TrendingUp className="text-success" size={20} />
          </div>
          <div className="text-2xl font-bold text-success">{communityStats.averageReadiness}%</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Active Alerts</h3>
            <AlertTriangle className="text-warning" size={20} />
          </div>
          <div className="text-2xl font-bold text-warning">{communityStats.activeAlerts}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Upcoming Drills</h3>
            <Calendar className="text-accent" size={20} />
          </div>
          <div className="text-2xl font-bold text-accent">{communityStats.upcomingDrills}</div>
        </div>
      </div>

      {/* Community Readiness Score */}
      <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Community Readiness Distribution</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Well Prepared (80-100%)</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-border h-2 rounded-full">
                <div className="w-3/4 bg-success h-2 rounded-full"></div>
              </div>
              <span className="text-sm font-medium">75%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Moderately Prepared (60-79%)</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-border h-2 rounded-full">
                <div className="w-1/5 bg-accent h-2 rounded-full"></div>
              </div>
              <span className="text-sm font-medium">20%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Needs Improvement (&lt;60%)</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-border h-2 rounded-full">
                <div className="w-1/20 bg-error h-2 rounded-full"></div>
              </div>
              <span className="text-sm font-medium">5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Recent Community Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">{activity.action}</h4>
                <p className="text-sm text-text-secondary">
                  {activity.participants ? `${activity.participants} participants` : `${activity.recipients} recipients`}
                </p>
              </div>
              <span className="text-sm text-text-tertiary">{activity.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommunityOverview