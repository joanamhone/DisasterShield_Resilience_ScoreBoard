import { useState } from 'react';
import { accountService } from '../services/accountService';
import { useAuth } from '../contexts/AuthContext';

export const useAccount = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = async () => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await accountService.deleteAccount(user.id);
      
      if (result.success) {
        // Sign out the user after successful deletion
        await signOut();
      } else {
        setError(result.error || 'Failed to delete account');
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

  const exportUserData = async () => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await accountService.exportUserData(user.id);
      
      if (result.success && result.data) {
        // Create and download the data as JSON file
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `disastershield-data-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        setError(result.error || 'Failed to export data');
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

  const deactivateAccount = async () => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await accountService.deactivateAccount(user.id);
      
      if (result.success) {
        // Sign out the user after deactivation
        await signOut();
      } else {
        setError(result.error || 'Failed to deactivate account');
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

  return {
    loading,
    error,
    deleteAccount,
    exportUserData,
    deactivateAccount
  };
};