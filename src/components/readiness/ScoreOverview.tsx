import React from 'react'
import CircleProgress from '../ui/CircleProgress'

interface ScoreOverviewProps {
  score: number
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score < 30) return '#D32F2F' // error
    if (score < 60) return '#F57C00' // warning
    if (score < 80) return '#ffc800ff' // accent
    return '#43A047' // success
  }

  const getScoreDescription = (score: number) => {
    if (score < 30) {
      return 'Your preparedness level needs significant improvement. Take action now to protect yourself and your loved ones.'
    } else if (score < 60) {
      return 'You have taken some steps toward preparedness, but there are important areas that need improvement.'
    } else if (score < 80) {
      return 'You are well-prepared for most disasters, with only a few areas needing attention.'
    } else {
      return 'Excellent job! You are very well prepared for disasters. Keep maintaining your readiness.'
    }
  }

  const getScoreLabel = (score: number) => {
    if (score < 30) return 'At Risk'
    if (score < 60) return 'Fair'
    if (score < 80) return 'Good'
    return 'Excellent'
  }

  const scoreColor = getScoreColor(score)
  const scoreDescription = getScoreDescription(score)
  const scoreLabel = getScoreLabel(score)

  return (
    <div className="card p-4">
      <div className="flex items-center mb-4">
        <CircleProgress 
          percentage={score} 
          color={scoreColor}
          size={120}
          strokeWidth={12}
        />
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-bold text-text-primary mb-2">
            Your Readiness Score
          </h3>
          <div className="text-3xl font-bold mb-2" style={{ color: scoreColor }}>
            {score}%
          </div>
          <span 
            className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: scoreColor }}
          >
            {scoreLabel}
          </span>
        </div>
      </div>
      
      <p className="text-text-secondary leading-relaxed">
        {scoreDescription}
      </p>
    </div>
  )
}

export default ScoreOverview