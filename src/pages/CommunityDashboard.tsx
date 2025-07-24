import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReadinessScore from '../components/home/ReadinessScore';
import RecentAlerts from '../components/home/RecentAlerts';
import RiskSummary from '../components/home/RiskSummary';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MessageSquare,
  Shield,
  Activity,
  Bell
} from 'lucide-react';

const CommunityDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const communityStats = [
    { label: 'Community Members', value: '247', icon: Users, color: 'text-blue-600' },
    { label: 'Average Readiness', value: '72%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Active Drills', value: '3', icon: Calendar, color: 'text-purple-600' },
    { label: 'Recent Alerts', value: '5', icon: AlertTriangle, color: 'text-red-600' }
  ];

  const quickActions = [
    {
      title: 'Take Assessment',
      description: 'Complete your personal readiness assessment',
      icon: Shield,
      color: 'bg-blue-500',
      onClick: () => navigate('/assessment')
    },
    {
      title: 'Track Progress',
      description: 'View your community leadership progress',
      icon: Activity,
      color: 'bg-green-500',
      onClick: () => navigate('/progress')
    },
    {
      title: 'Emergency Kit Build',
      description: 'Build community emergency kits',
      icon: Bell,
      color: 'bg-orange-500',
      onClick: () => navigate('/emergency-kit')
    }
  ];

  const vulnerableHouseholds = [
    { id: 1, address: '123 Oak Street', readiness: 35, risk: 'High', lastContact: '3 days ago' },
    { id: 2, address: '456 Pine Avenue', readiness: 42, risk: 'High', lastContact: '1 week ago' },
    { id: 3, address: '789 Elm Drive', readiness: 58, risk: 'Medium', lastContact: '2 days ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName || 'Community Leader'}
        </h1>
        <p className="text-gray-600">
          Community Leadership Dashboard - {user?.location || 'Your Community'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communityStats.map((stat, index) => (
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

      {/* Core Dashboard Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReadinessScore />
        <RecentAlerts />
        <RiskSummary />
      </div>

      {/* Choose Assessment */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/assessment')}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
          >
            <Shield className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Personal Assessment</h3>
            <p className="text-sm text-gray-600">Take your individual readiness assessment</p>
          </button>
          <button
            onClick={() => navigate('/assessment?type=community')}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
          >
            <Users className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Community Readiness Check</h3>
            <p className="text-sm text-gray-600">Assess overall community preparedness</p>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Community Management Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Vulnerable Households
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Group Coordination
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Community Bulletin
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Engagement Tracking
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Households Needing Support</h3>
              <span className="text-sm text-gray-500">3 households identified</span>
            </div>
            
            {vulnerableHouseholds.map((household) => (
              <div key={household.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{household.address}</h4>
                    <p className="text-sm text-gray-600">Last contact: {household.lastContact}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Readiness: {household.readiness}%</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        household.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {household.risk} Risk
                      </span>
                    </div>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                      Contact Household
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Needs Improvement (&lt;60%)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 h-2 rounded-full">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${household.readiness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{household.readiness}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDashboard;
