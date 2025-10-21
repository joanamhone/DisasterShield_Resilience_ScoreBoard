import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// We will create these three components next
import CommunityBrowser from '../components/communities/CommunityBrowser';
import CommunityManager from '../components/communities/CommunityManager';
import CommunityCoordinatorView from '../components/communities/CommunityCoordinatorView';

const CommunitiesPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // This function renders the correct component based on the user's role
  const renderRoleView = () => {
    switch (user.userType) {
      case 'individual':
        return <CommunityBrowser user={user} />;
      case 'community_leader':
        return <CommunityManager user={user} />;
      case 'disaster_coordinator':
        return <CommunityCoordinatorView user={user} />;
      default:
        // This case handles any other user types or unassigned roles
        return <p className="text-text-secondary">You do not have access to this feature.</p>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">
        Communities
      </h1>
      {/* Render the view specific to the user's role */}
      {renderRoleView()}
    </div>
  );
};

export default CommunitiesPage;