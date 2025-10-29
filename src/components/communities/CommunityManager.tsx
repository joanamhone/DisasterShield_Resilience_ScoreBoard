import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { MapPin, Users, Shield, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_MANAGED_COMMUNITY = {
  id: 'mbare-001',
  name: 'Mbare Community',
  location: 'Mbare Township, Harare, Zimbabwe'
};

const CommunityManager: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCommunityMembers();
    
    // Refresh members every 30 seconds to show new joiners
    const interval = setInterval(fetchCommunityMembers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCommunityMembers = () => {
    // Get real members who joined this community
    const joinRequests = JSON.parse(localStorage.getItem('join_requests') || '[]');
    const communityMembers = joinRequests
      .filter((request: any) => request.communityId === MOCK_MANAGED_COMMUNITY.id)
      .map((request: any) => ({
        id: request.userId,
        name: request.userName,
        phone: request.phoneNumber,
        email: request.email,
        address: request.userLocation,
        readiness: Math.floor(Math.random() * 40) + 60, // Random readiness 60-100%
        risk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        joinedAt: request.timestamp
      }));

    // Add some dummy members if no real members exist
    if (communityMembers.length === 0) {
      const dummyMembers = [
        { id: 'demo-1', name: 'Tendai Mukamuri', phone: '+263771234567', address: 'Mbare Township', readiness: 85, risk: 'low' },
        { id: 'demo-2', name: 'Grace Chikwanha', phone: '+263712345678', address: 'Mbare Township', readiness: 72, risk: 'medium' }
      ];
      setMembers(dummyMembers);
    } else {
      setMembers(communityMembers);
    }
    
    setLoading(false);
  };

  const managedCommunity = MOCK_MANAGED_COMMUNITY;
  const avgReadiness = Math.round(members.reduce((acc, m) => acc + m.readiness, 0) / members.length) || 0;

  if (loading) {
    return <div className="text-center py-8">Loading community...</div>;
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
              onClick={fetchCommunityMembers}
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
                    <span>{member.phone}</span>
                  </div>
                  {member.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span>{member.email}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {member.address}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {member.readiness}% Ready
                </p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  member.risk === 'high' ? 'bg-red-100 text-red-800' :
                  member.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {member.risk} risk
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityManager;