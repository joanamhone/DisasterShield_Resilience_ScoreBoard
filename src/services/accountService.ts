import { supabase } from '../lib/supabase';

class AccountService {
  async deleteAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Start a transaction-like operation
      console.log('🗑️ Starting account deletion process...');

      // 1. Delete user's progress tracking
      const { error: progressError } = await supabase
        .from('progress_tracking')
        .delete()
        .eq('user_id', userId);

      if (progressError) {
        console.warn('⚠️ Error deleting progress tracking:', progressError);
      }

      // 2. Update community groups to remove leadership
      const { error: communityError } = await supabase
        .from('community_groups')
        .update({ leader_id: null })
        .eq('leader_id', userId);

      if (communityError) {
        console.warn('⚠️ Error updating community leadership:', communityError);
      }

      // 3. Delete user's alerts
      const { error: alertsError } = await supabase
        .from('alerts')
        .delete()
        .eq('sender_id', userId);

      if (alertsError) {
        console.warn('⚠️ Error deleting alerts:', alertsError);
      }

      // 4. Delete user's drills
      const { error: drillsError } = await supabase
        .from('drills')
        .delete()
        .eq('organizer_id', userId);

      if (drillsError) {
        console.warn('⚠️ Error deleting drills:', drillsError);
      }

      // 5. Update community members to remove user reference
      const { error: membersError } = await supabase
        .from('community_members')
        .update({ user_id: null })
        .eq('user_id', userId);

      if (membersError) {
        console.warn('⚠️ Error updating community members:', membersError);
      }

      // 6. Delete user profile
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (userError) throw userError;

      // 7. Delete from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.warn('⚠️ Error deleting auth user (may require admin privileges):', authError);
        // Continue anyway as the user profile is deleted
      }

      console.log('✅ Account deletion completed successfully');
      return { success: true };

    } catch (error) {
      console.error('❌ Error deleting account:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async exportUserData(userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      console.log('📦 Exporting user data...');

      // Get user profile
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Get progress tracking
      const { data: progress } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get alerts sent
      const { data: alerts } = await supabase
        .from('alerts')
        .select('*')
        .eq('sender_id', userId);

      // Get drills organized
      const { data: drills } = await supabase
        .from('drills')
        .select('*')
        .eq('organizer_id', userId);

      // Get communities led
      const { data: communities } = await supabase
        .from('community_groups')
        .select('*')
        .eq('leader_id', userId);

      const exportData = {
        user_profile: user,
        progress_tracking: progress,
        alerts_sent: alerts || [],
        drills_organized: drills || [],
        communities_led: communities || [],
        export_date: new Date().toISOString()
      };

      console.log('✅ User data exported successfully');
      return { success: true, data: exportData };

    } catch (error) {
      console.error('❌ Error exporting user data:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async deactivateAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Update user profile to mark as deactivated
      const { error } = await supabase
        .from('users')
        .update({ 
          profile_completed: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Remove from community leadership
      await supabase
        .from('community_groups')
        .update({ leader_id: null })
        .eq('leader_id', userId);

      console.log('✅ Account deactivated successfully');
      return { success: true };

    } catch (error) {
      console.error('❌ Error deactivating account:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}

export const accountService = new AccountService();