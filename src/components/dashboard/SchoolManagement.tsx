import React, { useState } from 'react'
import { School, Users, FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react'

const SchoolManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'staff' | 'students'>('overview')

  // Mock school data
  const schoolStats = {
    totalStudents: 450,
    totalStaff: 35,
    readinessScore: 78,
    completedTasks: 12,
    pendingTasks: 3,
    emergencyPlans: 5
  }

  const staffTasks = [
    { id: 1, name: 'Fire Drill Coordinator', assignee: 'Ms. Johnson', status: 'completed', dueDate: '2024-01-15' },
    { id: 2, name: 'First Aid Kit Check', assignee: 'Mr. Smith', status: 'pending', dueDate: '2024-01-20' },
    { id: 3, name: 'Evacuation Route Update', assignee: 'Mrs. Davis', status: 'in-progress', dueDate: '2024-01-25' }
  ]

  const emergencyPlans = [
    { id: 1, name: 'Fire Emergency Plan', lastUpdated: '2024-01-10', status: 'current' },
    { id: 2, name: 'Earthquake Response Plan', lastUpdated: '2024-01-05', status: 'current' },
    { id: 3, name: 'Lockdown Procedures', lastUpdated: '2023-12-20', status: 'needs-update' },
    { id: 4, name: 'Medical Emergency Plan', lastUpdated: '2024-01-08', status: 'current' },
    { id: 5, name: 'Severe Weather Plan', lastUpdated: '2023-11-15', status: 'needs-update' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'current':
        return 'text-success bg-success/20'
      case 'pending':
      case 'needs-update':
        return 'text-warning bg-warning/20'
      case 'in-progress':
        return 'text-accent bg-accent/20'
      default:
        return 'text-text-secondary bg-surface'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">School Management</h2>
        <button className="btn-primary">
          <Upload size={16} className="mr-2" />
          Upload Emergency Plan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Students</h3>
            <Users className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold text-text-primary">{schoolStats.totalStudents}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Staff</h3>
            <Users className="text-secondary" size={20} />
          </div>
          <div className="text-2xl font-bold text-text-primary">{schoolStats.totalStaff}</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Readiness Score</h3>
            <School className="text-success" size={20} />
          </div>
          <div className="text-2xl font-bold text-success">{schoolStats.readinessScore}%</div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-secondary">Emergency Plans</h3>
            <FileText className="text-accent" size={20} />
          </div>
          <div className="text-2xl font-bold text-accent">{schoolStats.emergencyPlans}</div>
        </div>
      </div>

      {/* Tab Navigation */}
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
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">School Readiness Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-text-primary mb-3">Task Completion</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed Tasks</span>
                      <span className="font-medium">{schoolStats.completedTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending Tasks</span>
                      <span className="font-medium text-warning">{schoolStats.pendingTasks}</span>
                    </div>
                    <div className="w-full bg-border h-2 rounded-full">
                      <div 
                        className="bg-success h-2 rounded-full"
                        style={{ width: `${(schoolStats.completedTasks / (schoolStats.completedTasks + schoolStats.pendingTasks)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-3">Emergency Preparedness</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Plans</span>
                      <span className="font-medium text-success">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Need Updates</span>
                      <span className="font-medium text-warning">2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary">Emergency Plans</h3>
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
              <div className="space-y-3">
                {staffTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex items-center space-x-3">
                      {task.status === 'completed' ? (
                        <CheckCircle className="text-success" size={20} />
                      ) : (
                        <AlertCircle className="text-warning" size={20} />
                      )}
                      <div>
                        <h4 className="font-medium text-text-primary">{task.name}</h4>
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
  )
}

export default SchoolManagement