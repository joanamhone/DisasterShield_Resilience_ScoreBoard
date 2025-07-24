import React from 'react'

interface HistoricalDataProps {
  location: string
}

const HistoricalData: React.FC<HistoricalDataProps> = ({ location }) => {
  // Sample data for the chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const floodData = [1, 2, 4, 5, 3, 2, 1, 0, 1, 2, 3, 2]
  const wildfireData = [0, 0, 1, 2, 3, 5, 6, 4, 2, 1, 0, 0]
  const stormData = [5, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 5]
  
  const maxValue = Math.max(...floodData, ...wildfireData, ...stormData)

  return (
    <div className="card p-4">
      <h4 className="font-bold text-text-primary mb-1">
        Historical Data for {location}
      </h4>
      <p className="text-sm text-text-secondary mb-4">
        Disaster occurrences over the last year
      </p>
      
      {/* Simple bar chart representation */}
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-1 h-32">
          {months.map((month, index) => (
            <div key={month} className="flex flex-col justify-end items-center space-y-1">
              {/* Flood bar */}
              <div 
                className="w-2 bg-secondary rounded-sm"
                style={{ height: `${(floodData[index] / maxValue) * 80}px` }}
              ></div>
              {/* Wildfire bar */}
              <div 
                className="w-2 bg-risk-high rounded-sm"
                style={{ height: `${(wildfireData[index] / maxValue) * 80}px` }}
              ></div>
              {/* Storm bar */}
              <div 
                className="w-2 bg-primary rounded-sm"
                style={{ height: `${(stormData[index] / maxValue) * 80}px` }}
              ></div>
              <span className="text-xs text-text-tertiary transform -rotate-45 origin-center">
                {month}
              </span>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-secondary rounded mr-2"></div>
            <span className="text-xs text-text-secondary">Floods</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-risk-high rounded mr-2"></div>
            <span className="text-xs text-text-secondary">Wildfires</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded mr-2"></div>
            <span className="text-xs text-text-secondary">Storms</span>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-text-tertiary italic text-center mt-3">
        Data is based on historical records and may not represent future conditions.
      </p>
    </div>
  )
}

export default HistoricalData