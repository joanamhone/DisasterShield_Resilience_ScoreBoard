import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import CommunityCard from './CommunityCard';
import JoinCommunityModal from './JoinCommunityModal';

interface Community {
  id: string;
  name: string;
  location: string;
  description?: string;
  leader_id?: string;
  memberCount?: number;
}

const CommunityBrowser: React.FC<{ user: any }> = ({ user }) => {
  const [joinedCommunity, setJoinedCommunity] = useState<Community | null>(null);
  const [availableCommunities, setAvailableCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchCommunities();
  }, [user]);

  const fetchCommunities = async () => {
    console.log('Fetching communities for user:', user?.id);
    
    // Use localStorage for demo communities
    const hardcodedCommunities = [
      {
        id: 'mbare-001',
        name: 'Mbare Community',
        location: 'Harare, Zimbabwe',
        description: 'Active community in Mbare Township',
        memberCount: 245
      },
      {
        id: 'highfield-002',
        name: 'Highfield Community',
        location: 'Harare, Zimbabwe',
        description: 'Well-organized community in Highfield Township',
        memberCount: 312
      },
      {
        id: 'chitungwiza-003',
        name: 'Chitungwiza Community',
        location: 'Chitungwiza, Zimbabwe',
        description: 'Large community in Chitungwiza Town',
        memberCount: 428
      },
      {
        id: 'epworth-004',
        name: 'Epworth Community',
        location: 'Harare, Zimbabwe',
        description: 'Growing community in Epworth Settlement',
        memberCount: 189
      }
    ];

    // Check if user has joined a community (from localStorage)
    const joinedCommunityId = localStorage.getItem(`joined_community_${user?.id}`);
    
    if (joinedCommunityId) {
      const joined = hardcodedCommunities.find(c => c.id === joinedCommunityId);
      if (joined) {
        setJoinedCommunity(joined);
      }
    }

    // Set available communities (exclude joined one)
    const available = hardcodedCommunities.filter(c => c.id !== joinedCommunityId);
    setAvailableCommunities(available);
    setLoading(false);
  };

  const handleJoinCommunity = (community: Community) => {
    setSelectedCommunity(community);
    setShowJoinModal(true);
  };

  const handleJoinSuccess = () => {
    fetchCommunities();
    setShowJoinModal(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading communities...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Section for their current community */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">My Community</h2>
        {joinedCommunity ? (
          <div className="max-w-sm">
            <CommunityCard community={joinedCommunity} showViewAlerts={true} />
          </div>
        ) : (
          <p className="text-text-secondary">
            You haven't joined a community yet. Browse communities below to join one.
          </p>
        )}
      </div>

      {/* Section to browse other communities */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Available Communities ({availableCommunities.length})
        </h2>
        {availableCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCommunities.map(community => (
              <CommunityCard 
                key={community.id} 
                community={community} 
                action="join"
                onJoin={() => handleJoinCommunity(community)}
              />
            ))}
          </div>
        ) : (
          <p className="text-text-secondary">No communities available to join.</p>
        )}
      </div>

      <JoinCommunityModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        community={selectedCommunity}
        onSuccess={handleJoinSuccess}
      />
    </div>
  );
};

export default CommunityBrowser;