import React from 'react';
import { AlertTriangle, Info, Bell, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';

const RecentAlerts: React.FC = () => {
  const navigate = useNavigate();
  // Use the hook to get real notification data and loading state
  const { notifications } = useNotifications();

  // Helper to get the right icon and color for an alert
  const getAlertDetails = (type: 'alert' | 'warning' | 'info') => {
    switch (type) {
      case 'alert':
        return { icon: AlertTriangle, color: 'text-risk-high', bgColor: 'bg-risk-high/20' };
      case 'warning':
        return { icon: Bell, color: 'text-risk-medium', bgColor: 'bg-risk-medium/20' };
      case 'info':
      default:
        return { icon: Info, color: 'text-secondary', bgColor: 'bg-secondary/20' };
    }
  };

  // Show a loading state if notifications are not yet available
  if (!notifications) {
      return (
          <div className="card p-4 h-64 flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              <span>Loading Alerts...</span>
          </div>
      )
  }

  return (
    <div className="card p-4 h-64 flex flex-col">
      <h3 className="font-bold text-text-primary mb-3">Recent Alerts</h3>
      
      <div className="flex-1 overflow-hidden">
        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.slice(0, 2).map((alert) => { // Show only 2 most recent alerts
              const { icon: Icon, color, bgColor } = getAlertDetails(alert.type);
              return (
                <div
                  key={alert.id}
                  className="p-3 bg-surface rounded-lg border border-border flex items-start"
                >
                  <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center mr-3 flex-shrink-0`}>
                    <Icon size={16} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text-primary text-sm truncate">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-text-secondary line-clamp-2">
                      {alert.message}
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
              <Bell size={24} className="mx-auto text-text-tertiary mb-2" />
              <p className="text-text-secondary text-sm">No recent alerts in your area.</p>
          </div>
        )}
      </div>
      
      <button 
        onClick={() => navigate('/all-alerts')}
        className="w-full bg-surface hover:bg-border p-2 rounded-lg text-center font-medium text-primary transition-colors duration-200 text-sm mt-3"
      >
        View All Alerts
      </button>
    </div>
  );
};

export default RecentAlerts;
