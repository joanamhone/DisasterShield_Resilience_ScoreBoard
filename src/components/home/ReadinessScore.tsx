import React from 'react'
import CircleProgress from '../ui/CircleProgress'

interface ReadinessScoreProps {
  score: number
}

const ReadinessScore: React.FC<ReadinessScoreProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score < 30) return '#D32F2F' // error
    if (score < 60) return '#FFA000' // warning
    if (score < 80) return '#F57C00' // accent
    return '#43A047' // success
  }

  const getScoreLabel = (score: number) => {
    if (score < 30) return 'At Risk'
    if (score < 60) return 'Fair'
    if (score < 80) return 'Good'
    return 'Excellent'
  }

  const scoreColor = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)

  return (
    <div className="card p-4 h-64 flex flex-col">
      <h3 className="font-bold text-text-primary mb-3">
        Readiness Score
      </h3>
      <div className="flex-1 flex items-center justify-between">
        <CircleProgress 
          percentage={score} 
          color={scoreColor}
          size={80}
          strokeWidth={8}
        />
        <div className="ml-4">
          <div className="text-2xl font-bold" style={{ color: scoreColor }}>
            {score}%
          </div>
          <div className="text-sm text-text-secondary mt-1">
            {scoreLabel}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadinessScore