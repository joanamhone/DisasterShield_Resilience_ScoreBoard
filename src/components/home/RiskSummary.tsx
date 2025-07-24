import React from 'react'
import { AlertOctagon, Droplets, Wind, Flame } from 'lucide-react'

const RiskSummary: React.FC = () => {
  const currentRisks = [
    { type: 'Flood', level: 'Medium', icon: Droplets, color: 'text-risk-medium' },
    { type: 'Wildfire', level: 'High', icon: Flame, color: 'text-risk-high' },
    { type: 'Storm', level: 'Low', icon: Wind, color: 'text-risk-low' },
  ]

  // Find the highest risk level
  const getHighestRiskLevel = () => {
    const levels = { 'Low': 1, 'Medium': 2, 'High': 3, 'Severe': 4 }
    
    let highestLevel = 'Low'
    let highestValue = 1
    
    currentRisks.forEach(risk => {
      const levelValue = levels[risk.level as keyof typeof levels]
      if (levelValue > highestValue) {
        highestValue = levelValue
        highestLevel = risk.level
      }
    })
    
    return highestLevel
  }
  
  const highestRisk = getHighestRiskLevel()
  const riskColorClass = 
    highestRisk === 'Low' ? 'text-risk-low' :
    highestRisk === 'Medium' ? 'text-risk-medium' :
    highestRisk === 'High' ? 'text-risk-high' :
    'text-risk-severe'

  return (
    <div className="card p-4">
      <h3 className="font-bold text-text-primary mb-3">
        Current Risks
      </h3>
      
      <div className="flex items-center mb-3">
        <AlertOctagon className={riskColorClass} size={24} />
        <span className={`font-bold text-base ml-2 ${riskColorClass}`}>
          {highestRisk} Risk
        </span>
      </div>
      
      <div className="space-y-2">
        {currentRisks.map((risk, index) => {
          const Icon = risk.icon
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon size={16} className={risk.color} />
                <span className="text-sm text-text-secondary ml-2">
                  {risk.type}
                </span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full text-white ${
                risk.level === 'Low' ? 'bg-risk-low' :
                risk.level === 'Medium' ? 'bg-risk-medium' :
                risk.level === 'High' ? 'bg-risk-high' :
                'bg-risk-severe'
              }`}>
                {risk.level}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RiskSummary