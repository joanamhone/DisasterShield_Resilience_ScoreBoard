import React, { useState, useEffect } from 'react';
import locationData from '../../data/locations.json'; // Import the JSON data

interface LocationSelectorProps {
  onLocationChange: (location: { region: string; district: string; ta: string }) => void;
  // Add props for default values if needed, e.g., defaultRegion, defaultDistrict
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTa, setSelectedTa] = useState('');

  const [districts, setDistricts] = useState<{ name: string; tas: string[] }[]>([]);
  const [tas, setTas] = useState<string[]>([]);

  // Update districts when region changes
  useEffect(() => {
    if (selectedRegion) {
      const region = locationData.regions.find(r => r.name === selectedRegion);
      setDistricts(region ? region.districts : []);
      setSelectedDistrict('');
      setTas([]);
      setSelectedTa('');
    }
  }, [selectedRegion]);

  // Update TAs when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find(d => d.name === selectedDistrict);
      setTas(district ? district.tas : []);
      setSelectedTa('');
    }
  }, [selectedDistrict, districts]);

  // Notify parent of final selection
  useEffect(() => {
    if (selectedRegion && selectedDistrict && selectedTa) {
      onLocationChange({
        region: selectedRegion,
        district: selectedDistrict,
        ta: selectedTa,
      });
    }
  }, [selectedRegion, selectedDistrict, selectedTa, onLocationChange]);

  return (
    <div className="space-y-4">
      {/* Region Selector */}
      <div>
        <label htmlFor="region" className="block text-sm font-medium text-text-secondary">
          Region
        </label>
        <select
          id="region"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="mt-1 block w-full input" // 'input' is your global input style
        >
          <option value="">Select Region</option>
          {locationData.regions.map((region) => (
            <option key={region.name} value={region.name}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      {/* District Selector */}
      <div>
        <label htmlFor="district" className="block text-sm font-medium text-text-secondary">
          District
        </label>
        <select
          id="district"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={!selectedRegion}
          className="mt-1 block w-full input"
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.name} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* TA/STA Selector */}
      <div>
        <label htmlFor="ta" className="block text-sm font-medium text-text-secondary">
          Traditional Authority (T.A.)
        </label>
        <select
          id="ta"
          value={selectedTa}
          onChange={(e) => setSelectedTa(e.target.value)}
          disabled={!selectedDistrict}
          className="mt-1 block w-full input"
        >
          <option value="">Select T.A./S.T.A.</option>
          {tas.map((ta) => (
            <option key={ta} value={ta}>
              {ta}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;