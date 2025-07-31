import { useState, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from './useLocation';

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

// --- Supabase Client Initialization ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key are required.");
}
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// --- Main Hook ---
export const useNotifications = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const checkRisksAndNotify = useCallback(async () => {
    if (!user || !location.latitude) return;

    // 1. Define the cooldown period in hours
    const NOTIFICATION_COOLDOWN_HOURS = 6;

    // 2. Fetch the latest risk data
    const { data: latestRisk, error: riskError } = await supabase
      .from('risk_trends')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (riskError || !latestRisk) {
      console.error("Could not fetch latest risks for notifications:", riskError);
      return;
    }
      
    // 3. Fetch recent notifications for this user to check timestamps
    const { data: recentNotifications, error: readError } = await supabase
        .from('user_notifications')
        .select('notification_id, read_at') // Also get the timestamp
        .eq('user_id', user.id);

    if (readError) {
        console.error("Error fetching recent notifications:", readError);
        return;
    }
    const readNotificationMap = new Map(recentNotifications.map(n => [n.notification_id, new Date(n.read_at).getTime()]));

    const newNotifications: NotificationData[] = [];
    const highRiskThreshold = 0.3;

    const riskChecks = [
      { key: 'heat_wave_risk', title: 'High Heat Wave Risk' },
      { key: 'cold_wave_risk', title: 'High Cold Wave Risk' },
      { key: 'flash_flood_risk', title: 'High Flash Flood Risk' },
      { key: 'storm_risk', title: 'High Storm Risk' },
      { key: 'forest_fire_risk', title: 'High Forest Fire Risk' },
    ];

    riskChecks.forEach(risk => {
      if (latestRisk[risk.key] >= highRiskThreshold) {
        const notificationId = `${latestRisk.id}-${risk.key}`;

        // 4. Check if the cooldown period has passed for this specific risk type
        const lastTime = readNotificationMap.get(notificationId) || 0;
        const now = new Date().getTime();
        const hoursSinceLast = (now - lastTime) / (1000 * 60 * 60);

        // Only create a notification if it's a new risk or the cooldown has passed
        if (hoursSinceLast >= NOTIFICATION_COOLDOWN_HOURS) {
            newNotifications.push({
                id: notificationId,
                title: risk.title,
                message: `A ${risk.title.toLowerCase()} has been detected. Please take precautions.`,
                type: 'alert',
                timestamp: new Date(latestRisk.timestamp),
                read: false, // A new notification is always unread
                location: `${location.city}, ${location.country}`,
            });
        }
      }
    });

    setNotifications(prev => {
        // A simple merge to avoid duplicates while preserving existing state
        const existingIds = new Set(prev.map(p => p.id));
        const combined = [...prev, ...newNotifications.filter(n => !existingIds.has(n.id))];
        return combined.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
    });

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
          // Re-check notifications when a new one is read to update cooldown status
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
    unreadCount,
    markAsRead,
    markAllAsRead,
    permission,
  };
};
