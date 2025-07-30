import React from 'react'

interface DisasterMapProps {
  location: string
}

const DisasterMap: React.FC<DisasterMapProps> = ({ location }) => {
  return (
    <div className="card overflow-hidden">
      <div className="relative">
        <img
          src="https://static01.nyt.com/images/2021/03/25/learning/ClimateRiskMapLN/ClimateRiskMapLN-superJumbo.png?quality=75&auto=webp"
          alt="Disaster Risk Map"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-4 bg-black/30">
          <h3 className="text-lg font-bold text-white">
            Disaster Risk Map
          </h3>
          <p className="text-sm text-white/80">
            {location}
          </p>
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="font-bold text-sm text-text-primary mb-2">
          Risk Levels
        </h4>
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-risk-low mr-1"></div>
            <span className="text-xs text-text-secondary">Low</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-risk-medium mr-1"></div>
            <span className="text-xs text-text-secondary">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-risk-high mr-1"></div>
            <span className="text-xs text-text-secondary">High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-risk-severe mr-1"></div>
            <span className="text-xs text-text-secondary">Severe</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisasterMap