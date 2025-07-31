import React from 'react';
import { Thermometer, Droplets, Wind, Gauge, Loader2, AlertTriangle } from 'lucide-react';
import { WeatherData } from '../../services/predictionService'; // Assuming this is the correct path

// 1. Define the props the component expects
export interface WeatherParametersProps {
  location: string;
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

const WeatherParameters: React.FC<WeatherParametersProps> = ({
  location,
  weatherData,
  isLoading,
  error
}) => {
  // 2. Handle the loading state
  if (isLoading) {
    return (
      <div className="card p-4 text-center">
        <Loader2 className="animate-spin text-primary mx-auto mb-2" />
        <p className="text-text-secondary">Loading Weather Parameters...</p>
      </div>
    );
  }

  // 3. Handle the error state
  if (error) {
    return (
      <div className="card p-4 text-center bg-error/10">
        <AlertTriangle className="text-error mx-auto mb-2" />
        <p className="font-semibold text-error">Could not load weather data</p>
        <p className="text-xs text-text-secondary mt-1">{error}</p>
      </div>
    );
  }
  
  if (!weatherData) {
    return (
      <div className="card p-4 text-center">
        <p className="text-text-secondary">Weather data is unavailable.</p>
      </div>
    );
  }

  const parameters = [
    {
      id: 1,
      label: 'Temperature',
      value: `${Math.round(weatherData.temperature)}°C`,
      icon: Thermometer,
    },
    {
      id: 2,
      label: 'Humidity',
      value: `${weatherData.humidity}%`,
      icon: Droplets,
    },
    {
        id: 3,
        label: 'Precipitation (1h)',
        value: `${weatherData.precipitation.toFixed(1)} mm`,
        icon: Droplets, 
      },
    {
      id: 4,
      label: 'Wind Speed',
      value: `${weatherData.windSpeed.toFixed(1)} m/s`,
      icon: Wind,
    },
    {
      id: 5,
      label: 'Pressure',
      value: `${weatherData.pressure} hPa`,
      icon: Gauge,
    },
  ];

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-text-primary">
          Current Weather Parameters
        </h4>
        <span className="text-sm text-text-secondary bg-surface px-3 py-1 rounded-full">
          {location}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {parameters.map((param) => {
          const Icon = param.icon;
          return (
            <div key={param.id} className="p-4 rounded-lg border bg-surface/50 border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>
                <span className="text-lg font-bold text-text-primary">
                  {param.value}
                </span>
              </div>
              <h5 className="font-medium text-text-primary mb-1">
                {param.label}
              </h5>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherParameters;
