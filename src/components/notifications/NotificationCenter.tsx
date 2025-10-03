import React from 'react';
import { Bell, X, AlertTriangle, Info, Clock } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { format } from 'date-fns';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Close notifications when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.notification-center')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="text-error" size={20} />;
      case 'warning':
        return <Clock className="text-warning" size={20} />;
      case 'info':
        return <Info className="text-secondary" size={20} />;
      default:
        return <Bell className="text-primary" size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:absolute lg:inset-auto lg:top-full lg:right-0 lg:mt-2">
      <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={onClose} />
      
      <div className="notification-center fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-xl lg:relative lg:w-80 lg:h-auto lg:max-h-[80vh] lg:rounded-lg lg:border lg:border-border lg:shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center">
            <h3 className="font-bold text-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <span className="ml-2 bg-error text-white text-xs px-2 py-1 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:underline transition-colors duration-200"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-surface rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto" style={{maxHeight: 'calc(80vh - 60px)'}}>
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="mx-auto mb-3 text-text-tertiary" size={48} />
              <p className="text-text-secondary">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full p-4 text-left hover:bg-surface transition-colors ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${!notification.read ? 'bg-primary/20' : 'bg-gray-100'}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${!notification.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-sm text-text-secondary mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-text-tertiary">
                        <span>{format(new Date(notification.timestamp), 'MMM dd, HH:mm')}</span>
                        {notification.location && (
                          <span>{notification.location}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
