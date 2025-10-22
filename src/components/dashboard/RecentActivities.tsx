import React from 'react';
import { useActivity } from '../../hooks/useActivity';
import { Calendar, AlertTriangle, Users, Target } from 'lucide-react';
import { format } from 'date-fns';

const RecentActivities: React.FC = () => {
  const { activities, loading } = useActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'drill':
        return <Users className="text-blue-500" size={16} />;
      case 'alert':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'workshop':
        return <Target className="text-green-500" size={16} />;
      case 'assessment':
        return <Calendar className="text-purple-500" size={16} />;
      default:
        return <Calendar className="text-gray-500" size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'drill':
        return 'bg-blue-50 border-blue-200';
      case 'alert':
        return 'bg-red-50 border-red-200';
      case 'workshop':
        return 'bg-green-50 border-green-200';
      case 'assessment':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Recent Community Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="font-bold text-text-primary mb-4">Recent Community Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          <Calendar className="mx-auto mb-3 text-gray-400" size={48} />
          <p>No recent activities</p>
          <p className="text-sm">Start by scheduling a drill or sending an alert</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary text-sm">
                      {activity.title}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-text-secondary">
                      <span className="capitalize">{activity.type}</span>
                      <span>{format(new Date(activity.date), 'MMM dd, yyyy')}</span>
                      {activity.participants && (
                        <span>{activity.participants} participants</span>
                      )}
                    </div>
                  </div>
                </div>
                {activity.status && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    activity.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivities;