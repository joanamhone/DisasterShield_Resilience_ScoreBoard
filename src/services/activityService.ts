import { supabase } from '../lib/supabase';

export interface Activity {
  id: string;
  type: 'drill' | 'alert' | 'workshop' | 'assessment';
  title: string;
  description?: string;
  date: string;
  participants?: number;
  status?: string;
  community_id?: string;
}

class ActivityService {
  async getRecentActivities(userId: string, limit: number = 10): Promise<Activity[]> {
    try {
      const activities: Activity[] = [];

      // Get recent drills
      const { data: drills } = await supabase
        .from('drills')
        .select(`
          id, title, scheduled_date, participants_count, status, community_id,
          community_groups!inner(leader_id)
        `)
        .eq('community_groups.leader_id', userId)
        .order('scheduled_date', { ascending: false })
        .limit(5);

      if (drills) {
        activities.push(...drills.map(drill => ({
          id: drill.id,
          type: 'drill' as const,
          title: drill.title,
          date: drill.scheduled_date,
          participants: drill.participants_count,
          status: drill.status,
          community_id: drill.community_id
        })));
      }

      // Get recent alerts
      const { data: alerts } = await supabase
        .from('alerts')
        .select('id, title, created_at, recipients_count, target_community_id')
        .eq('sender_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (alerts) {
        activities.push(...alerts.map(alert => ({
          id: alert.id,
          type: 'alert' as const,
          title: alert.title,
          date: alert.created_at,
          participants: alert.recipients_count,
          community_id: alert.target_community_id
        })));
      }

      // Sort by date and limit
      return activities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);

    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  async getActivityStats(userId: string): Promise<{
    totalDrills: number;
    totalAlerts: number;
    totalWorkshops: number;
    totalAssessments: number;
  }> {
    try {
      // Get drill count
      const { count: drillCount } = await supabase
        .from('drills')
        .select('*', { count: 'exact', head: true })
        .eq('organizer_id', userId);

      // Get alert count
      const { count: alertCount } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', userId);

      // Get progress data for workshops and assessments
      const { data: progress } = await supabase
        .from('progress_tracking')
        .select('workshops_held, assessments_conducted')
        .eq('user_id', userId)
        .single();

      return {
        totalDrills: drillCount || 0,
        totalAlerts: alertCount || 0,
        totalWorkshops: progress?.workshops_held || 0,
        totalAssessments: progress?.assessments_conducted || 0
      };
    } catch (error) {
      console.error('Error fetching activity stats:', error);
      return {
        totalDrills: 0,
        totalAlerts: 0,
        totalWorkshops: 0,
        totalAssessments: 0
      };
    }
  }

  async logWorkshop(userId: string, title: string, participants: number, communityId?: string): Promise<boolean> {
    try {
      // Update progress tracking
      const { error } = await supabase.rpc('increment_workshops_held', { user_id: userId });
      if (error) throw error;

      // Update community progress if community specified
      if (communityId) {
        await supabase.rpc('increment_community_workshops', { community_id: communityId });
      }

      return true;
    } catch (error) {
      console.error('Error logging workshop:', error);
      return false;
    }
  }

  async logAssessment(userId: string, communityId?: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_assessments_conducted', { user_id: userId });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging assessment:', error);
      return false;
    }
  }
}

export const activityService = new ActivityService();