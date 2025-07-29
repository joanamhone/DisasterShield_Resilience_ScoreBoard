import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ReadinessScore from '../home/ReadinessScore';
import RecentAlerts from '../home/RecentAlerts';
import RiskSummary from '../home/RiskSummary';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Activity,
  Bell,
  Shield,
  Megaphone
} from 'lucide-react';

const CommunityOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const communityStats = {
    totalMembers: 2475,
    averageReadiness: 72,
    activeAlerts: 3,
    upcomingDrills: 2
  };

  // Ensure these colors match standard Tailwind classes like 'bg-green-500', 'bg-red-500', etc.
  const readinessDistribution = [
    { label: 'Well Prepared (80-100%)', percentage: 75, color: 'bg-green-500' }, // Changed
    { label: 'Moderately Prepared (60-79%)', percentage: 20, color: 'bg-purple-500' }, // Changed
    { label: 'Needs Improvement (<60%)', percentage: 5, color: 'bg-red-500' } // Changed
  ];

  const recentActivity = [
    { id: 1, action: 'Emergency drill completed', participants: 45, date: '2 days ago' },
    { id: 2, action: 'Weather alert sent', recipients: 247, date: '1 week ago' },
    { id: 3, action: 'Preparedness workshop', participants: 32, date: '2 weeks ago' }
  ];

  const quickActions = [
    {
      title: 'View Risk Map',
      description: 'Explore geographic disaster risks in your area',
      icon: AlertTriangle,
      color: 'bg-red-500', // Changed
      onClick: () => navigate('/map')
    },
    {
      title: 'Track Progress',
      description: 'View your community leadership progress',
      icon: Activity,
      color: 'bg-green-500', // Changed
      onClick: () => navigate('/progress')
    },
    {
      title: 'Emergency Kit Build',
      description: 'Build community emergency kits',
      icon: Bell,
      color: 'bg-orange-500', // Changed
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
      {/* Header - Styled like CommunityDashboard with Alert Button */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-grey-900">
            Community Overview
          </h1>
          <p className="text-gray-600 mt-1">
            You’re managing <span className="font-semibold">{user?.location || 'Your Community'}</span> – stay proactive and keep your community safe.
          </p>
        </div>
        <button
          onClick={() => navigate('/alerts')}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
        >
          <Megaphone className="h-5 w-5" />
          Send Community Alert
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Community Members</p>
              <p className="text-2xl font-bold text-gray-900">{communityStats.totalMembers}</p>
            </div>
            <Users className={`h-8 w-8 text-blue-600`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Readiness</p>
              <p className="text-2xl font-bold text-gray-900">{communityStats.averageReadiness}%</p>
            </div>
            <TrendingUp className={`h-8 w-8 text-green-600`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Drills</p>
              <p className="text-2xl font-bold text-gray-900">{communityStats.upcomingDrills}</p>
            </div>
            <Calendar className={`h-8 w-8 text-purple-600`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{communityStats.activeAlerts}</p>
            </div>
            <AlertTriangle className={`h-8 w-8 text-red-600`} />
          </div>
        </div>
      </div>

      {/* Core Dashboard Components (ReadinessScore, RecentAlerts, RiskSummary) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReadinessScore />
        <RecentAlerts />
        <RiskSummary />
      </div>

      {/* Community Readiness Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Community Readiness Distribution
        </h3>
        <div className="space-y-3">
          {readinessDistribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.label}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 h-2 rounded-full">
                  <div
                    // Corrected this line to use the direct color from item.color
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Choose Assessment */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/readiness')}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
          >
            <Shield className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Personal Assessment</h3>
            <p className="text-sm text-gray-600">Take your individual readiness assessment</p>
          </button>
          <button
            onClick={() => navigate('/readiness?type=community')}
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
              <div
                // Corrected this line to use the direct color from action.color
                className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}
              >
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Community Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Community Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900">{activity.action}</h4>
                <p className="text-sm text-gray-600">
                  {activity.participants
                    ? `${activity.participants} participants`
                    : `${activity.recipients} recipients`}
                </p>
              </div>
              <span className="text-sm text-gray-500">{activity.date}</span>
            </div>
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
                      <span className="text-sm text-gray-600">
                        Readiness: {household.readiness}%
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          household.risk === 'High'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
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
                      <span className="text-sm font-medium text-gray-900">
                        {household.readiness}%
                      </span>
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

export default CommunityOverview;