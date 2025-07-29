import React, { useState, useEffect } from 'react'
import { MapPin, RefreshCw } from 'lucide-react'
import DisasterMap from '../components/assessment/DisasterMap'
import WeatherParameters from '../components/assessment/WeatherParameters'
import RiskSummary from '../components/home/RiskSummary'
import { useLocation } from '../hooks/useLocation'
import { getWeather, WeatherData } from '../services/predictionService'

const Assessment: React.FC = () => {
  const userLocation = useLocation()

  // State for the weather data and its loading/error status
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationName, setLocationName] = useState('Loading location...')
  const [lastUpdated, setLastUpdated] = useState('N/A')

  // Effect to fetch weather for the user's current location on initial load
  useEffect(() => {
    // Only run if the location hook has successfully found coordinates
    if (userLocation.latitude && userLocation.longitude) {
      setIsLoading(true)
      getWeather(userLocation.latitude, userLocation.longitude)
        .then((data) => {
          setWeatherData(data)
          setError(null)
          // Set the display name for the location
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
      // Handle errors from the location hook itself
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

  // Function to manually refresh the weather data for the current location
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

      {/* Disaster Map - only shown if location is available */}
      {userLocation.latitude && userLocation.longitude && (
         <DisasterMap latitude={userLocation.latitude} longitude={userLocation.longitude} />
      )}

      {/* Overall Risk Summary - Full Details */}
      <RiskSummary />
    </div>
  )
}

export default Assessment
