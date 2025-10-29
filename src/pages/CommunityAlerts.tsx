import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';

const CommunityAlerts: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/communities')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Alerts</h1>
          <p className="text-gray-600">Stay informed about important community updates</p>
        </div>
      </div>

      {/* No Alerts Message */}
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Bell className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
        <p className="text-gray-600 mb-6">
          You'll receive community alerts and emergency notifications here when they're sent by your community leader.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-900">Stay Prepared</p>
              <p className="text-sm text-blue-700">
                Make sure your emergency kit is ready and your family has an evacuation plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityAlerts;