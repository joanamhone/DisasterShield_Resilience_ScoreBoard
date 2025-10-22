import { supabase } from '../lib/supabase';

export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  leader_id?: string;
  member_count?: number;
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
}

export const communityService = new CommunityService();