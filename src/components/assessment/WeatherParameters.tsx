import React from 'react'
import { Thermometer, Droplets, Wind, Eye, Gauge, Sun } from 'lucide-react'

interface WeatherParametersProps {
  location: string
  season: string
}

const WeatherParameters: React.FC<WeatherParametersProps> = ({ location, season }) => {
  // Mock weather data based on season and location
  const getWeatherData = () => {
    const baseData = {
      spring: {
        temperature: 18,
        humidity: 65,
        rainfall: 85,
        windSpeed: 12,
        pressure: 1013,
        uvIndex: 6,
        visibility: 15
      },
      summer: {
        temperature: 32,
        humidity: 45,
        rainfall: 25,
        windSpeed: 8,
        pressure: 1018,
        uvIndex: 9,
        visibility: 20
      },
      autumn: {
        temperature: 22,
        humidity: 70,
        rainfall: 120,
        windSpeed: 15,
        pressure: 1008,
        pressure: 1008,
        uvIndex: 4,
        visibility: 12
      },
      winter: {
        temperature: 5,
        humidity: 80,
        rainfall: 95,
        windSpeed: 18,
        pressure: 1020,
        uvIndex: 2,
        visibility: 8
      },
      rainy: {
        temperature: 24,
        humidity: 85,
        rainfall: 180,
        windSpeed: 20,
        pressure: 995,
        uvIndex: 3,
        visibility: 6
      },
      dry: {
        temperature: 38,
        humidity: 25,
        rainfall: 5,
        windSpeed: 10,
        pressure: 1022,
        uvIndex: 11,
        visibility: 25
      }
    }

    return baseData[season as keyof typeof baseData] || baseData.spring
  }

  const weatherData = getWeatherData()

  const parameters = [
    {
      id: 1,
      label: 'Temperature',
      value: `${weatherData.temperature}°C`,
      icon: Thermometer,
      color: weatherData.temperature > 30 ? 'text-error' : 
             weatherData.temperature > 20 ? 'text-warning' : 
             weatherData.temperature > 10 ? 'text-accent' : 'text-secondary',
      bgColor: weatherData.temperature > 30 ? 'bg-error/20' : 
               weatherData.temperature > 20 ? 'bg-warning/20' : 
               weatherData.temperature > 10 ? 'bg-accent/20' : 'bg-secondary/20',
      description: weatherData.temperature > 35 ? 'Extreme heat warning' :
                   weatherData.temperature > 30 ? 'Very hot conditions' :
                   weatherData.temperature < 0 ? 'Freezing conditions' :
                   weatherData.temperature < 5 ? 'Very cold conditions' : 'Moderate temperature'
    },
    {
      id: 2,
      label: 'Humidity',
      value: `${weatherData.humidity}%`,
      icon: Droplets,
      color: weatherData.humidity > 80 ? 'text-secondary' : 
             weatherData.humidity > 60 ? 'text-accent' : 
             weatherData.humidity > 40 ? 'text-success' : 'text-warning',
      bgColor: weatherData.humidity > 80 ? 'bg-secondary/20' : 
               weatherData.humidity > 60 ? 'bg-accent/20' : 
               weatherData.humidity > 40 ? 'bg-success/20' : 'bg-warning/20',
      description: weatherData.humidity > 80 ? 'Very humid conditions' :
                   weatherData.humidity > 60 ? 'High humidity' :
                   weatherData.humidity < 30 ? 'Very dry air' : 'Comfortable humidity'
    },
    {
      id: 3,
      label: 'Rainfall',
      value: `${weatherData.rainfall}mm`,
      icon: Droplets,
      color: weatherData.rainfall > 150 ? 'text-error' : 
             weatherData.rainfall > 100 ? 'text-warning' : 
             weatherData.rainfall > 50 ? 'text-secondary' : 'text-accent',
      bgColor: weatherData.rainfall > 150 ? 'bg-error/20' : 
               weatherData.rainfall > 100 ? 'bg-warning/20' : 
               weatherData.rainfall > 50 ? 'bg-secondary/20' : 'bg-accent/20',
      description: weatherData.rainfall > 150 ? 'Heavy rainfall expected' :
                   weatherData.rainfall > 100 ? 'Significant rainfall' :
                   weatherData.rainfall < 20 ? 'Very dry conditions' : 'Moderate rainfall'
    },
    {
      id: 4,
      label: 'Wind Speed',
      value: `${weatherData.windSpeed} km/h`,
      icon: Wind,
      color: weatherData.windSpeed > 25 ? 'text-error' : 
             weatherData.windSpeed > 15 ? 'text-warning' : 
             weatherData.windSpeed > 10 ? 'text-accent' : 'text-success',
      bgColor: weatherData.windSpeed > 25 ? 'bg-error/20' : 
               weatherData.windSpeed > 15 ? 'bg-warning/20' : 
               weatherData.windSpeed > 10 ? 'bg-accent/20' : 'bg-success/20',
      description: weatherData.windSpeed > 30 ? 'Strong wind warning' :
                   weatherData.windSpeed > 20 ? 'Windy conditions' :
                   weatherData.windSpeed < 5 ? 'Very calm conditions' : 'Light to moderate winds'
    },
    {
      id: 5,
      label: 'Pressure',
      value: `${weatherData.pressure} hPa`,
      icon: Gauge,
      color: weatherData.pressure < 1000 ? 'text-error' : 
             weatherData.pressure < 1010 ? 'text-warning' : 
             weatherData.pressure > 1025 ? 'text-accent' : 'text-success',
      bgColor: weatherData.pressure < 1000 ? 'bg-error/20' : 
               weatherData.pressure < 1010 ? 'bg-warning/20' : 
               weatherData.pressure > 1025 ? 'bg-accent/20' : 'bg-success/20',
      description: weatherData.pressure < 1000 ? 'Low pressure system' :
                   weatherData.pressure < 1010 ? 'Falling pressure' :
                   weatherData.pressure > 1025 ? 'High pressure system' : 'Stable pressure'
    },
    {
      id: 6,
      label: 'UV Index',
      value: weatherData.uvIndex.toString(),
      icon: Sun,
      color: weatherData.uvIndex > 8 ? 'text-error' : 
             weatherData.uvIndex > 6 ? 'text-warning' : 
             weatherData.uvIndex > 3 ? 'text-accent' : 'text-success',
      bgColor: weatherData.uvIndex > 8 ? 'bg-error/20' : 
               weatherData.uvIndex > 6 ? 'bg-warning/20' : 
               weatherData.uvIndex > 3 ? 'bg-accent/20' : 'bg-success/20',
      description: weatherData.uvIndex > 8 ? 'Very high UV - protection required' :
                   weatherData.uvIndex > 6 ? 'High UV - protection recommended' :
                   weatherData.uvIndex > 3 ? 'Moderate UV exposure' : 'Low UV levels'
    },
    {
      id: 7,
      label: 'Visibility',
      value: `${weatherData.visibility} km`,
      icon: Eye,
      color: weatherData.visibility < 5 ? 'text-error' : 
             weatherData.visibility < 10 ? 'text-warning' : 
             weatherData.visibility < 15 ? 'text-accent' : 'text-success',
      bgColor: weatherData.visibility < 5 ? 'bg-error/20' : 
               weatherData.visibility < 10 ? 'bg-warning/20' : 
               weatherData.visibility < 15 ? 'bg-accent/20' : 'bg-success/20',
      description: weatherData.visibility < 5 ? 'Poor visibility conditions' :
                   weatherData.visibility < 10 ? 'Reduced visibility' :
                   weatherData.visibility > 20 ? 'Excellent visibility' : 'Good visibility'
    }
  ]

  const getSeasonEmoji = (season: string) => {
    const seasonEmojis: Record<string, string> = {
      spring: '🌸',
      summer: '☀️',
      autumn: '🍂',
      winter: '❄️',
      rainy: '🌧️',
      dry: '🏜️'
    }
    return seasonEmojis[season] || '🌍'
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-text-primary">
          {getSeasonEmoji(season)} Weather Parameters
        </h4>
        <span className="text-sm text-text-secondary bg-surface px-3 py-1 rounded-full">
          {location}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {parameters.map((param) => {
          const Icon = param.icon
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
          )
        })}
      </div>
      
      <div className="mt-4 p-3 bg-surface rounded-lg">
        <p className="text-xs text-text-tertiary text-center">
          Weather data is updated every 6 hours. Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

export default WeatherParameters