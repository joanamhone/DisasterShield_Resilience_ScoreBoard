import React, { useState, useEffect } from 'react';
import CommunityCard from './CommunityCard';
import JoinCommunityModal from './JoinCommunityModal';
import { communityService, CommunityGroup } from '../../services/communityService';

type Community = CommunityGroup & {
  memberCount?: number;
};

const CommunityBrowser: React.FC<{ user: any }> = ({ user }) => {
  const [joinedCommunity, setJoinedCommunity] = useState<Community | null>(null);
  const [availableCommunities, setAvailableCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, [user]);

  const fetchCommunities = async () => {
    if (!user?.id) {
      console.log('❌ No user ID available');
      return;
    }
    
    console.log('🔍 Fetching communities for user:', user.id);
    
    try {
      // Check if user has joined a community
      console.log('🔍 Checking if user has joined a community...');
      const userCommunity = await communityService.getUserCommunity(user.id);
      
      console.log('📊 User community result:', userCommunity);
      
      if (userCommunity) {
        console.log('✅ User has joined community:', userCommunity.name);
        setJoinedCommunity({
          ...userCommunity,
          memberCount: userCommunity.total_members || 0
        });
      } else {
        console.log('❌ User has not joined any community');
        setJoinedCommunity(null);
      }

      // Get all available communities
      console.log('🔍 Fetching all communities...');
      const allCommunities = await communityService.getCommunityGroups();
      console.log('📊 All communities:', allCommunities.length);
      
      // Filter out the community user has already joined
      const available = allCommunities
        .filter(c => c.id !== userCommunity?.id)
        .map(c => ({
          ...c,
          memberCount: c.total_members || 0
        }));
      
      console.log('📊 Available communities:', available.length);
      setAvailableCommunities(available);
    } catch (error) {
      console.error('❌ Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = (community: Community) => {
    setSelectedCommunity(community);
    setShowJoinModal(true);
  };

  const handleJoinSuccess = () => {
    console.log('✅ Join successful, refreshing communities...');
    // Add a small delay to ensure database is updated
    setTimeout(() => {
      fetchCommunities();
    }, 1000);
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