import React, { useState } from 'react';
import { User, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PersonalProgress from '../components/progress/PersonalProgress';
import CommunityProgress from '../components/progress/CommunityProgress';

const Progress: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>('personal');

  const isCommunityLeader = user?.userType === 'community_leader';

  return (
    <div className="space-y-6 pb-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Track Your Progress</h1>

        {isCommunityLeader && (
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User size={20} />
              Personal Progress
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'community'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users size={20} />
              Community Progress
            </button>
          </div>
        )}

        {activeTab === 'personal' ? (
          <PersonalProgress />
        ) : (
          <CommunityProgress />
        )}
      </div>
    </div>
  );
};

export default Progress;
