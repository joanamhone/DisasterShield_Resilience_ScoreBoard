// src/components/dashboard/SchoolManagement.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Path adjusted: from components/dashboard, need to go up two levels to src/, then into contexts/
import ReadinessScore from '../home/ReadinessScore'; // Path adjusted: from components/dashboard, go up to components/, then into home/
import RecentAlerts from '../home/RecentAlerts';     // Path adjusted
import RiskSummary from '../home/RiskSummary';       // Path adjusted
import {
  School, Users, FileText, CheckCircle,  AlertTriangle, AlertCircle, Upload,
  Shield, Calendar, Activity, Bell, UserCheck, Building
} from 'lucide-react';
import { clsx } from 'clsx';

const SchoolManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'staff' | 'students'>('overview');

  const schoolStats = [
    { label: 'Students', value: '460', icon: Users, color: 'text-blue-600' },
    { label: 'Staff Members', value: '35', icon: UserCheck, color: 'text-green-600' },
    { label: 'School Readiness', value: '88%', icon: Shield, color: 'text-purple-600' },
    { label: 'Emergency Plans', value: '5', icon: FileText, color: 'text-orange-600' }
  ];

  const staffTasks = [
    { id: 1, name: 'Fire Drill Coordinator', assignee: 'Ms. Johnson', status: 'completed', dueDate: '2024-01-15' },
    { id: 2, name: 'First Aid Kit Check', assignee: 'Mr. Smith', status: 'pending', dueDate: '2024-01-20' },
    { id: 3, name: 'Evacuation Route Update', assignee: 'Mrs. Davis', status: 'in-progress', dueDate: '2024-01-25' },
    { id: 4, name: 'Conduct fire drill training', assignee: 'Sarah Johnson', status: 'In Progress', dueDate: '2024-01-20' },
    { id: 5, name: 'Review emergency contacts', assignee: 'Mike Davis', status: 'Pending', dueDate: '2024-01-25' }
  ];

  const emergencyPlans = [
    { id: 1, name: 'Fire Emergency Plan', lastUpdated: '2024-01-10', status: 'current' },
    { id: 2, name: 'Earthquake Response Plan', lastUpdated: '2024-01-05', status: 'current' },
    { id: 3, name: 'Lockdown Procedures', lastUpdated: '2023-12-20', status: 'needs-update' },
    { id: 4, name: 'Medical Emergency Plan', lastUpdated: '2024-01-08', status: 'current' },
    { id: 5, name: 'Severe Weather Plan', lastUpdated: '2023-11-15', status: 'needs-update' }
  ];

  const quickActions = [
    {
      title: 'View Risk Map',
      description: 'Explore geographic disaster risks in your area',
      icon: AlertTriangle,
      color: 'bg-red-500', // Changed
      onClick: () => navigate('/assessment')
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase().replace(' ', '-')) {
      case 'completed':
      case 'current':
        return 'text-success bg-success/20';
      case 'pending':
      case 'needs-update':
        return 'text-warning bg-warning/20';
      case 'in-progress':
        return 'text-accent bg-accent/20';
      default:
        return 'text-text-secondary bg-surface';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Merged from SchoolDashboard */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName || 'School Administrator'}
        </h1>
        <p className="text-gray-600">
          School Administration Dashboard - {user?.location || 'Your School'}
        </p>
      </div>

      {/* Stats Grid - Now uses the array structure from SchoolDashboard for cleaner mapping */}
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

      {/* Core Dashboard Components - from SchoolDashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReadinessScore />
        <RecentAlerts />
        <RiskSummary />
      </div>

      {/* Quick Actions - from SchoolDashboard */}
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

      {/* Choose Assessment - from SchoolDashboard */}
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
            onClick={() => navigate('/readiness?type=school')}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
          >
            <Building className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">School Readiness Check</h3>
            <p className="text-sm text-gray-600">Assess overall school preparedness</p>
          </button>
        </div>
      </div>

      {/* Tab Navigation - from original SchoolManagement */}
      <div className="card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'plans', label: 'Emergency Plans' },
              { id: 'staff', label: 'Staff Tasks' },
              { id: 'students', label: 'Student Safety' }
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
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">School Readiness Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-text-primary mb-3">Task Completion</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed Tasks</span>
                      <span className="font-medium">{staffTasks.filter(t => t.status.toLowerCase() === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending Tasks</span>
                      <span className="font-medium text-warning">{staffTasks.filter(t => t.status.toLowerCase() !== 'completed').length}</span>
                    </div>
                    <div className="w-full bg-border h-2 rounded-full">
                      <div
                        className="bg-success h-2 rounded-full"
                        style={{ width: `${(staffTasks.filter(t => t.status.toLowerCase() === 'completed').length / staffTasks.length) * 100 || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-3">Emergency Preparedness</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Plans</span>
                      <span className="font-medium text-success">{emergencyPlans.filter(p => p.status.toLowerCase() === 'current').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Need Updates</span>
                      <span className="font-medium text-warning">{emergencyPlans.filter(p => p.status.toLowerCase() === 'needs-update').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Emergency Plans</h3>
              <div className="flex items-center justify-end">
                 <button className="btn-primary">
                   <Upload size={16} className="mr-2" />
                   Upload Emergency Plan
                 </button>
              </div>
              <div className="space-y-3">
                {emergencyPlans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-text-secondary" size={20} />
                      <div>
                        <h4 className="font-medium text-text-primary">{plan.name}</h4>
                        <p className="text-sm text-text-secondary">Last updated: {plan.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                        {plan.status === 'current' ? 'Current' : 'Needs Update'}
                      </span>
                      <button className="text-primary hover:underline text-sm">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Staff Task Management</h3>
              <div className="flex items-center justify-end">
                <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                  Assign New Task
                </button>
              </div>
              <div className="space-y-3">
                {staffTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex items-center space-x-3">
                      {task.status.toLowerCase() === 'completed' ? (
                        <CheckCircle className="text-success" size={20} />
                      ) : (
                        <AlertCircle className="text-warning" size={20} />
                      )}
                      <div>
                        <h4 className="font-medium text-text-primary">{task.name || task.task}</h4>
                        <p className="text-sm text-text-secondary">Assigned to: {task.assignee}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                      <p className="text-sm text-text-tertiary mt-1">Due: {task.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Student Safety Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-text-primary">Evacuation Routes</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-surface rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Primary Route - Main Exit</span>
                        <span className="text-xs text-success">Verified</span>
                      </div>
                    </div>
                    <div className="p-3 bg-surface rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Secondary Route - Side Exit</span>
                        <span className="text-xs text-success">Verified</span>
                      </div>
                    </div>
                    <div className="p-3 bg-surface rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Emergency Route - Back Exit</span>
                        <span className="text-xs text-warning">Needs Check</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-text-primary">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-surface rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Emergency Contacts Updated</span>
                        <span className="text-xs text-success">98%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-surface rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Medical Information Current</span>
                        <span className="text-xs text-warning">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolManagement;