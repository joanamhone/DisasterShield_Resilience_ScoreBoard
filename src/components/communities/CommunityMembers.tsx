import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Phone, Mail, MapPin, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CommunityMember {
  id: string;
  name: string;
  phone_number?: string;
  address?: string;
  readiness_score?: string;
  risk_level?: string;
  is_vulnerable: boolean;
  user_id?: string;
  email?: string;
}

const CommunityMembers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [communityName, setCommunityName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityMembers = async () => {
      if (!id) return;

      try {
        // Get community info
        const { data: community } = await supabase
          .from('community_groups')
          .select('name')
          .eq('id', id)
          .single();

        if (community) {
          setCommunityName(community.name);
        }

        // Get community members with user email
        const { data: membersData, error } = await supabase
          .from('community_members')
          .select(`
            id,
            name,
            phone_number,
            address,
            readiness_score,
            risk_level,
            is_vulnerable,
            user_id,
            users(email)
          `)
          .eq('community_id', id);

        if (error) throw error;

        const processedMembers = membersData?.map(member => ({
          ...member,
          email: member.users?.email
        })) || [];

        setMembers(processedMembers);
      } catch (error) {
        console.error('Error fetching community members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityMembers();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/communities')}
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{communityName} Members</h1>
          <p className="text-text-secondary">{members.length} community members</p>
        </div>
      </div>

      {/* Members List */}
      <div className="grid gap-4">
        {members.length === 0 ? (
          <div className="card p-8 text-center">
            <Users size={48} className="mx-auto text-text-tertiary mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No Members Found</h3>
            <p className="text-text-secondary">This community doesn't have any members yet.</p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-text-primary">{member.name}</h3>
                    {member.is_vulnerable && (
                      <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full flex items-center">
                        <Shield size={12} className="mr-1" />
                        Vulnerable
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-text-secondary">
                    {member.phone_number && (
                      <div className="flex items-center">
                        <Phone size={14} className="mr-2" />
                        {member.phone_number}
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center">
                        <Mail size={14} className="mr-2" />
                        {member.email}
                      </div>
                    )}
                    {member.address && (
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2" />
                        {member.address}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {member.readiness_score && (
                    <div className="mb-1">
                      <span className="text-sm text-text-secondary">Readiness: </span>
                      <span className={`font-medium ${
                        parseFloat(member.readiness_score) >= 7 ? 'text-success' :
                        parseFloat(member.readiness_score) >= 5 ? 'text-warning' : 'text-error'
                      }`}>
                        {member.readiness_score}/10
                      </span>
                    </div>
                  )}
                  {member.risk_level && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.risk_level === 'low' ? 'bg-success/20 text-success' :
                      member.risk_level === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-error/20 text-error'
                    }`}>
                      {member.risk_level.charAt(0).toUpperCase() + member.risk_level.slice(1)} Risk
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityMembers;