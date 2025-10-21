import React from 'react';
import { useNavigate } from 'react-router-dom';

// Mock Data: Replace with a Supabase fetch of ALL communities
const MOCK_ALL_COMMUNITIES = [
  { id: 'uuid-1', name: 'Kuntaja - Blantyre', leaderName: 'Jane Smith', memberCount: 128, region: 'Southern' },
  { id: 'uuid-2', name: 'Somba - Blantyre', leaderName: 'Alex Johnson', memberCount: 76, region: 'Southern' },
  { id: 'uuid-3', name: 'Machinjiri - Blantyre', leaderName: 'Mike Tembo', memberCount: 204, region: 'Southern' },
  { id: 'uuid-4', name: 'Kachere - Dedza', leaderName: 'Grace Phiri', memberCount: 150, region: 'Central' },
  { id: 'uuid-5', name: 'Chauma - Dedza', leaderName: 'David Banda', memberCount: 95, region: 'Central' },
  { id: 'uuid-6', name: 'Mwenewenya - Chitipa', leaderName: 'Chrispin Moyo', memberCount: 110, region: 'Northern' },
];

// Helper function to group communities by region
const groupCommunities = (communities) => {
  return communities.reduce((acc, community) => {
    const region = community.region;
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(community);
    return acc;
  }, {});
};

const CommunityCoordinatorView: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  
  // TODO: Fetch ALL communities from Supabase
  const communitiesByRegion = groupCommunities(MOCK_ALL_COMMUNITIES);

  return (
    <div className="space-y-8">
      {Object.keys(communitiesByRegion).sort().map(region => (
        <section key={region}>
          <h2 className="text-2xl font-bold text-primary mb-3 pb-2 border-b border-divider">
            {region} Region
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communitiesByRegion[region].map(community => (
              <div 
                key={community.id} 
                className="card p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/community/${community.id}`)} // Go to chat/details
              >
                <h3 className="font-semibold text-text-primary">{community.name}</h3>
                <p className="text-sm text-text-secondary">Leader: {community.leaderName}</p>
                <p className="text-sm text-text-secondary">Members: {community.memberCount}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CommunityCoordinatorView;