import React, { useState } from 'react'
import { AlertTriangle, Bell, Filter, Search, MapPin, Clock, Users } from 'lucide-react'
import { format, subDays, subHours } from 'date-fns'

interface Alert {
  id: string
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'weather' | 'fire' | 'flood' | 'earthquake' | 'general'
  location: string
  affectedPopulation: number
  timestamp: Date
  status: 'active' | 'resolved' | 'monitoring'
}

const AllAlerts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Mock alerts data
  const allAlerts: Alert[] = [
    {
      id: '1',
      title: 'Severe Weather Warning',
      message: 'Heavy rainfall and strong winds expected in downtown area. Residents should avoid unnecessary travel.',
      severity: 'high',
      type: 'weather',
      location: 'Downtown District',
      affectedPopulation: 3500,
      timestamp: subHours(new Date(), 2),
      status: 'active'
    },
    {
      id: '2',
      title: 'Flood Risk Alert',
      message: 'Rising water levels detected near riverside communities. Evacuation may be necessary.',
      severity: 'critical',
      type: 'flood',
      location: 'Riverside Area',
      affectedPopulation: 1200,
      timestamp: subHours(new Date(), 4),
      status: 'active'
    },
    {
      id: '3',
      title: 'Air Quality Advisory',
      message: 'Air quality has improved to moderate levels. Outdoor activities can resume with caution.',
      severity: 'medium',
      type: 'general',
      location: 'Industrial Zone',
      affectedPopulation: 2800,
      timestamp: subHours(new Date(), 6),
      status: 'monitoring'
    },
    {
      id: '4',
      title: 'Wildfire Watch',
      message: 'Dry conditions and high winds create elevated fire risk. Fire restrictions in effect.',
      severity: 'high',
      type: 'fire',
      location: 'Forest Hills',
      affectedPopulation: 850,
      timestamp: subHours(new Date(), 8),
      status: 'active'
    },
    {
      id: '5',
      title: 'Power Outage Resolved',
      message: 'Electrical service has been restored to all affected areas. Normal operations resumed.',
      severity: 'low',
      type: 'general',
      location: 'North District',
      affectedPopulation: 5200,
      timestamp: subDays(new Date(), 1),
      status: 'resolved'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error/20 border-error'
      case 'high':
        return 'text-warning bg-warning/20 border-warning'
      case 'medium':
        return 'text-accent bg-accent/20 border-accent'
      case 'low':
        return 'text-success bg-success/20 border-success'
      default:
        return 'text-text-secondary bg-surface border-border'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-error bg-error/20'
      case 'monitoring':
        return 'text-warning bg-warning/20'
      case 'resolved':
        return 'text-success bg-success/20'
      default:
        return 'text-text-secondary bg-surface'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return '🌩️'
      case 'fire':
        return '🔥'
      case 'flood':
        return '🌊'
      case 'earthquake':
        return '🌍'
      default:
        return '⚠️'
    }
  }

  // Filter alerts based on search and filters
  const filteredAlerts = allAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
    const matchesType = filterType === 'all' || alert.type === filterType
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus
    
    return matchesSearch && matchesSeverity && matchesType && matchesStatus
  })

  const activeAlertsCount = allAlerts.filter(a => a.status === 'active').length
  const totalAffected = allAlerts.filter(a => a.status === 'active').reduce((sum, a) => sum + a.affectedPopulation, 0)

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-error/10 to-warning/10 border-error/20">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          All Emergency Alerts
        </h2>
        <p className="text-text-secondary">
          Monitor and manage all emergency alerts across your region
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Active Alerts</h3>
            <AlertTriangle className="text-error" size={20} />
          </div>
          <div className="text-2xl font-bold text-error">{activeAlertsCount}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Total Affected</h3>
            <Users className="text-warning" size={20} />
          </div>
          <div className="text-2xl font-bold text-warning">{totalAffected.toLocaleString()}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Total Alerts</h3>
            <Bell className="text-accent" size={20} />
          </div>
          <div className="text-2xl font-bold text-accent">{allAlerts.length}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="weather">Weather</option>
              <option value="fire">Fire</option>
              <option value="flood">Flood</option>
              <option value="earthquake">Earthquake</option>
              <option value="general">General</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="card p-8 text-center">
            <Bell className="mx-auto mb-3 text-text-tertiary" size={48} />
            <p className="text-text-secondary">No alerts match your current filters</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={`card p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-2xl mt-1">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-text-primary">{alert.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-text-secondary mb-3 leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-text-tertiary">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{alert.affectedPopulation.toLocaleString()} affected</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{format(alert.timestamp, 'MMM dd, HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-secondary text-sm">
                    View Details
                  </button>
                  {alert.status === 'active' && (
                    <button className="btn-primary text-sm">
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AllAlerts