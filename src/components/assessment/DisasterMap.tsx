import React from 'react';

// 1. Define the props the component expects
interface DisasterMapProps {
  latitude: number;
  longitude: number;
}

const DisasterMap: React.FC<DisasterMapProps> = ({ latitude, longitude }) => {
  // This is a placeholder for your map component.
  // The important part is that it now correctly receives the latitude and longitude.
  return (
    <div className="card p-4">
      <h3 className="font-bold text-text-primary mb-2">Disaster Risk Map</h3>
      <div className="bg-surface h-64 rounded-lg flex items-center justify-center">
        <p className="text-text-secondary">
          Map for location ({latitude.toFixed(4)}, {longitude.toFixed(4)}) would be displayed here.
        </p>
      </div>
    </div>
  );
};

export default DisasterMap;
