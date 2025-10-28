import { supabase } from '../lib/supabase';
import { alertService } from './alertService';

export interface Drill {
  id: string;
  organizer_id: string;
  community_id: string;
  drill_type: 'fire' | 'earthquake' | 'flood' | 'evacuation' | 'general';
  title: string;
  description?: string;
  scheduled_date: string;
  duration_minutes?: number;
  location?: string;
  participants_count: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notification_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface DrillData {
  drill_type: 'fire' | 'earthquake' | 'flood' | 'evacuation' | 'general';
  title: string;
  description?: string;
  scheduled_date: string;
  duration_minutes?: number;
  location?: string;
  community_id: string;
}

class DrillService {
  async getActiveDrills(userId: string): Promise<Drill[]> {
    try {
      const { data, error } = await supabase
        .from('drills')
        .select(`
          *,
          community_groups!inner(name, leader_id)
        `)
        .eq('community_groups.leader_id', userId)
        .in('status', ['scheduled', 'in_progress'])
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active drills:', error);
      return [];
    }
  }

  async getCompletedDrills(userId: string): Promise<Drill[]> {
    try {
      const { data, error } = await supabase
        .from('drills')
        .select(`
          *,
          community_groups!inner(name, leader_id)
        `)
        .eq('community_groups.leader_id', userId)
        .eq('status', 'completed')
        .order('scheduled_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching completed drills:', error);
      return [];
    }
  }

  async scheduleDrill(
    organizerId: string, 
    drillData: DrillData, 
    targetGroups: string[], 
    notificationMethod: string[]
  ): Promise<{ success: boolean; drillId?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('drills')
        .insert({
          organizer_id: organizerId,
          community_id: drillData.community_id,
          drill_type: drillData.drill_type,
          title: drillData.title,
          description: drillData.description,
          scheduled_date: drillData.scheduled_date,
          duration_minutes: drillData.duration_minutes,
          location: drillData.location,
          status: 'scheduled',
          participants_count: 0,
          notification_sent: false
        })
        .select()
        .single();

      if (error) throw error;

      // Send notifications to target groups
      await this.sendDrillNotifications(organizerId, data, targetGroups, notificationMethod);

      // Update organizer's progress
      try {
        const { error } = await supabase.rpc('increment_drills_led', { user_id: organizerId });
        if (error) {
          console.warn('RPC function not found, using direct update:', error);
          // Fallback to direct update if function doesn't exist
          await supabase
            .from('progress_tracking')
            .upsert({
              user_id: organizerId,
              drills_led: 1
            }, {
              onConflict: 'user_id',
              ignoreDuplicates: false
            });
        }
      } catch (progressError) {
        console.error('Error updating drill progress:', progressError);
      }

      return { success: true, drillId: data.id };
    } catch (error) {
      console.error('Error scheduling drill:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  private async sendDrillNotifications(
    organizerId: string,
    drill: any,
    targetGroups: string[],
    notificationMethods: string[]
  ): Promise<void> {
    try {
      const drillDate = new Date(drill.scheduled_date);
      const formattedDate = drillDate.toLocaleDateString();
      const formattedTime = drillDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      for (const groupId of targetGroups) {
        await alertService.sendCommunityAlert(organizerId, {
          alertType: 'general',
          severity: 'medium',
          title: `Drill Scheduled: ${drill.title}`,
          message: `A ${drill.drill_type} drill has been scheduled for ${formattedDate} at ${formattedTime}.\n\nLocation: ${drill.location || 'TBD'}\nDuration: ${drill.duration_minutes || 60} minutes\n\nDescription: ${drill.description || 'Emergency preparedness drill'}\n\nPlease mark your calendar and prepare to participate.`,
          targetAudience: 'community',
          targetCommunityId: groupId,
          deliveryMethod: notificationMethods,
          expiresInHours: 168 // 7 days
        });
      }

      // Mark notifications as sent
      await supabase
        .from('drills')
        .update({ notification_sent: true })
        .eq('id', drill.id);

    } catch (error) {
      console.error('Error sending drill notifications:', error);
    }
  }

  async updateDrillStatus(drillId: string, status: Drill['status'], participantsCount?: number): Promise<boolean> {
    try {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (participantsCount !== undefined) {
        updates.participants_count = participantsCount;
      }

      const { error } = await supabase
        .from('drills')
        .update(updates)
        .eq('id', drillId);

      if (error) throw error;

      // If drill is completed, update community progress
      if (status === 'completed') {
        const { data: drill } = await supabase
          .from('drills')
          .select('community_id')
          .eq('id', drillId)
          .single();

        if (drill) {
          await supabase.rpc('increment_community_drills', { community_id: drill.community_id });
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating drill status:', error);
      return false;
    }
  }

  async deleteDrill(drillId: string, organizerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('drills')
        .delete()
        .eq('id', drillId)
        .eq('organizer_id', organizerId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting drill:', error);
      return false;
    }
  }
}

export const drillService = new DrillService();