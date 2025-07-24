import React from 'react'

type RiskLevel = 'Low' | 'Medium' | 'High' | 'Severe'

interface RiskType {
  type: string
  level: RiskLevel
  description: string
}

interface RiskLevelCardProps {
  risk: RiskType
}

const RiskLevelCard: React.FC<RiskLevelCardProps> = ({ risk }) => {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Low':
        return 'bg-risk-low'
      case 'Medium':
        return 'bg-risk-medium'
      case 'High':
        return 'bg-risk-high'
      case 'Severe':
        return 'bg-risk-severe'
      default:
        return 'bg-risk-low'
    }
  }

  const getRiskWidth = (level: RiskLevel) => {
    switch (level) {
      case 'Low':
        return 'w-1/4'
      case 'Medium':
        return 'w-1/2'
      case 'High':
        return 'w-3/4'
      case 'Severe':
        return 'w-full'
      default:
        return 'w-1/4'
    }
  }

  const riskColorClass = getRiskColor(risk.level)
  const riskWidthClass = getRiskWidth(risk.level)

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-text-primary">
          {risk.type}
        </h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${riskColorClass}`}>
          {risk.level}
        </span>
      </div>
      
      <p className="text-sm text-text-secondary mb-3">
        {risk.description}
      </p>
      
      <div className="w-full bg-border h-1.5 rounded-full">
        <div className={`h-1.5 rounded-full ${riskColorClass} ${riskWidthClass}`}></div>
      </div>
    </div>
  )
}

export default RiskLevelCard