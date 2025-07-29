import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, AlertTriangle, BarChart3, TrendingUp } from 'lucide-react';

// Assuming these are correctly set up in your project
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../hooks/useLocation';

// Import the service that gets weather for the model
import { getWeather } from '../services/predictionService'; 
// Import the component's data interface
import WeatherParameters, { WeatherData } from '../components/assessment/WeatherParameters';

// Other component imports
import DisasterMap from '../components/assessment/DisasterMap';
import HistoricalTrendsChart from '../components/charts/HistoricalTrendsChart';
import EnvironmentalChart from '../components/charts/EnvironmentalChart';


const Assessment: React.FC = () => {
  // Custom hooks
  const userLocation = useLocation(); // Provides { city, country, latitude, longitude, loading, error }
  const { user } = useAuth();

  // State
  const [location, setLocation] = useState('Loading location...');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // State to hold weather data
  const [lastUpdated, setLastUpdated] = useState('N/A');
  const [loading, setLoading] = useState(true); // Start with loading true
  
  // Chart-related state remains the same
  const [trendsTimeRange, setTrendsTimeRange] = useState<'hour' | 'month' | 'year'>('month');
  const [environmentalTimeRange, setEnvironmentalTimeRange] = useState<'hour' | 'month' | 'year'>('month');
  const [environmentalParameter, setEnvironmentalParameter] = useState<'temperature' | 'rainfall' | 'humidity' | 'windspeed'>('temperature');

  // Effect to fetch weather data once location is available
  useEffect(() => {
    // Only proceed if we have coordinates
    if (userLocation.latitude && userLocation.longitude) {
      setLoading(true);

      // Set the display location name
      if (user?.location) {
        setLocation(user.location);
      } else if (userLocation.city && userLocation.country) {
        setLocation(`${userLocation.city}, ${userLocation.country}`);
      }

      // Fetch weather using the service
      getWeather(userLocation.latitude, userLocation.longitude)
        .then(data => {
          // On success, update the weatherData state
          setWeatherData(data);
          setLastUpdated(new Date().toLocaleTimeString());
        })
        .catch(error => {
          // On error, log it and update UI accordingly
          console.error("Failed to fetch weather for assessment:", error);
          setLocation("Could not fetch weather data.");
        })
        .finally(() => {
          // Once done, set loading to false
          setLoading(false);
        });
    } else if (userLocation.error) {
        setLocation(userLocation.error);
        setLoading(false);
    }
  }, [userLocation.latitude, userLocation.longitude, userLocation.error, userLocation.city, userLocation.country, user]);


  // Refresh function can now re-trigger the weather fetch
  const refreshData = () => {
    if (userLocation.latitude && userLocation.longitude) {
        setLoading(true);
        getWeather(userLocation.latitude, userLocation.longitude)
          .then(data => {
            setWeatherData(data);
            setLastUpdated(new Date().toLocaleTimeString());
          })
          .catch(error => console.error("Failed to refresh weather:", error))
          .finally(() => setLoading(false));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* --- Location and Update Header --- */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <MapPin size={16} className="inline mr-1" />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
              placeholder="Enter your location"
              disabled={userLocation.loading || loading}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={refreshData}
              disabled={loading || !userLocation.latitude}
              className="flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
            >
              <RefreshCw 
                className={`mr-2 ${loading ? 'animate-spin' : ''}`} 
                size={16} 
              />
              Update
            </button>
          </div>
        </div>
        <p className="text-xs text-text-tertiary mt-3">Last updated: {lastUpdated}</p>
      </div>

      {/* --- Weather Parameters --- 
          Now passes the fetched data down as a prop.
      */}
      <WeatherParameters 
        location={location} 
        weatherData={weatherData}
      />

      {/* --- Interactive Charts Section (No Changes Needed Here) --- */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center">
              <BarChart3 className="mr-2" size={20} />
              Risk Analysis
            </h3>
            <div className="flex bg-surface rounded-lg p-1">
              {(['hour', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTrendsTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    trendsTimeRange === range
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {range === 'hour' ? '24H' : range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <HistoricalTrendsChart timeRange={trendsTimeRange} location={location} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Environmental Data
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={environmentalParameter}
                onChange={(e) => setEnvironmentalParameter(e.target.value as any)}
                className="bg-surface border border-border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="temperature">Temperature</option>
                <option value="rainfall">Rainfall</option>
                <option value="humidity">Humidity</option>
                <option value="windspeed">Wind Speed</option>
              </select>
              <div className="flex bg-surface rounded-lg p-1">
                {(['hour', 'month', 'year'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setEnvironmentalTimeRange(range)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      environmentalTimeRange === range
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {range === 'hour' ? '24H' : range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <EnvironmentalChart 
            timeRange={environmentalTimeRange} 
            location={location}
            parameter={environmentalParameter}
          />
        </div>
      </div>

      {/* --- Other Components (No Changes Needed) --- */}
      {userLocation.latitude && userLocation.longitude && (
        <DisasterMap latitude={userLocation.latitude} longitude={userLocation.longitude} />
      )}

      <div className="card p-4 flex items-center">
        <AlertTriangle className="text-risk-high mr-3" size={24} />
        <span className="font-medium text-text-primary">
          Overall Risk Level: <span className="font-bold text-risk-high">High</span>
        </span>
      </div>
    </div>
  );
}

export default Assessment;
