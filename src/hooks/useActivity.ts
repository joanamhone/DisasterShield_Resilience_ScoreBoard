import { useState, useEffect } from 'react';
import { activityService, Activity } from '../services/activityService';
import { useAuth } from '../contexts/AuthContext';

export const useActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    totalDrills: 0,
    totalAlerts: 0,
    totalWorkshops: 0,
    totalAssessments: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecentActivities = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const recentActivities = await activityService.getRecentActivities(user.id);
      setActivities(recentActivities);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadActivityStats = async () => {
    if (!user?.id) return;

    try {
      const activityStats = await activityService.getActivityStats(user.id);
      setStats(activityStats);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const logWorkshop = async (title: string, participants: number, communityId?: string) => {
    if (!user?.id) return false;

    try {
      const success = await activityService.logWorkshop(user.id, title, participants, communityId);
      
      if (success) {
        await loadRecentActivities();
        await loadActivityStats();
      }

      return success;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  const logAssessment = async (communityId?: string) => {
    if (!user?.id) return false;

    try {
      const success = await activityService.logAssessment(user.id, communityId);
      
      if (success) {
        await loadRecentActivities();
        await loadActivityStats();
      }

      return success;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadRecentActivities();
      loadActivityStats();
    }
  }, [user?.id]);

  return {
    activities,
    stats,
    loading,
    error,
    loadRecentActivities,
    loadActivityStats,
    logWorkshop,
    logAssessment,
    refreshActivities: () => {
      loadRecentActivities();
      loadActivityStats();
    }
  };
};