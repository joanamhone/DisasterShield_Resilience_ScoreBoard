import { useState, useEffect, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from './useLocation';
import { supabase } from '../lib/supabase';

// --- Interfaces ---
export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  location?: string;
}

export interface RiskCheck {
    key: string;
    title: string;
    recommendation: string[]; // Changed to an array of strings
}

// --- Main Hook ---
export const useNotifications = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [activeRisks, setActiveRisks] = useState<RiskCheck[]>([]);
  const [permission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(true);

  const checkRisksAndNotify = useCallback(async () => {
    if (!user || !location.latitude) {
        setIsLoading(false);
        return;
    };
    
    setIsLoading(true);

    const { data: latestRisk, error: riskError } = await supabase
      .from('risk_trends')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (riskError || !latestRisk) {
      console.error("Could not fetch latest risks for notifications:", riskError);
      setIsLoading(false);
      return;
    }
      
    const { data: recentNotifications, error: readError } = await supabase
        .from('user_notifications')
        .select('notification_id, read_at')
        .eq('user_id', user.id);

    if (readError) {
        console.error("Error fetching recent notifications:", readError);
        setIsLoading(false);
        return;
    }
    const readNotificationMap = new Map(recentNotifications.map((n: any) => [n.notification_id, new Date(n.read_at).getTime()]));

    const newNotifications: NotificationData[] = [];
    const currentActiveRisks: RiskCheck[] = [];
    
    const warningThreshold = 0.1;
    const alertThreshold = 0.6;

    const riskChecks: RiskCheck[] = [
      { key: 'heat_wave_risk', title: 'Heat Wave', recommendation: ['Stay hydrated by drinking plenty of water.', 'Seek shade and avoid strenuous activity during peak sun hours.', 'Check on vulnerable neighbors, especially the elderly.'] },
      { key: 'cold_wave_risk', title: 'Cold Wave', recommendation: ['Wear warm layers of clothing.', 'Ensure your heating system is functional and safe.', 'Bring pets indoors.'] },
      { key: 'flash_flood_risk', title: 'Flash Flood', recommendation: ['Move to higher ground immediately.', 'Do not walk or drive through floodwaters.', 'Listen to local news for evacuation orders.'] },
      { key: 'storm_risk', title: 'Storm', recommendation: ['Secure loose outdoor objects like furniture.', 'Stay indoors and away from windows.', 'Charge your electronic devices in case of a power outage.'] },
      { key: 'forest_fire_risk', title: 'Forest Fire', recommendation: ['Be aware of your designated evacuation routes.', 'Monitor local news and emergency alerts for updates.', 'Clear flammable materials from around your home.'] },
    ];

    riskChecks.forEach(risk => {
      const probability = latestRisk[risk.key];
      if (probability >= warningThreshold) {
        currentActiveRisks.push(risk);
        
        let alertType: 'warning' | 'alert' = 'warning';
        let alertTitle = `High ${risk.title} Risk`;

        if (probability >= alertThreshold) {
            alertType = 'alert';
            alertTitle = `Critical ${risk.title} Risk`;
        }

        const notificationId = `${latestRisk.id}-${risk.key}`;
        
        newNotifications.push({
            id: notificationId,
            title: alertTitle,
            message: `A ${risk.title.toLowerCase()} risk has been detected in your area.`,
            type: alertType,
            timestamp: new Date(latestRisk.timestamp),
            read: readNotificationMap.has(notificationId),
            location: `${location.city}, ${location.country}`,
        });
      }
    });

    setNotifications(newNotifications.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
    setActiveRisks(currentActiveRisks);
    setIsLoading(false);

  }, [user, location.latitude, location.city, location.country]);

  useEffect(() => {
    checkRisksAndNotify();
    
    if (!user) return;

    const channel: RealtimeChannel = supabase
      .channel(`user_notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_notifications', filter: `user_id=eq.${user.id}` },
        () => {
          checkRisksAndNotify();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, checkRisksAndNotify]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    
    await supabase.from('user_notifications').upsert({
      user_id: user.id,
      notification_id: notificationId,
      read_at: new Date().toISOString()
    }, { onConflict: 'user_id,notification_id' });
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    const records = unread.map(n => ({
      user_id: user.id,
      notification_id: n.id,
      read_at: new Date().toISOString()
    }));

    await supabase.from('user_notifications').upsert(records, { onConflict: 'user_id,notification_id' });
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    activeRisks,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    permission,
  };
};
