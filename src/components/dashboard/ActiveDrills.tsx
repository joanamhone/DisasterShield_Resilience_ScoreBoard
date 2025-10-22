import React from 'react';
import { useDrills } from '../../hooks/useDrills';
import { Calendar, MapPin, Users, Clock, Play, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const ActiveDrills: React.FC = () => {
  const { activeDrills, updateDrillStatus, loading } = useDrills();

  const handleStartDrill = async (drillId: string) => {
    await updateDrillStatus(drillId, 'in_progress');
  };

  const handleCompleteDrill = async (drillId: string) => {
    const participants = prompt('How many participants attended?');
    if (participants) {
      await updateDrillStatus(drillId, 'completed', parseInt(participants));
    }
  };

  const getDrillTypeIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return '🔥';
      case 'earthquake':
        return '🌍';
      case 'flood':
        return '🌊';
      case 'evacuation':
        return '🚪';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Active Drills</h3>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary">Active Drills</h3>
        <span className="text-sm text-text-secondary">
          {activeDrills.length} active
        </span>
      </div>

      {activeDrills.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          <Calendar className="mx-auto mb-3 text-gray-400" size={48} />
          <p>No active drills</p>
          <button
            onClick={() => window.location.href = '/schedule-drill'}
            className="mt-2 text-primary hover:underline text-sm"
          >
            Schedule your first drill
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeDrills.map((drill) => (
            <div key={drill.id} className="p-4 bg-surface rounded-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {getDrillTypeIcon(drill.drill_type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">
                      {drill.title}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">
                      {drill.description}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(drill.status)}`}>
                  {drill.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-text-secondary mb-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>{format(new Date(drill.scheduled_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>{format(new Date(drill.scheduled_date), 'HH:mm')}</span>
                </div>
                {drill.location && (
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{drill.location}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  <span>{drill.participants_count} participants</span>
                </div>
              </div>

              <div className="flex space-x-2">
                {drill.status === 'scheduled' && (
                  <button
                    onClick={() => handleStartDrill(drill.id)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    <Play size={14} className="mr-1" />
                    Start Drill
                  </button>
                )}
                {drill.status === 'in_progress' && (
                  <button
                    onClick={() => handleCompleteDrill(drill.id)}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Complete Drill
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveDrills;