import { useState, useEffect } from 'react';
import { progressService, ProgressData, CommunityProgress } from '../services/progressService';
import { useAuth } from '../contexts/AuthContext';

export const useProgress = () => {
  const { user } = useAuth();
  const [personalProgress, setPersonalProgress] = useState<ProgressData | null>(null);
  const [communityProgress, setCommunityProgress] = useState<CommunityProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPersonalProgress = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const progress = await progressService.getPersonalProgress(user.id);
      setPersonalProgress(progress);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityProgress = async (communityId: string) => {
    setLoading(true);
    setError(null);

    try {
      const progress = await progressService.getCommunityProgress(communityId);
      setCommunityProgress(progress);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (updates: Partial<ProgressData>) => {
    if (!user?.id) return false;

    try {
      const success = await progressService.updatePersonalProgress(user.id, updates);
      if (success) {
        await loadPersonalProgress();
      }
      return success;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  const incrementProgress = async (field: keyof ProgressData, amount: number = 1) => {
    if (!user?.id) return false;

    try {
      const success = await progressService.incrementProgress(user.id, field, amount);
      if (success) {
        await loadPersonalProgress();
      }
      return success;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadPersonalProgress();
    }
  }, [user?.id]);

  return {
    personalProgress,
    communityProgress,
    loading,
    error,
    loadPersonalProgress,
    loadCommunityProgress,
    updateProgress,
    incrementProgress
  };
};