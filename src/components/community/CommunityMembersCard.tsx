import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface CommunityGroup {
  id: string;
  name: string;
  location: string;
  district?: string;
  traditional_authority?: string;
  village?: string;
  total_members: number;
  average_readiness_score: number;
  demographics: {
    age_groups?: {
      children: number;
      youth: number;
      adults: number;
      elderly: number;
    };
    gender?: {
      male: number;
      female: number;
      other: number;
    };
    vulnerable_count?: number;
  };
}

const CommunityMembersCard: React.FC = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCommunity, setExpandedCommunity] = useState<string | null>(null);

  useEffect(() => {
    loadCommunities();
  }, [user]);

  const loadCommunities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('community_groups')
        .select('*')
        .eq('leader_id', user.id);

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (communityId: string) => {
    setExpandedCommunity(expandedCommunity === communityId ? null : communityId);
  };

  const calculateTotalMembers = () => {
    return communities.reduce((sum, c) => sum + c.total_members, 0);
  };

  const calculateAverageReadiness = () => {
    if (communities.length === 0) return 0;
    const total = communities.reduce((sum, c) => sum + c.average_readiness_score, 0);
    return Math.round(total / communities.length);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Community Members
        </h3>
        <span className="text-sm text-gray-500">{communities.length} groups</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Members</div>
          <div className="text-2xl font-bold text-gray-900">{calculateTotalMembers()}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Readiness</div>
          <div className="text-2xl font-bold text-green-600">{calculateAverageReadiness()}%</div>
        </div>
      </div>

      <div className="space-y-3">
        {communities.length > 0 ? (
          communities.map((community) => (
            <div key={community.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpanded(community.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{community.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin size={14} />
                    {community.location}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{community.total_members}</div>
                    <div className="text-xs text-gray-500">members</div>
                  </div>
                  {expandedCommunity === community.id ? (
                    <ChevronUp className="text-gray-400" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={20} />
                  )}
                </div>
              </button>

              {expandedCommunity === community.id && (
                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                  <div className="mt-3 space-y-3">
                    {community.district && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">District:</span>
                        <span className="text-gray-600 ml-2">{community.district}</span>
                      </div>
                    )}
                    {community.traditional_authority && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Traditional Authority:</span>
                        <span className="text-gray-600 ml-2">{community.traditional_authority}</span>
                      </div>
                    )}
                    {community.village && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Village:</span>
                        <span className="text-gray-600 ml-2">{community.village}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp size={16} className="text-green-600" />
                      <span className="text-sm">
                        <span className="font-medium text-gray-700">Readiness Score:</span>
                        <span className="text-green-600 ml-2 font-bold">{Math.round(community.average_readiness_score)}%</span>
                      </span>
                    </div>

                    {community.demographics && Object.keys(community.demographics).length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-2">Demographics</div>

                        {community.demographics.age_groups && (
                          <div className="mb-3">
                            <div className="text-xs text-gray-600 mb-2">Age Distribution</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-xs">
                                <span className="text-gray-500">Children:</span>
                                <span className="ml-1 font-medium">{community.demographics.age_groups.children}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Youth:</span>
                                <span className="ml-1 font-medium">{community.demographics.age_groups.youth}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Adults:</span>
                                <span className="ml-1 font-medium">{community.demographics.age_groups.adults}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Elderly:</span>
                                <span className="ml-1 font-medium">{community.demographics.age_groups.elderly}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {community.demographics.gender && (
                          <div className="mb-3">
                            <div className="text-xs text-gray-600 mb-2">Gender Distribution</div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="text-xs">
                                <span className="text-gray-500">Male:</span>
                                <span className="ml-1 font-medium">{community.demographics.gender.male}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Female:</span>
                                <span className="ml-1 font-medium">{community.demographics.gender.female}</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-gray-500">Other:</span>
                                <span className="ml-1 font-medium">{community.demographics.gender.other}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {community.demographics.vulnerable_count !== undefined && (
                          <div className="text-xs">
                            <span className="text-gray-500">Vulnerable Members:</span>
                            <span className="ml-1 font-medium text-orange-600">{community.demographics.vulnerable_count}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No community groups yet</p>
            <p className="text-sm text-gray-400">Create your first community group to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityMembersCard;
