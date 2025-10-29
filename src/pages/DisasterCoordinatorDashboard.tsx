import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  Users, 
  MapPin
} from 'lucide-react';

const DisasterCoordinatorDashboard: React.FC = () => {
  useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Regions Managed', value: '5', icon: MapPin, color: 'text-blue-600' },
    { label: 'Communities', value: '28', icon: Users, color: 'text-green-600' },
    { label: 'Schools', value: '12', icon: Shield, color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          District/Regional Overview
        </h1>
        <p className="text-gray-600">
          Regional Emergency Management Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// This line fixes the error
export default DisasterCoordinatorDashboard;
