import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { MapPin, Users, Shield, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { communityService, CommunityGroup, CommunityMember } from '../../services/communityService';



const CommunityManager: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [managedCommunity, setManagedCommunity] = useState<CommunityGroup | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCommunityData();
    
    // Refresh members every 30 seconds to show new joiners
    const interval = setInterval(fetchCommunityData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchCommunityData = async () => {
    if (!user?.id) return;
    
    try {
      // Get all communities to find the one this user leads
      const allCommunities = await communityService.getCommunityGroups();
      const userCommunity = allCommunities.find(c => c.leader_id === user.id);
      
      if (!userCommunity) {
        console.log('User is not a community leader');
        setLoading(false);
        return;
      }
      
      setManagedCommunity(userCommunity);
      
      // Get members of this community
      const communityMembers = await communityService.getCommunityMembers(userCommunity.id);
      setMembers(communityMembers);
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const avgReadiness = Math.round(
    members.reduce((acc, m) => acc + parseFloat(m.readiness_score || '5'), 0) / members.length
  ) || 0;

  if (loading) {
    return <div className="text-center py-8">Loading community...</div>;
  }
  
  if (!managedCommunity) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">You are not assigned as a community leader yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Community</p>
              <p className="text-lg font-bold text-gray-900">{managedCommunity.name}</p>
              <p className="text-sm text-gray-500">{managedCommunity.location}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Community Readiness</p>
              <p className="text-2xl font-bold text-gray-900">{avgReadiness}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: `${avgReadiness}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Members List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Community Members</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={fetchCommunityData}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/send-alert')}
            >
              Send Community Alert
            </Button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {members.map((member) => (
            <div key={member.id} className="p-6 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{member.name}</h3>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>{member.phone_number}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {member.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    Joined: {new Date(member.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {parseFloat(member.readiness_score || '5').toFixed(1)}/10 Ready
                </p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  member.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                  member.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {member.risk_level} risk
                </span>
                {member.is_vulnerable && (
                  <div className="mt-1">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                      Vulnerable
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityManager;