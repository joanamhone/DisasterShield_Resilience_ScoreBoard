import { useState, useEffect } from 'react';
import { alertService } from '../services/alertService';
import { useAuth } from '../contexts/AuthContext';

export interface Alert {
  id: string;
  sender_id: string;
  alert_type: 'weather' | 'flood' | 'fire' | 'earthquake' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  target_audience: 'all' | 'community' | 'region' | 'specific_group';
  target_community_id?: string;
  recipients_count: number;
  delivery_method: string[];
  sent_at: string;
  expires_at?: string;
  created_at: string;
}

export const useAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAlertHistory = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const history = await alertService.getAlertHistory(user.id);
      setAlerts(history);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveAlerts = async (communityId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const activeAlerts = await alertService.getActiveAlerts(communityId);
      setAlerts(activeAlerts);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const sendAlert = async (alertData: any) => {
    if (!user?.id) {
      setError('User not authenticated');
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await alertService.sendCommunityAlert(user.id, alertData);
      
      if (result.success) {
        // Refresh alert history after sending
        await loadAlertHistory();
      } else {
        setError(result.error || 'Failed to send alert');
      }

      return result;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadAlertHistory();
    }
  }, [user?.id]);

  return {
    alerts,
    loading,
    error,
    loadAlertHistory,
    loadActiveAlerts,
    sendAlert,
    refreshAlerts: loadAlertHistory
  };
};