import { supabase } from './supabase';

export interface AlertStats {
  totalSent: number;
  totalRecipients: number;
  deliveryRate: number;
  recentAlerts: number;
}

export interface AlertMetrics {
  alertsByType: Record<string, number>;
  alertsBySeverity: Record<string, number>;
  deliveryMethodStats: Record<string, number>;
  monthlyTrends: Array<{ month: string; count: number }>;
}

class AlertAPI {
  async getAlertStats(userId: string): Promise<AlertStats> {
    try {
      const { data: alerts } = await supabase
        .from('alerts')
        .select('recipients_count, created_at')
        .eq('sender_id', userId);

      if (!alerts) return { totalSent: 0, totalRecipients: 0, deliveryRate: 0, recentAlerts: 0 };

      const totalSent = alerts.length;
      const totalRecipients = alerts.reduce((sum, alert) => sum + (alert.recipients_count || 0), 0);
      
      // Calculate recent alerts (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentAlerts = alerts.filter(alert => 
        new Date(alert.created_at) > thirtyDaysAgo
      ).length;

      // For now, assume 95% delivery rate (in production, calculate from notification_logs)
      const deliveryRate = 0.95;

      return {
        totalSent,
        totalRecipients,
        deliveryRate,
        recentAlerts
      };
    } catch (error) {
      console.error('Error getting alert stats:', error);
      return { totalSent: 0, totalRecipients: 0, deliveryRate: 0, recentAlerts: 0 };
    }
  }

  async getAlertMetrics(userId: string): Promise<AlertMetrics> {
    try {
      const { data: alerts } = await supabase
        .from('alerts')
        .select('alert_type, severity, delivery_method, created_at')
        .eq('sender_id', userId);

      if (!alerts) {
        return {
          alertsByType: {},
          alertsBySeverity: {},
          deliveryMethodStats: {},
          monthlyTrends: []
        };
      }

      // Count alerts by type
      const alertsByType = alerts.reduce((acc, alert) => {
        acc[alert.alert_type] = (acc[alert.alert_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Count alerts by severity
      const alertsBySeverity = alerts.reduce((acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Count delivery methods
      const deliveryMethodStats = alerts.reduce((acc, alert) => {
        alert.delivery_method?.forEach((method: string) => {
          acc[method] = (acc[method] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      // Calculate monthly trends (last 12 months)
      const monthlyTrends = this.calculateMonthlyTrends(alerts);

      return {
        alertsByType,
        alertsBySeverity,
        deliveryMethodStats,
        monthlyTrends
      };
    } catch (error) {
      console.error('Error getting alert metrics:', error);
      return {
        alertsByType: {},
        alertsBySeverity: {},
        deliveryMethodStats: {},
        monthlyTrends: []
      };
    }
  }

  private calculateMonthlyTrends(alerts: any[]): Array<{ month: string; count: number }> {
    const monthCounts: Record<string, number> = {};
    const now = new Date();

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      monthCounts[monthKey] = 0;
    }

    // Count alerts by month
    alerts.forEach(alert => {
      const monthKey = alert.created_at.slice(0, 7);
      if (monthCounts.hasOwnProperty(monthKey)) {
        monthCounts[monthKey]++;
      }
    });

    return Object.entries(monthCounts).map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count
    }));
  }

  async getCommunityAlerts(communityId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data: alerts } = await supabase
        .from('alerts')
        .select(`
          *,
          users!alerts_sender_id_fkey(full_name)
        `)
        .or(`target_community_id.eq.${communityId},target_audience.eq.all`)
        .order('created_at', { ascending: false })
        .limit(limit);

      return alerts || [];
    } catch (error) {
      console.error('Error getting community alerts:', error);
      return [];
    }
  }

  async getAlertDeliveryStatus(alertId: string): Promise<any> {
    try {
      const { data: logs } = await supabase
        .from('notification_logs')
        .select('delivery_method, status, error_message')
        .eq('alert_id', alertId);

      if (!logs) return { total: 0, sent: 0, failed: 0, pending: 0 };

      const stats = logs.reduce((acc, log) => {
        acc.total++;
        acc[log.status]++;
        return acc;
      }, { total: 0, sent: 0, failed: 0, pending: 0 });

      return stats;
    } catch (error) {
      console.error('Error getting alert delivery status:', error);
      return { total: 0, sent: 0, failed: 0, pending: 0 };
    }
  }

  async markAlertAsRead(alertId: string, userId: string): Promise<boolean> {
    try {
      // In a real implementation, you might have an alert_reads table
      // For now, we'll just log this action
      console.log(`Alert ${alertId} marked as read by user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error marking alert as read:', error);
      return false;
    }
  }
}

export const alertAPI = new AlertAPI();