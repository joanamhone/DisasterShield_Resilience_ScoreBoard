import React from 'react';
import CommunityCard from './CommunityCard';

// Mock Data: Replace this with a Supabase fetch
const MOCK_JOINED_COMMUNITY = {
  id: 'uuid-1',
  name: 'Kuntaja - Blantyre',
  leaderName: 'Jane Smith',
  memberCount: 128,
  region: 'Southern',
};

const MOCK_NEARBY_COMMUNITIES = [
  { id: 'uuid-2', name: 'Somba - Blantyre', leaderName: 'Alex Johnson', memberCount: 76, region: 'Southern' },
  { id: 'uuid-3', name: 'Machinjiri - Blantyre', leaderName: 'Mike Tembo', memberCount: 204, region: 'Southern' },
];

const CommunityBrowser: React.FC<{ user: any }> = ({ user }) => {
  // TODO:
  // 1. Fetch the user's currently joined community (based on their profile's TA)
  // 2. Fetch "nearby" communities (other TAs in their district)

  return (
    <div className="space-y-8">
      {/* Section for their current community */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">My Community</h2>
        {MOCK_JOINED_COMMUNITY ? (
          <div className="max-w-sm">
            <CommunityCard community={MOCK_JOINED_COMMUNITY} action="view" />
          </div>
        ) : (
          <p className="text-text-secondary">
            You haven't joined a community yet. Complete your profile to be assigned one.
          </p>
        )}
      </div>

      {/* Section to browse other communities */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Nearby Communities (in your District)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_NEARBY_COMMUNITIES.map(community => (
            <CommunityCard key={community.id} community={community} action="join" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityBrowser;