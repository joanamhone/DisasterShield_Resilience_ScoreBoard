import React from 'react';
import { User, Users, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

// Define the properties the card will accept
interface Community {
  id: string; // Will be a UUID from Supabase
  name: string; // e.g., "Kuntaja - Blantyre"
  leaderName: string; // e.g., "John Doe"
  memberCount: number;
  region: string;
}

interface CommunityCardProps {
  community: Community;
  action?: 'join' | 'view'; // Define what the button should do
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, action }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (action === 'view') {
      // Navigate to the chat page for this community
      navigate(`/community/${community.id}`);
    }
    if (action === 'join') {
      // TODO: Add Supabase logic to join this community
      console.log('Joining community:', community.name);
      alert(`Request to join ${community.name} sent!`);
    }
  };

  return (
    <div className="card flex flex-col justify-between p-5 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-primary truncate">{community.name}</h3>
        <p className="text-sm text-text-secondary flex items-center">
          <MapPin size={14} className="mr-2" />
          {community.region} Region
        </p>
      </div>

      <div className="text-sm text-text-secondary space-y-2">
        <p className="flex items-center">
          <User size={14} className="mr-2" />
          Leader: <span className="font-medium text-text-primary ml-1">{community.leaderName}</span>
        </p>
        <p className="flex items-center">
          <Users size={14} className="mr-2" />
          Members: <span className="font-medium text-text-primary ml-1">{community.memberCount}</span>
        </p>
      </div>

      {action && (
        <Button onClick={handleAction} variant={action === 'join' ? 'outline' : 'default'}>
          {action === 'join' ? 'Join Community' : 'View Community'}
        </Button>
      )}
    </div>
  );
};

export default CommunityCard;