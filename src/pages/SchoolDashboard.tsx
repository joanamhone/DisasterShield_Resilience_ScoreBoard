import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReadinessScore from '../components/home/ReadinessScore';
import RecentAlerts from '../components/home/RecentAlerts';
import RiskSummary from '../components/home/RiskSummary';
import { 
  Users, 
  Shield, 
  FileText, 
  Calendar,
  AlertTriangle,
  Activity,
  Bell,
  BookOpen,
  UserCheck,
  Building
} from 'lucide-react';

const SchoolDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const schoolStats = [
    { label: 'Students', value: '450', icon: Users, color: 'text-blue-600' },
    { label: 'Staff Members', value: '35', icon: UserCheck, color: 'text-green-600' },
    { label: 'School Readiness', value: '78%', icon: Shield, color: 'text-purple-600' },
    { label: 'Emergency Drills', value: '4', icon: Calendar, color: 'text-orange-600' }
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
      description: 'View your school administration progress',
      icon: Activity,
      color: 'bg-green-500',
      onClick: () => navigate('/progress')
    },
    {
      title: 'Emergency Kit Build',
      description: 'Build school emergency kits',
      icon: Bell,
      color: 'bg-orange-500',
      onClick: () => navigate('/emergency-kit')
    }
  ];

  const staffTasks = [
    { id: 1, task: 'Update evacuation routes', assignee: 'John Smith', status: 'Completed', dueDate: '2024-01-15' },
    { id: 2, task: 'Conduct fire drill training', assignee: 'Sarah Johnson', status: 'In Progress', dueDate: '2024-01-20' },
    { id: 3, task: 'Review emergency contacts', assignee: 'Mike Davis', status: 'Pending', dueDate: '2024-01-25' }
  ];

  const emergencyPlans = [
    { id: 1, name: 'Fire Emergency Plan', lastUpdated: '2024-01-10', status: 'Current' },
    { id: 2, name: 'Earthquake Response Plan', lastUpdated: '2024-01-08', status: 'Current' },
    { id: 3, name: 'Lockdown Procedures', lastUpdated: '2023-12-15', status: 'Needs Update' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName || 'School Administrator'}
        </h1>
        <p className="text-gray-600">
          School Administration Dashboard - {user?.location || 'Your School'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {schoolStats.map((stat, index) => (
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
            onClick={() => navigate('/assessment?type=school')}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
          >
            <Building className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">School Readiness Check</h3>
            <p className="text-sm text-gray-600">Assess overall school preparedness</p>
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

      {/* School Management Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Emergency Plans
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Staff Tasks
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Student Safety
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Document Vault
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Emergency Response Plans</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Add New Plan
              </button>
            </div>
            
            {emergencyPlans.map((plan) => (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{plan.name}</h4>
                      <p className="text-sm text-gray-600">Last updated: {plan.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      plan.status === 'Current' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {plan.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Task Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Staff Task Assignment</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
            Assign New Task
          </button>
        </div>
        
        <div className="space-y-3">
          {staffTasks.map((task) => (
            <div key={task.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{task.task}</h4>
                  <p className="text-sm text-gray-600">Assigned to: {task.assignee}</p>
                  <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;
