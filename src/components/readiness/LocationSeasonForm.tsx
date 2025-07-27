import React, { useState } from 'react'
import { MapPin, Calendar, ChevronDown } from 'lucide-react'

interface LocationSeasonFormProps {
  onSubmit: (location: string, season: string) => void
}

const LocationSeasonForm: React.FC<LocationSeasonFormProps> = ({ onSubmit }) => {
  const [location, setLocation] = useState('')
  const [season, setSeason] = useState('')
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false)

  const seasons = [
    { value: 'winter', label: 'Cold & Dry (May - July)', icon: '🌸' },
    { value: 'summer', label: 'Hot & Dry (August - November)', icon: '☀️' },
    { value: 'rainy', label: 'Hot & Wet (December - April)', icon: '🍂' },
    //{ value: 'winter', label: 'Winter (December - February)', icon: '❄️' },
    //{ value: 'rainy', label: 'Rainy Season', icon: '🌧️' },
    //{ value: 'dry', label: 'Dry Season', icon: '🏜️' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim() && season) {
      onSubmit(location.trim(), season)
    }
  }

  const selectedSeason = seasons.find(s => s.value === season)

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-text-primary mb-4">
        Location & Season Information
      </h3>
      <p className="text-text-secondary mb-6">
        Help us customize your readiness assessment based on your location and current season.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Input */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            <MapPin size={16} className="inline mr-1" />
            Your Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city, state/province, country"
            className="w-full bg-surface rounded-lg px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary border border-border"
            required
          />
        </div>

        {/* Season Selection */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            <Calendar size={16} className="inline mr-1" />
            Current Season
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
              className="w-full bg-surface rounded-lg px-4 py-3 text-left border border-border focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between"
            >
              <span className={selectedSeason ? 'text-text-primary' : 'text-text-tertiary'}>
                {selectedSeason ? (
                  <>
                    <span className="mr-2">{selectedSeason.icon}</span>
                    {selectedSeason.label}
                  </>
                ) : (
                  'Select your current season'
                )}
              </span>
              <ChevronDown size={20} className={`text-text-tertiary transition-transform ${showSeasonDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSeasonDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10">
                {seasons.map((seasonOption) => (
                  <button
                    key={seasonOption.value}
                    type="button"
                    onClick={() => {
                      setSeason(seasonOption.value)
                      setShowSeasonDropdown(false)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-surface transition-colors flex items-center"
                  >
                    <span className="mr-3">{seasonOption.icon}</span>
                    <span className="text-text-primary">{seasonOption.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!location.trim() || !season}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            location.trim() && season
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-border text-text-tertiary cursor-not-allowed'
          }`}
        >
          Start Season-Specific Assessment
        </button>
      </form>
    </div>
  )
}

export default LocationSeasonForm