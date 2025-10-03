import React from 'react';
import { AlertTriangle, Info, Bell, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../hooks/useNotifications';

const RecentAlerts: React.FC = () => {
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
          <div className="card p-4 flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              <span>Loading Alerts...</span>
          </div>
      )
  }

  return (
    <div className="space-y-3">
      {notifications.length > 0 ? (
        notifications.slice(0, 3).map((alert) => { // Show top 3 recent alerts
          const { icon: Icon, color, bgColor } = getAlertDetails(alert.type);
          return (
            <button
              key={alert.id}
              className="w-full card p-4 hover:shadow-md transition-shadow duration-200 flex items-start text-left"
            >
              <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mr-3 flex-shrink-0`}>
                <Icon size={20} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-text-primary mb-1">
                  {alert.title}
                </h4>
                <p className="text-sm text-text-secondary mb-2 leading-relaxed">
                  {alert.message}
                </p>
                <p className="text-xs text-text-tertiary">
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </p>
              </div>
            </button>
          );
        })
      ) : (
        <div className="card p-6 text-center">
            <Bell size={24} className="mx-auto text-text-tertiary mb-2" />
            <p className="text-text-secondary">No recent alerts in your area.</p>
        </div>
      )}
      
      <button className="w-full bg-surface hover:bg-border p-3 rounded-lg text-center font-medium text-primary transition-colors duration-200">
        View All Alerts
      </button>
    </div>
  );
};

export default RecentAlerts;
