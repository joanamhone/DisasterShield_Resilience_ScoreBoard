import React from 'react';
import CommunityCard from './CommunityCard';
import Button from '../ui/Button';
import { PlusCircle, UserCheck, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock Data: Replace with Supabase fetch
const MOCK_MANAGED_COMMUNITY = {
  id: 'uuid-1',
  name: 'Kuntaja - Blantyre',
  leaderName: 'Jane Smith (You)', // This user is the leader
  memberCount: 128,
  region: 'Southern',
};
const MOCK_PENDING_REQUESTS = 5;

const CommunityManager: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  
  // TODO: Fetch the community this leader manages
  const managedCommunity = MOCK_MANAGED_COMMUNITY; // Assume they manage one

  if (!managedCommunity) {
    // If they don't manage a community yet, show a "Create" screen
    return (
      <div className="card p-6 text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Create Your Community</h2>
        <p className="text-text-secondary mb-4">
          Set up a community group for your assigned T.A. to manage members and send alerts.
        </p>
        <Button>
          <PlusCircle size={18} className="mr-2" />
          Create Community
        </Button>
      </div>
    );
  }

  // If they DO manage a community, show the dashboard
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Community Card */}
      <div className="lg:col-span-1">
        <CommunityCard community={managedCommunity} action="view" />
      </div>

      {/* Right Column: Management Actions */}
      <div className="lg:col-span-2 card p-6">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Management Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manage Members Card */}
          <div className="p-4 bg-surface rounded-lg">
            <UserCheck className="text-primary" size={24} />
            <h3 className="font-bold text-lg text-text-primary mt-2">Manage Members</h3>
            <p className="text-text-secondary text-sm mb-3">
              Approve or remove members from your community.
            </p> {/* <-- FIX WAS HERE */}
            <Button variant="outline" size="sm">
              View Requests 
              <span className="ml-2 bg-error text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {MOCK_PENDING_REQUESTS}
              </span>
            </Button>
          </div>

          {/* Create Report Card */}
          <div className="p-4 bg-surface rounded-lg">
            <BarChart2 className="text-primary" size={24} />
            <h3 className="font-bold text-lg text-text-primary mt-2">Create Report</h3>
            <p className="text-text-secondary text-sm mb-3">
              Submit a readiness or disaster report to the Coordinator.
            </p> {/* <-- FIX WAS HERE */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/reporting-center')}
            >
              Create New Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityManager;