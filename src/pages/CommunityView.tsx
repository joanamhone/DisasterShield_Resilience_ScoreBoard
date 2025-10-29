import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, Phone, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

interface CommunityMember {
  id: string;
  name: string;
  phone_number: string;
  address: string;
  readiness_score: number;
  risk_level: string;
  created_at: string;
}

const CommunityView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<any>(null);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityData();
  }, [id]);

  const fetchCommunityData = () => {
    // Get community info
    const communities = [
      { id: 'mbare-001', name: 'Mbare Community', location: 'Harare, Zimbabwe', memberCount: 245 },
      { id: 'highfield-002', name: 'Highfield Community', location: 'Harare, Zimbabwe', memberCount: 312 },
      { id: 'chitungwiza-003', name: 'Chitungwiza Community', location: 'Chitungwiza, Zimbabwe', memberCount: 428 },
      { id: 'epworth-004', name: 'Epworth Community', location: 'Harare, Zimbabwe', memberCount: 189 }
    ];

    const foundCommunity = communities.find(c => c.id === id);
    setCommunity(foundCommunity);

    // Get members from localStorage
    const joinRequests = JSON.parse(localStorage.getItem('join_requests') || '[]');
    const approvedMembers = joinRequests
      .filter((req: any) => req.status === 'approved' && req.communityId === id)
      .map((req: any) => ({
        id: req.id,
        name: req.userName,
        phone_number: req.phoneNumber,
        address: req.userLocation,
        readiness_score: Math.floor(Math.random() * 40) + 60,
        risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        created_at: req.timestamp
      }));

    // Add demo members for each community
    const demoMembers = [
      {
        id: 'demo-1',
        name: 'Tendai Mukamuri',
        phone_number: '+263771234567',
        address: foundCommunity?.location || 'Harare, Zimbabwe',
        readiness_score: 85,
        risk_level: 'low',
        created_at: '2024-01-10T10:00:00Z'
      },
      {
        id: 'demo-2',
        name: 'Grace Chikwanha', 
        phone_number: '+263712345678',
        address: foundCommunity?.location || 'Harare, Zimbabwe',
        readiness_score: 72,
        risk_level: 'medium',
        created_at: '2024-01-08T14:30:00Z'
      }
    ];

    setMembers([...demoMembers, ...approvedMembers]);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading community...</div>;
  }

  if (!community) {
    return <div className="text-center py-8">Community not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/communities')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{community.name}</h1>
          <div className="flex items-center text-gray-600 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{community.location}</span>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-bold">%</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Readiness</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(members.reduce((acc, m) => acc + m.readiness_score, 0) / members.length) || 0}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 font-bold">!</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.risk_level === 'high').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Community Members</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {members.map((member) => (
            <div key={member.id} className="p-6 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{member.name}</h3>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {member.phone_number}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {member.address}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {member.readiness_score}% Ready
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    member.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                    member.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {member.risk_level} risk
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityView;