import { useState, useEffect } from 'react';
import { drillService, Drill, DrillData } from '../services/drillService';
import { useAuth } from '../contexts/AuthContext';

export const useDrills = () => {
  const { user } = useAuth();
  const [activeDrills, setActiveDrills] = useState<Drill[]>([]);
  const [completedDrills, setCompletedDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActiveDrills = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const drills = await drillService.getActiveDrills(user.id);
      setActiveDrills(drills);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedDrills = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const drills = await drillService.getCompletedDrills(user.id);
      setCompletedDrills(drills);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const scheduleDrill = async (drillData: DrillData) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await drillService.scheduleDrill(user.id, drillData);
      
      if (result.success) {
        await loadActiveDrills();
      } else {
        setError(result.error || 'Failed to schedule drill');
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

  const updateDrillStatus = async (drillId: string, status: Drill['status'], participantsCount?: number) => {
    try {
      const success = await drillService.updateDrillStatus(drillId, status, participantsCount);
      
      if (success) {
        await loadActiveDrills();
        if (status === 'completed') {
          await loadCompletedDrills();
        }
      }

      return success;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  const deleteDrill = async (drillId: string) => {
    if (!user?.id) return false;

    try {
      const success = await drillService.deleteDrill(drillId, user.id);
      
      if (success) {
        await loadActiveDrills();
      }

      return success;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadActiveDrills();
      loadCompletedDrills();
    }
  }, [user?.id]);

  return {
    activeDrills,
    completedDrills,
    loading,
    error,
    loadActiveDrills,
    loadCompletedDrills,
    scheduleDrill,
    updateDrillStatus,
    deleteDrill,
    refreshDrills: () => {
      loadActiveDrills();
      loadCompletedDrills();
    }
  };
};