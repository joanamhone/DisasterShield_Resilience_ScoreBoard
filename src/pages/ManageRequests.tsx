import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2, Check, X } from 'lucide-react';
import Button from '../components/ui/Button';

// Define the shape of a join request
interface JoinRequest {
  id: string; // The ID of the request itself
  user_id: string;
  users: {
    full_name: string;
  };
}

const ManageRequests: React.FC = () => {
  const { user } = useAuth();
  const supabase = useSupabaseClient();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [communityId, setCommunityId] = useState<string | null>(null);

  // 1. Fetch the leader's community ID first
  useEffect(() => {
    const fetchLeaderCommunity = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('communities')
        .select('id')
        .eq('leader_id', user.id)
        .single();
      
      if (data) {
        setCommunityId(data.id);
      } else {
        console.error('No community found for this leader:', error);
        setLoading(false);
      }
    };
    fetchLeaderCommunity();
  }, [user, supabase]);

  // 2. Fetch pending requests for that community
  useEffect(() => {
    if (!communityId) return;

    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_join_requests')
        .select(`
          id,
          user_id,
          users ( full_name )
        `)
        .eq('community_id', communityId)
        .eq('status', 'pending');

      if (data) {
        setRequests(data as JoinRequest[]);
      } else {
        console.error('Error fetching requests:', error);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [communityId, supabase]);

  const handleRequest = async (request: JoinRequest, action: 'approve' | 'deny') => {
    if (!communityId) return;

    if (action === 'approve') {
      // 1. Add user to the community_members table
      const { error: memberError } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: request.user_id
        });

      if (memberError) {
        console.error('Error adding member:', memberError);
        alert('Failed to add member.');
        return;
      }
    }

    // 2. Update the request status to 'approved' or 'denied'
    const { error: updateError } = await supabase
      .from('community_join_requests')
      .update({ status: action === 'approve' ? 'approved' : 'denied' })
      .eq('id', request.id);

    if (updateError) {
      console.error('Error updating request:', updateError);
      alert('Failed to update request status.');
      return;
    }

    // 3. Remove the request from the local state
    setRequests(requests.filter(r => r.id !== request.id));
    alert(`User ${action}d!`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Manage Join Requests</h1>
      <div className="card p-6">
        {requests.length === 0 ? (
          <p className="text-text-secondary text-center">No pending join requests.</p>
        ) : (
          <ul className="divide-y divide-divider">
            {requests.map(request => (
              <li key={request.id} className="flex items-center justify-between py-4">
                <span className="text-text-primary font-medium">{request.users.full_name}</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleRequest(request, 'deny')}>
                    <X size={16} className="mr-1 text-error" />
                    Deny
                  </Button>
                  <Button size="sm" onClick={() => handleRequest(request, 'approve')}>
                    <Check size={16} className="mr-1" />
                    Approve
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;