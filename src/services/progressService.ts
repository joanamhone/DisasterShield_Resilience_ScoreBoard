import { supabase } from '../lib/supabase';

export interface ProgressData {
  coursesCompleted: number;
  certificationsEarned: number;
  drillsLed: number;
  assessmentsConducted: number;
  workshopsHeld: number;
  alertsSent: number;
  engagementScore: number;
}

export interface CommunityProgress {
  readinessScore: number;
  drillsCompleted: number;
  workshopsHeld: number;
  alertsSent: number;
  membersTrained: number;
}

class ProgressService {
  async getPersonalProgress(userId: string): Promise<ProgressData> {
    try {
      const { data, error } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
        coursesCompleted: data?.courses_completed || 0,
        certificationsEarned: data?.certifications_earned || 0,
        drillsLed: data?.drills_led || 0,
        assessmentsConducted: data?.assessments_conducted || 0,
        workshopsHeld: data?.workshops_held || 0,
        alertsSent: data?.alerts_sent || 0,
        engagementScore: data?.engagement_score || 0
      };
    } catch (error) {
      console.error('Error fetching personal progress:', error);
      return {
        coursesCompleted: 0,
        certificationsEarned: 0,
        drillsLed: 0,
        assessmentsConducted: 0,
        workshopsHeld: 0,
        alertsSent: 0,
        engagementScore: 0
      };
    }
  }

  async getCommunityProgress(communityId: string): Promise<CommunityProgress> {
    try {
      const { data, error } = await supabase
        .from('community_progress')
        .select('*')
        .eq('community_id', communityId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
        readinessScore: data?.readiness_score || 0,
        drillsCompleted: data?.drills_completed || 0,
        workshopsHeld: data?.workshops_held || 0,
        alertsSent: data?.alerts_sent || 0,
        membersTrained: data?.members_trained || 0
      };
    } catch (error) {
      console.error('Error fetching community progress:', error);
      return {
        readinessScore: 0,
        drillsCompleted: 0,
        workshopsHeld: 0,
        alertsSent: 0,
        membersTrained: 0
      };
    }
  }

  async updatePersonalProgress(userId: string, updates: Partial<ProgressData>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('progress_tracking')
        .upsert({
          user_id: userId,
          progress_type: 'personal',
          courses_completed: updates.coursesCompleted,
          certifications_earned: updates.certificationsEarned,
          drills_led: updates.drillsLed,
          assessments_conducted: updates.assessmentsConducted,
          workshops_held: updates.workshopsHeld,
          alerts_sent: updates.alertsSent,
          engagement_score: updates.engagementScore,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating personal progress:', error);
      return false;
    }
  }

  async incrementProgress(userId: string, field: keyof ProgressData, amount: number = 1): Promise<boolean> {
    try {
      const current = await this.getPersonalProgress(userId);
      const updates = { ...current, [field]: current[field] + amount };
      return await this.updatePersonalProgress(userId, updates);
    } catch (error) {
      console.error('Error incrementing progress:', error);
      return false;
    }
  }
}

export const progressService = new ProgressService();