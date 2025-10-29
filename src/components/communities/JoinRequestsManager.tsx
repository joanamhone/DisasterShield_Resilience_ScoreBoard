import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../../contexts/AuthContext';
import { Check, X, User, Phone, Mail } from 'lucide-react';
import Button from '../ui/Button';

interface JoinRequest {
  id: string;
  user_id: string;
  community_id: string;
  phone_number: string;
  email: string;
  status: string;
  created_at: string;
  users: {
    full_name: string;
    location: string;
  };
}

const JoinRequestsManager: React.FC = () => {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const { user } = useAuth();

  useEffect(() => {
    fetchJoinRequests();
  }, []);

  const fetchJoinRequests = async () => {
    try {
      // Get join requests from localStorage
      const joinRequests = JSON.parse(localStorage.getItem('join_requests') || '[]');
      
      // Community leaders see all pending requests
      const pendingRequests = joinRequests
        .filter((req: any) => req.status === 'pending')
        .map((req: any) => ({
          id: req.id,
          user_id: req.userId,
          community_id: req.communityId,
          community_name: req.communityName,
          phone_number: req.phoneNumber,
          email: req.email,
          status: req.status,
          created_at: req.timestamp,
          users: {
            full_name: req.userName,
            location: req.userLocation
          }
        }));
      
      setRequests(pendingRequests);
    } catch (error) {
      console.error('Error fetching join requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: string, action: 'approve' | 'reject', request: JoinRequest) => {
    try {
      // Update request status in localStorage
      const joinRequests = JSON.parse(localStorage.getItem('join_requests') || '[]');
      const updatedRequests = joinRequests.map((req: any) => 
        req.id === requestId ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
      );
      localStorage.setItem('join_requests', JSON.stringify(updatedRequests));

      // If approved, add to joined community in localStorage
      if (action === 'approve') {
        localStorage.setItem(`joined_community_${request.user_id}`, request.community_id);
      }

      // Refresh the list
      fetchJoinRequests();
      
      alert(`Request ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request. Please try again.`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading join requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No pending join requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Pending Join Requests</h2>
      
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    {request.users.full_name}
                  </h3>
                </div>
                <p className="text-sm font-medium text-blue-600 mb-2">
                  Wants to join: {request.community_name}
                </p>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{request.phone_number}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{request.email}</span>
                  </div>
                  <p>Location: {request.users.location}</p>
                  <p>Requested: {new Date(request.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  onClick={() => handleRequest(request.id, 'approve', request)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRequest(request.id, 'reject', request)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinRequestsManager;