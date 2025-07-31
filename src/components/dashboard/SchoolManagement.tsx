import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ReadinessScore } from '../readiness/ScoreComponents';
import RecentAlerts from '../home/RecentAlerts';
import RiskSummary from '../home/RiskSummary';
import {
  Users, FileText, CheckCircle, AlertCircle, 
  UserCheck, 
  Shield
} from 'lucide-react';
import { clsx } from 'clsx';

const SchoolManagement: React.FC = () => {
  const { user } = useAuth();
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
  ];



  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName || 'School Administrator'}
        </h1>
        <p className="text-gray-600">
          School Administration Dashboard - {user?.location || 'Your School'}
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReadinessScore />
        <RecentAlerts />
        <RiskSummary />
      </div>

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
          {activeTab === 'staff' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Staff Task Management</h3>
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
                        <h4 className="font-medium text-text-primary">{task.name}</h4>
                        <p className="text-sm text-text-secondary">Assigned to: {task.assignee}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolManagement;
