import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, Users, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { communityService } from '../services/communityService';

interface Alert {
  id: string;
  title: string;
  message: string;
  alert_type: string;
  severity: string;
  created_at: string;
  sender_id: string;
  target_audience: string;
}

const CommunityAlerts: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityAndAlerts();
  }, [user]);

  const fetchCommunityAndAlerts = async () => {
    if (!user?.id) return;

    try {
      // Get user's community
      const userCommunity = await communityService.getUserCommunity(user.id);
      if (!userCommunity) {
        navigate('/communities');
        return;
      }
      setCommunity(userCommunity);

      // Get alerts for this community
      const communityAlerts = await communityService.getCommunityAlerts(userCommunity.id);
      setAlerts(communityAlerts);
    } catch (error) {
      console.error('Error fetching community alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'weather': return '🌤️';
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      case 'earthquake': return '🌍';
      default: return '📢';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/communities')}
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Community Alerts</h1>
          {community && (
            <div className="flex items-center space-x-4 text-text-secondary">
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                {community.name}
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {community.location}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="card p-8 text-center">
            <AlertTriangle size={48} className="mx-auto text-text-tertiary mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No Alerts Yet</h3>
            <p className="text-text-secondary">
              Your community leader hasn't sent any alerts yet. You'll see them here when they do.
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getAlertIcon(alert.alert_type)}</div>
                  <div>
                    <h3 className="font-bold text-text-primary">{alert.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-text-secondary capitalize">
                        {alert.alert_type} Alert
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Clock size={14} className="mr-1" />
                  {new Date(alert.created_at).toLocaleDateString()} at{' '}
                  {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="bg-surface p-4 rounded-lg">
                <p className="text-text-primary whitespace-pre-wrap">{alert.message}</p>
              </div>

              <div className="mt-4 text-xs text-text-tertiary">
                Sent to: {alert.target_audience === 'all' ? 'All Communities' : 'This Community'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityAlerts;