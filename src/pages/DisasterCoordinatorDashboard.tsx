import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Activity,
  TrendingUp,
  Bell,
  Settings,
  FileText,
  Radio
} from 'lucide-react';

const DisasterCoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Regions Managed', value: '5', icon: MapPin, color: 'text-blue-600' },
    { label: 'Communities', value: '28', icon: Users, color: 'text-green-600' },
    { label: 'Schools', value: '12', icon: Shield, color: 'text-purple-600' },
    { label: 'Active Alerts', value: '3', icon: AlertTriangle, color: 'text-red-600' }
  ];

  const quickActions = [
    {
      title: 'Your Readiness',
      description: 'Check your personal readiness status',
      icon: Shield,
      color: 'bg-blue-500',
      onClick: () => navigate('/readiness')
    },
    {
      title: 'Active Alerts',
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

  const recentAlerts = [
    { id: 1, type: 'Flood Warning', location: 'District A', time: '2 hours ago', severity: 'High' },
    { id: 2, type: 'Storm Alert', location: 'District B', time: '4 hours ago', severity: 'Medium' },
    { id: 3, type: 'Heat Wave', location: 'District C', time: '6 hours ago', severity: 'Low' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName || 'Disaster Coordinator'}
        </h1>
        <p className="text-gray-600">
          Regional Emergency Management Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
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
          {recentAlerts.map((alert) => (
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

      {/* Regional Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Regional Overview</h2>
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
  );
};

export default DisasterCoordinatorDashboard;
