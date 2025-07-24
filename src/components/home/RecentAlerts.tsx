import React from 'react'
import { AlertTriangle, Info, Bell } from 'lucide-react'

const RecentAlerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Flood Warning',
      message: 'Heavy rainfall expected in your area over the next 48 hours.',
      time: '2h ago',
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
    {
      id: 2,
      type: 'info',
      title: 'Air Quality Alert',
      message: 'Air quality index has improved to moderate levels.',
      time: '5h ago',
      icon: Info,
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
    },
    {
      id: 3,
      type: 'notification',
      title: 'Emergency Drill',
      message: 'Community emergency drill scheduled for this weekend.',
      time: '1d ago',
      icon: Bell,
      color: 'text-accent',
      bgColor: 'bg-accent/20',
    },
  ]

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const Icon = alert.icon
        return (
          <button
            key={alert.id}
            className="w-full card p-4 hover:shadow-md transition-shadow duration-200 flex items-start text-left"
          >
            <div className={`w-10 h-10 rounded-full ${alert.bgColor} flex items-center justify-center mr-3 flex-shrink-0`}>
              <Icon size={20} className={alert.color} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-text-primary mb-1">
                {alert.title}
              </h4>
              <p className="text-sm text-text-secondary mb-2 leading-relaxed">
                {alert.message}
              </p>
              <p className="text-xs text-text-tertiary">
                {alert.time}
              </p>
            </div>
          </button>
        )
      })}
      
      <button className="w-full bg-surface hover:bg-border p-3 rounded-lg text-center font-medium text-primary transition-colors duration-200">
        View All Alerts
      </button>
    </div>
  )
}

export default RecentAlerts