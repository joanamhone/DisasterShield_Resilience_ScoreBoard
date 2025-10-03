import React from 'react';
import { Thermometer, Droplets, Wind, Eye, Gauge, Sun } from 'lucide-react';

// --- Interfaces ---

// This interface should match the structure of the data from your predictionService
export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number; // This was called 'rainfall' before, ensure consistency
  windSpeed: number;
  pressure: number;
  // These fields might not be in your prediction service, so we'll handle them
  uvIndex?: number; 
  visibility?: number;
}

interface WeatherParametersProps {
  location: string;
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

// --- Component ---

const WeatherParameters: React.FC<WeatherParametersProps> = ({ location, weatherData }) => {
  // Add a log to see what props are being received on each render
  console.log("WeatherParameters component rendered with data:", weatherData);

  // Handle cases where data is not yet available
  if (!weatherData) {
    return <div className="card p-4 text-center">Loading weather data...</div>;
  }

  // Use default values for optional data to prevent errors
  const temp = weatherData.temperature ?? 0;
  const humidity = weatherData.humidity ?? 0;
  const rainfall = weatherData.precipitation ?? 0;
  const windSpeed = weatherData.windSpeed ?? 0;
  const pressure = weatherData.pressure ?? 0;
  const uvIndex = weatherData.uvIndex ?? 0; // Default to 0 if not provided
  const visibility = weatherData.visibility ?? 10; // Default to 10km if not provided

  const parameters = [
    {
      id: 1,
      label: 'Temperature',
      value: `${Math.round(temp)}°C`,
      icon: Thermometer,
      color: temp > 30 ? 'text-error' : temp > 20 ? 'text-warning' : temp > 10 ? 'text-accent' : 'text-secondary',
      bgColor: temp > 30 ? 'bg-error/20' : temp > 20 ? 'bg-warning/20' : temp > 10 ? 'bg-accent/20' : 'bg-secondary/20',
      description: temp > 35 ? 'Extreme heat' : temp < 5 ? 'Very cold' : 'Moderate',
    },
    {
      id: 2,
      label: 'Humidity',
      value: `${humidity}%`,
      icon: Droplets,
      color: humidity > 80 ? 'text-secondary' : humidity > 60 ? 'text-accent' : 'text-success',
      bgColor: humidity > 80 ? 'bg-secondary/20' : humidity > 60 ? 'bg-accent/20' : 'bg-success/20',
      description: humidity > 80 ? 'Very humid' : humidity < 30 ? 'Dry air' : 'Comfortable',
    },
    {
      id: 3,
      label: 'Precipitation',
      value: `${rainfall.toFixed(1)} mm`,
      icon: Droplets,
      color: rainfall > 50 ? 'text-error' : rainfall > 25 ? 'text-warning' : 'text-success',
      bgColor: rainfall > 50 ? 'bg-error/20' : rainfall > 25 ? 'bg-warning/20' : 'bg-success/20',
      description: rainfall > 50 ? 'Heavy rain' : rainfall > 0.1 ? 'Moderate rain' : 'No rain',
    },
    {
      id: 4,
      label: 'Wind Speed',
      value: `${windSpeed.toFixed(1)} m/s`,
      icon: Wind,
      color: windSpeed > 15 ? 'text-error' : windSpeed > 8 ? 'text-warning' : 'text-success',
      bgColor: windSpeed > 15 ? 'bg-error/20' : windSpeed > 8 ? 'bg-warning/20' : 'bg-success/20',
      description: windSpeed > 15 ? 'Strong wind' : 'Light breeze',
    },
    {
      id: 5,
      label: 'Pressure',
      value: `${pressure} hPa`,
      icon: Gauge,
      color: pressure < 1000 ? 'text-warning' : pressure > 1020 ? 'text-accent' : 'text-success',
      bgColor: pressure < 1000 ? 'bg-warning/20' : pressure > 1020 ? 'bg-accent/20' : 'bg-success/20',
      description: pressure < 1005 ? 'Low pressure' : pressure > 1022 ? 'High pressure' : 'Stable',
    },
    {
      id: 6,
      label: 'UV Index',
      value: uvIndex.toFixed(1),
      icon: Sun,
      color: uvIndex > 8 ? 'text-error' : uvIndex > 6 ? 'text-warning' : 'text-success',
      bgColor: uvIndex > 8 ? 'bg-error/20' : uvIndex > 6 ? 'bg-warning/20' : 'bg-success/20',
      description: uvIndex > 8 ? 'Very high' : uvIndex > 3 ? 'Moderate' : 'Low',
    },
    {
        id: 7,
        label: 'Visibility',
        value: `${visibility.toFixed(1)} km`,
        icon: Eye,
        color: visibility < 5 ? 'text-error' : visibility < 10 ? 'text-warning' : 'text-success',
        bgColor: visibility < 5 ? 'bg-error/20' : visibility < 10 ? 'bg-warning/20' : 'bg-success/20',
        description: visibility < 5 ? 'Poor' : visibility > 15 ? 'Excellent' : 'Good',
    }
  ];

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-text-primary">
          🌍 Current Weather Parameters
        </h4>
        <span className="text-sm text-text-secondary bg-surface px-3 py-1 rounded-full">
          {location}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {parameters.map((param) => {
          const Icon = param.icon;
          return (
            <div key={param.id} className={`p-4 rounded-lg border ${param.bgColor} border-border`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-full ${param.bgColor} flex items-center justify-center`}>
                  <Icon size={16} className={param.color} />
                </div>
                <span className={`text-lg font-bold ${param.color}`}>
                  {param.value}
                </span>
              </div>
              <h5 className="font-medium text-text-primary mb-1">
                {param.label}
              </h5>
              <p className="text-xs text-text-secondary">
                {param.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherParameters;