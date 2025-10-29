import { supabase } from '../lib/supabase';

export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  leader_id?: string;
  member_count?: number;
  total_members?: number;
  location?: string;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  name: string;
  phone_number: string;
  address?: string;
  readiness_score?: string;
  risk_level?: string;
  is_vulnerable: boolean;
  created_at: string;
}

class CommunityService {
  async getCommunityGroups(): Promise<CommunityGroup[]> {
    try {
      const { data, error } = await supabase
        .from('community_groups')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching community groups:', error);
      return [];
    }
  }

  async joinCommunity(userId: string, communityId: string, phoneNumber: string, email: string, userName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        return { success: false, error: 'You are already a member of a community' };
      }

      // Get community info
      const { data: community } = await supabase
        .from('community_groups')
        .select('name, location')
        .eq('id', communityId)
        .single();

      if (!community) {
        return { success: false, error: 'Community not found' };
      }

      // Add member to community_members table
      const { error: insertError } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: userId,
          name: userName,
          phone_number: phoneNumber,
          address: community.location,
          readiness_score: '5.0',
          risk_level: 'medium',
          is_vulnerable: false
        });

      if (insertError) throw insertError;

      // Update user's email if provided
      if (email) {
        await supabase
          .from('users')
          .update({ email: email })
          .eq('id', userId);
      }

      // Update community total_members count
      const { data: memberCount } = await supabase
        .from('community_members')
        .select('id', { count: 'exact' })
        .eq('community_id', communityId);

      await supabase
        .from('community_groups')
        .update({ total_members: memberCount?.length || 0 })
        .eq('id', communityId);

      return { success: true };
    } catch (error) {
      console.error('Error joining community:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async getUserCommunity(userId: string): Promise<CommunityGroup | null> {
    try {
      console.log('🔍 Getting community for user:', userId);
      
      // First get the community member record
      const { data: member, error: memberError } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', userId)
        .single();

      if (memberError) {
        console.log('❌ No community membership found:', memberError.message);
        return null;
      }

      if (!member?.community_id) {
        console.log('❌ No community_id found in member record');
        return null;
      }

      console.log('✅ Found community membership, community_id:', member.community_id);

      // Then get the community details
      const { data: community, error: communityError } = await supabase
        .from('community_groups')
        .select('*')
        .eq('id', member.community_id)
        .single();

      if (communityError) {
        console.error('❌ Error fetching community details:', communityError);
        return null;
      }

      console.log('✅ Found community:', community?.name);
      return community;
    } catch (error) {
      console.error('Error fetching user community:', error);
      return null;
    }
  }

  async getCommunityMembers(communityId: string): Promise<CommunityMember[]> {
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching community members:', error);
      return [];
    }
  }

  async getCommunityAlerts(communityId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .or(`target_community_id.eq.${communityId},target_audience.eq.all`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching community alerts:', error);
      return [];
    }
  }
}

export const communityService = new CommunityService();