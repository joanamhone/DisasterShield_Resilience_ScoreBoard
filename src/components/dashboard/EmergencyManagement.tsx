// src/components/dashboard/EmergencyManagement.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ReadinessScore from '../home/ReadinessScore'; 
import RecentAlerts from '../home/RecentAlerts';     
import RiskSummary from '../home/RiskSummary';       
import {
  AlertTriangle, MapPin, Users, Activity, BarChart3,
  Shield, TrendingUp, Bell, Radio, Megaphone
} from 'lucide-react';
import { clsx } from 'clsx';

const EmergencyManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'resources' | 'analytics'>('overview');

  // --- Data from original EmergencyManagement ---

  const activeAlertsTab = [
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

  // --- Data from DisasterCoordinatorDashboard ---
  const coordinatorStats = [
    { label: 'Regions Managed', value: '5', icon: MapPin, color: 'text-blue-600' },
    { label: 'Communities', value: '28', icon: Users, color: 'text-green-600' },
    { label: 'Schools', value: '12', icon: Shield, color: 'text-purple-600' },
    { label: 'Active Alerts', value: '3', icon: AlertTriangle, color: 'text-red-600' }
  ];

  const quickActionsCoordinator = [
    {
      title: 'Send Regional Alert',
      description: 'Broadcast urgent messages to the community',
      icon: Megaphone,
      color: 'bg-red-600',
      onClick: () => navigate('/alerts')
    },
    {
      title: 'View Risk Map',
      description: 'Go to the comprehensive risk assessment',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      onClick: () => navigate('/assessment')
    },
    {
      title: 'Your Readiness',
      description: 'Check your personal readiness status',
      icon: Shield,
      color: 'bg-blue-500',
      onClick: () => navigate('/readiness')
    },
    {
      title: 'View All Alerts',
      description: 'View and manage all active alerts',
      icon: Bell,
      color: 'bg-red-500',
      onClick: () => navigate('/all-alerts')
    },
    {
      title: 'Affected Population',
      description: 'Monitor district-wise impact statistics',
      icon: Users,
      color: 'bg-orange-500',
      onClick: () => navigate('/affected-population')
    },
    {
      title: 'Response Teams',
      description: 'Manage team deployments and status',
      icon: Radio,
      color: 'bg-green-500',
      onClick: () => navigate('/response-teams')
    }
  ];

  const recentAlertsMain = [
    { id: 1, type: 'Flood Warning', location: 'District A', time: '2 hours ago', severity: 'High' },
    { id: 2, type: 'Storm Alert', location: 'District B', time: '4 hours ago', severity: 'Medium' },
    { id: 3, type: 'Heat Wave', location: 'District C', time: '6 hours ago', severity: 'Low' }
  ];

  // --- Helper Functions ---
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'text-error bg-error/20 border-error';
      case 'medium':
        return 'text-warning bg-warning/20 border-warning';
      case 'low':
        return 'text-accent bg-accent/20 border-accent';
      default:
        return 'text-text-secondary bg-surface border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'text-error bg-error/20';
      case 'high':
        return 'text-warning bg-warning/20';
      case 'medium':
        return 'text-accent bg-accent/20';
      default:
        return 'text-text-secondary bg-surface';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName || 'Disaster Coordinator'}
          </h1>
          <p className="text-gray-600">
            Regional Emergency Management Dashboard - {user?.location || 'Your Region'}
          </p>
        </div>
        <button
          onClick={() => navigate('/alerts')}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
        >
          <Megaphone className="h-5 w-5" />
          Send Regional Alert
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coordinatorStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Core Dashboard Components (These components are now properly imported!) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReadinessScore score={0} />
        <RecentAlerts />
        <RiskSummary />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActionsCoordinator.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
          <button
            onClick={() => navigate('/all-alerts')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentAlertsMain.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`h-5 w-5 ${
                  alert.severity === 'High' ? 'text-red-500' :
                  alert.severity === 'Medium' ? 'text-orange-500' : 'text-yellow-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{alert.type}</p>
                  <p className="text-sm text-gray-600">{alert.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{alert.time}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  alert.severity === 'High' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'Medium' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {alert.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Original EmergencyManagement Tabs content */}
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
                className={clsx(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
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
                <button onClick={() => navigate('/floodriskmap')} className="btn-primary mt-4">View Full Map</button>
              </div>

              {/* Recent Activity (from original EmergencyManagement) */}
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
              {/* Regional Overview from DisasterCoordinatorDashboard is now part of this overview tab */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Regional Preparedness Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Overall Readiness</h3>
                    <p className="text-2xl font-bold text-blue-600">74%</p>
                    <p className="text-sm text-gray-600">Regional Average</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Response Time</h3>
                    <p className="text-2xl font-bold text-green-600">12 min</p>
                    <p className="text-sm text-gray-600">Average Response</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Population Covered</h3>
                    <p className="text-2xl font-bold text-purple-600">125K</p>
                    <p className="text-sm text-gray-600">Total Population</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Active Emergency Alerts</h3>
              <div className="space-y-4">
                {activeAlertsTab.map((alert) => (
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

export default EmergencyManagement;