import React from 'react';
import { User, Users, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

// Define the properties the card will accept
interface Community {
  id: string;
  name: string;
  location: string;
  description?: string;
  leader_id?: string;
  memberCount?: number;
}

interface CommunityCardProps {
  community: Community;
  action?: 'join';
  onJoin?: () => void;
  showViewAlerts?: boolean;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, action, onJoin, showViewAlerts = false }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (action === 'join') {
      if (onJoin) {
        onJoin();
      } else {
        console.log('Joining community:', community.name);
        alert(`Joined ${community.name}!`);
      }
    }
  };

  return (
    <div className="card flex flex-col justify-between p-5 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-primary truncate">{community.name}</h3>
        <p className="text-sm text-text-secondary flex items-center">
          <MapPin size={14} className="mr-2" />
          {community.location}
        </p>
        {community.description && (
          <p className="text-sm text-text-secondary mt-2">{community.description}</p>
        )}
      </div>

      <div className="text-sm text-text-secondary space-y-2">
        <p className="flex items-center">
          <Users size={14} className="mr-2" />
          Members: <span className="font-medium text-text-primary ml-1">{community.memberCount || 0}</span>
        </p>
        {community.description && (
          <p className="text-xs text-gray-500 mt-2">{community.description}</p>
        )}
      </div>

      {action === 'join' && (
        <Button onClick={handleAction} variant="outline">
          Join Community
        </Button>
      )}
      {showViewAlerts && (
        <Button onClick={() => navigate('/community-alerts')} variant="default">
          View Alerts
        </Button>
      )}
    </div>
  );
};

export default CommunityCard;