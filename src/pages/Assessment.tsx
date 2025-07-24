import React, { useState } from 'react'
import { MapPin, RefreshCw, AlertTriangle, Calendar, BarChart3, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import DisasterMap from '../components/assessment/DisasterMap'
import RiskLevelCard from '../components/assessment/RiskLevelCard'
import HistoricalData from '../components/assessment/HistoricalData'
import WeatherParameters from '../components/assessment/WeatherParameters'
import HistoricalTrendsChart from '../components/charts/HistoricalTrendsChart'
import EnvironmentalChart from '../components/charts/EnvironmentalChart'
import { useLocation } from '../hooks/useLocation'

const Assessment: React.FC = () => {
  const userLocation = useLocation()
  const { user } = useAuth()
  const [location, setLocation] = useState('San Francisco, CA')
  const [season, setSeason] = useState('summer')
  const [lastUpdated, setLastUpdated] = useState('Just now')
  const [loading, setLoading] = useState(false)
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false)
  const [trendsTimeRange, setTrendsTimeRange] = useState<'hour' | 'month' | 'year'>('month')
  const [environmentalTimeRange, setEnvironmentalTimeRange] = useState<'hour' | 'month' | 'year'>('month')
  const [environmentalParameter, setEnvironmentalParameter] = useState<'temperature' | 'rainfall' | 'humidity' | 'windspeed'>('temperature')

  const seasons = [
    { value: 'spring', label: 'Spring', icon: '🌸' },
    { value: 'summer', label: 'Summer', icon: '☀️' },
    { value: 'autumn', label: 'Autumn', icon: '🍂' },
    { value: 'winter', label: 'Winter', icon: '❄️' },
    { value: 'rainy', label: 'Rainy Season', icon: '🌧️' },
    { value: 'dry', label: 'Dry Season', icon: '🏜️' },
  ]

  const selectedSeason = seasons.find(s => s.value === season)

  // Update location when user location is available
  React.useEffect(() => {
    if (user?.location) {
      setLocation(user.location)
    } else if (!userLocation.loading && !userLocation.error && userLocation.city) {
      setLocation(`${userLocation.city}, ${userLocation.country}`)
    }
  }, [userLocation, user])

  const riskLevels = [
    { type: 'Flood', level: 'Medium' as const, description: 'Heavy rainfall expected this week' },
    { type: 'Wildfire', level: 'High' as const, description: 'Dry conditions and high temperatures' },
    { type: 'Earthquake', level: 'Low' as const, description: 'No significant seismic activity recently' },
    { type: 'Severe Weather', level: 'Medium' as const, description: 'Potential thunderstorms later this week' },
  ]

  const refreshData = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setLastUpdated('Just now')
    }, 1500)
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Location and Season Header */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
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
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <Calendar size={16} className="inline mr-1" />
              Season
            </label>
            <div className="relative">
              <button
                onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
                className="w-full bg-surface rounded-lg px-3 py-2 text-left border border-border focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between"
              >
                <span className="text-text-primary">
                  <span className="mr-2">{selectedSeason?.icon}</span>
                  {selectedSeason?.label}
                </span>
                <RefreshCw size={16} className="text-text-tertiary" />
              </button>

              {showSeasonDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10">
                  {seasons.map((seasonOption) => (
                    <button
                      key={seasonOption.value}
                      onClick={() => {
                        setSeason(seasonOption.value)
                        setShowSeasonDropdown(false)
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-surface transition-colors flex items-center"
                    >
                      <span className="mr-2">{seasonOption.icon}</span>
                      <span className="text-text-primary">{seasonOption.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
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

      {/* Weather Parameters */}
      <WeatherParameters location={location} season={season} />

      {/* Interactive Charts Section */}
      <div className="space-y-4 sm:space-y-6">
        {/* Historical Trends Chart */}
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

        {/* Environmental Parameters Chart */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Environmental Data
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Parameter selector */}
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
              
              {/* Time range selector */}
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

      {/* Disaster Map */}
      <DisasterMap location={location} />

      {/* Overall Risk */}
      <div className="card p-4 flex items-center">
        <AlertTriangle className="text-risk-high mr-3" size={24} />
        <span className="font-medium text-text-primary">
          Overall Risk Level: <span className="font-bold text-risk-high">High</span>
        </span>
      </div>
    </div>
  )
}

export default Assessment