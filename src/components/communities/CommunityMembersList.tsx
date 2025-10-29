import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, MessageSquare, Bell } from 'lucide-react';
import Button from '../ui/Button';

interface CommunityMember {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  address: string;
  readiness_score: number;
  risk_level: string;
  is_vulnerable: boolean;
  created_at: string;
  users?: {
    full_name: string;
    location: string;
  };
}

const CommunityMembersList: React.FC = () => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunityMembers();
  }, []);

  const fetchCommunityMembers = async () => {
    try {
      // Get approved members from localStorage
      const joinRequests = JSON.parse(localStorage.getItem('join_requests') || '[]');
      const approvedMembers = joinRequests
        .filter((req: any) => req.status === 'approved')
        .map((req: any) => ({
          id: req.id,
          user_id: req.userId,
          name: req.userName,
          phone_number: req.phoneNumber,
          address: req.userLocation,
          readiness_score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
          risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          is_vulnerable: Math.random() > 0.8,
          created_at: req.timestamp
        }));
      
      // Add some demo members
      const demoMembers = [
        {
          id: 'demo-member-1',
          name: 'Tendai Mukamuri',
          phone_number: '+263771234567',
          address: 'Mbare Township, Harare',
          readiness_score: 85,
          risk_level: 'low',
          is_vulnerable: false,
          created_at: '2024-01-10T10:00:00Z'
        },
        {
          id: 'demo-member-2', 
          name: 'Grace Chikwanha',
          phone_number: '+263712345678',
          address: 'Mbare Township, Harare',
          readiness_score: 72,
          risk_level: 'medium',
          is_vulnerable: false,
          created_at: '2024-01-08T14:30:00Z'
        }
      ];
      
      setMembers([...demoMembers, ...approvedMembers]);
    } catch (error) {
      console.error('Error fetching community members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (member: CommunityMember, type: 'sms' | 'push') => {
    alert(`Sending ${type} to ${member.name}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading community members...</div>;
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No community members yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Community Members ({members.length})
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/send-alert')}
          >
            Send Community Alert
          </Button>
          <Button variant="outline" size="sm">
            Export List
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {members.map((member) => (
          <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    {member.name}
                  </h3>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone_number}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{member.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      member.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                      member.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {member.readiness_score}% • {member.risk_level} risk
                    </span>
                  </div>
                  <p>Joined: {new Date(member.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendMessage(member, 'sms')}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  SMS
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendMessage(member, 'push')}
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Alert
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityMembersList;