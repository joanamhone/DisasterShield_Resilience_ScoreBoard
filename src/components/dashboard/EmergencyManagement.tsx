import React, { useState } from 'react'
import { AlertTriangle, MapPin, Users, Activity, Send, Eye, BarChart3 } from 'lucide-react'

const EmergencyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'resources' | 'analytics'>('overview')

  // Mock emergency management data
  const emergencyStats = {
    activeAlerts: 7,
    affectedPopulation: 12500,
    resourceRequests: 23,
    responseTeams: 8
  }

  const activeAlerts = [
    { 
      id: 1, 
      title: 'Severe Weather Warning', 
      severity: 'high', 
      location: 'Downtown District', 
      affected: 3500,
      status: 'active',
      timeAgo: '2 hours ago'
    },
    { 
      id: 2, 
      title: 'Flood Risk Alert', 
      severity: 'critical', 
      location: 'Riverside Area', 
      affected: 1200,
      status: 'active',
      timeAgo: '4 hours ago'
    },
    { 
      id: 3, 
      title: 'Air Quality Advisory', 
      severity: 'medium', 
      location: 'Industrial Zone', 
      affected: 2800,
      status: 'monitoring',
      timeAgo: '6 hours ago'
    }
  ]

  const resourceRequests = [
    { id: 1, type: 'Medical Supplies', location: 'Community Center A', priority: 'high', requested: '50 units' },
    { id: 2, type: 'Emergency Shelter', location: 'School District 5', priority: 'critical', requested: '200 beds' },
    { id: 3, type: 'Food & Water', location: 'Riverside Evacuation', priority: 'high', requested: '500 meals' }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error/20 border-error'
      case 'high':
        return 'text-warning bg-warning/20 border-warning'
      case 'medium':
        return 'text-accent bg-accent/20 border-accent'
      default:
        return 'text-text-secondary bg-surface border-border'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-error bg-error/20'
      case 'high':
        return 'text-warning bg-warning/20'
      case 'medium':
        return 'text-accent bg-accent/20'
      default:
        return 'text-text-secondary bg-surface'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Emergency Management Center</h2>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <Eye size={16} className="mr-2" />
            View Risk Map
          </button>
          <button className="btn-primary">
            <Send size={16} className="mr-2" />
            Send Alert
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Active Alerts</h3>
            <AlertTriangle className="text-error" size={20} />
          </div>
          <div className="text-2xl font-bold text-error">{emergencyStats.activeAlerts}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Affected Population</h3>
            <Users className="text-warning" size={20} />
          </div>
          <div className="text-2xl font-bold text-warning">{emergencyStats.affectedPopulation.toLocaleString()}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Resource Requests</h3>
            <Activity className="text-accent" size={20} />
          </div>
          <div className="text-2xl font-bold text-accent">{emergencyStats.resourceRequests}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Response Teams</h3>
            <Users className="text-success" size={20} />
          </div>
          <div className="text-2xl font-bold text-success">{emergencyStats.responseTeams}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'alerts', label: 'Active Alerts' },
              { id: 'resources', label: 'Resources' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="font-bold text-text-primary">Regional Risk Overview</h3>
              
              {/* Risk Heatmap Placeholder */}
              <div className="bg-surface rounded-lg p-8 text-center">
                <MapPin className="mx-auto mb-4 text-text-tertiary" size={48} />
                <h4 className="font-medium text-text-primary mb-2">Live Risk Heatmap</h4>
                <p className="text-text-secondary">Interactive map showing current risk levels across regions</p>
                <button className="btn-primary mt-4">View Full Map</button>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-medium text-text-primary mb-3">Recent Emergency Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-error rounded-full"></div>
                      <span className="text-sm">Flood alert issued for Riverside Area</span>
                    </div>
                    <span className="text-xs text-text-tertiary">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm">Emergency shelter activated at Community Center</span>
                    </div>
                    <span className="text-xs text-text-tertiary">6 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-sm">Weather warning updated for Downtown District</span>
                    </div>
                    <span className="text-xs text-text-tertiary">8 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Active Emergency Alerts</h3>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className={`border-l-4 p-4 bg-surface rounded-lg ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-bold text-text-primary">{alert.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-text-secondary mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{alert.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users size={14} />
                            <span>{alert.affected.toLocaleString()} affected</span>
                          </div>
                        </div>
                        <p className="text-xs text-text-tertiary">{alert.timeAgo}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn-secondary text-sm">Update</button>
                        <button className="btn-primary text-sm">Manage</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Resource Management</h3>
              <div className="space-y-4">
                {resourceRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-surface rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-text-primary">{request.type}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{request.location}</span>
                          </div>
                          <span>Requested: {request.requested}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn-secondary text-sm">Assign</button>
                        <button className="btn-primary text-sm">Fulfill</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="font-bold text-text-primary">Emergency Response Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-4">
                  <h4 className="font-medium text-text-primary mb-3">Response Time Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Response Time</span>
                      <span className="font-medium">12 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Alert Acknowledgment</span>
                      <span className="font-medium">3 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Resource Deployment</span>
                      <span className="font-medium">18 minutes</span>
                    </div>
                  </div>
                </div>

                <div className="card p-4">
                  <h4 className="font-medium text-text-primary mb-3">Alert Effectiveness</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Alerts Sent (24h)</span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Acknowledgment Rate</span>
                      <span className="font-medium text-success">94%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Action Taken Rate</span>
                      <span className="font-medium text-success">87%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-text-primary">Export Data</h4>
                  <BarChart3 className="text-text-secondary" size={20} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="btn-secondary">Export Alert Data</button>
                  <button className="btn-secondary">Export Response Metrics</button>
                  <button className="btn-secondary">Export Assessment Data</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmergencyManagement