import React, { useState, useEffect } from 'react'
import { MapPin, RefreshCw, BarChart3, TrendingUp } from 'lucide-react'

// Import components
import DisasterMap from '../components/assessment/DisasterMap'
import WeatherParameters from '../components/assessment/WeatherParameters'
import RiskSummary from '../components/home/RiskSummary'
import EnvironmentalChart from '../components/charts/EnvironmentalChart'
import HistoricalTrendsChart from '../components/charts/HistoricalTrendsChart'

// Import hooks and services
import { useLocation } from '../hooks/useLocation'
import { getWeather, WeatherData } from '../services/predictionService'

const Assessment: React.FC = () => {
  const userLocation = useLocation()

  // State for weather data
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationName, setLocationName] = useState('Loading location...')
  const [lastUpdated, setLastUpdated] = useState('N/A')

  // State for the charts
  const [trendsTimeRange, setTrendsTimeRange] = useState<'hour' | 'month' | 'year'>('month')
  const [environmentalTimeRange, setEnvironmentalTimeRange] = useState<'hour' | 'month' | 'year'>('month')
  const [environmentalParameter, setEnvironmentalParameter] = useState<'temperature' | 'rainfall' | 'humidity' | 'windspeed'>('temperature')


  // Effect to fetch weather on initial load
  useEffect(() => {
    if (userLocation.latitude && userLocation.longitude) {
      setIsLoading(true)
      getWeather(userLocation.latitude, userLocation.longitude)
        .then((data) => {
          setWeatherData(data)
          setError(null)
          if (userLocation.city && userLocation.country) {
            setLocationName(`${userLocation.city}, ${userLocation.country}`)
          } else {
            setLocationName('Current Location')
          }
          setLastUpdated(new Date().toLocaleTimeString())
        })
        .catch((err: any) => {
          setError(err.message || 'Failed to fetch weather data.')
          setWeatherData(null)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (userLocation.error) {
      setError(userLocation.error)
      setLocationName('Location unavailable')
      setIsLoading(false)
    }
  }, [
    userLocation.latitude,
    userLocation.longitude,
    userLocation.city,
    userLocation.country,
    userLocation.error,
  ])

  // Function to manually refresh data
  const handleRefresh = () => {
    if (userLocation.latitude && userLocation.longitude) {
      setIsLoading(true)
      getWeather(userLocation.latitude, userLocation.longitude)
        .then((data) => {
          setWeatherData(data)
          setError(null)
          setLastUpdated(new Date().toLocaleTimeString())
        })
        .catch((err: any) => {
          setError(err.message || 'Failed to refresh weather data.')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Location Header */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <MapPin size={16} className="inline mr-1" />
              Current Location
            </label>
            <div className="w-full bg-surface rounded-lg px-3 py-2 text-text-primary border border-border">
              {locationName}
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleRefresh}
              disabled={isLoading || !userLocation.latitude}
              className="flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
            >
              <RefreshCw
                className={`mr-2 ${isLoading ? 'animate-spin' : ''}`}
                size={16}
              />
              Refresh
            </button>
          </div>
        </div>
        <p className="text-xs text-text-tertiary mt-3">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Weather Parameters */}
      <WeatherParameters
        location={locationName}
        weatherData={weatherData}
        isLoading={isLoading}
        error={error}
      />

      {/* Interactive Charts Section */}
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
          <HistoricalTrendsChart timeRange={trendsTimeRange} location={locationName} />
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
            location={locationName}
            parameter={environmentalParameter}
          />
        </div>
      </div>

      {/* Disaster Map */}
      {userLocation.latitude && userLocation.longitude && (
          <DisasterMap latitude={userLocation.latitude} longitude={userLocation.longitude} />
      )}

      {/* Overall Risk Summary */}
      <RiskSummary displayMode="full" />
    </div>
  )
}

export default Assessment
