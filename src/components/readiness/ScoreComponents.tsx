import React from 'react';
import CircleProgress from '../ui/CircleProgress';
import { useReadiness } from '../../contexts/ReadinessContext';
import { Loader2 } from 'lucide-react';

// --- ReadinessScore Component (for the homepage) ---
export const ReadinessScore: React.FC = () => {
  // Get the score and loading state from the context
  const { latestScore, isLoading } = useReadiness(); 

  const getScoreColor = (s: number) => {
    if (s < 30) return '#D32F2F';
    if (s < 60) return '#FFA000';
    if (s < 80) return '#F57C00';
    return '#43A047';
  };

  const getScoreLabel = (s: number) => {
    if (s < 30) return 'At Risk';
    if (s < 60) return 'Fair';
    if (s < 80) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="card p-4">
      <h3 className="font-bold text-text-primary mb-3">Readiness Score</h3>
      {/* Show a loading state while data is being fetched */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[80px]">
            <Loader2 className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <CircleProgress 
            percentage={latestScore} 
            color={getScoreColor(latestScore)}
            size={80}
            strokeWidth={8}
          />
          <div className="ml-4">
            <div className="text-2xl font-bold" style={{ color: getScoreColor(latestScore) }}>
              {latestScore}%
            </div>
            <div className="text-sm text-text-secondary mt-1">
              {getScoreLabel(latestScore)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// --- ScoreOverview Component (for the readiness page) ---
export const ScoreOverview: React.FC = () => {
  const { latestScore, isLoading } = useReadiness(); // Get the score and loading state

  const getScoreColor = (s: number) => {
    if (s < 30) return '#D32F2F';
    if (s < 60) return '#FFA000';
    if (s < 80) return '#F57C00';
    return '#43A047';
  };

  const getScoreDescription = (s: number) => {
    if (s < 30) return 'Your preparedness level needs significant improvement.';
    if (s < 60) return 'You have taken some steps, but there are areas for improvement.';
    if (s < 80) return 'You are well-prepared for most disasters.';
    return 'Excellent job! You are very well prepared.';
  };

  const getScoreLabel = (s: number) => {
    if (s < 30) return 'At Risk';
    if (s < 60) return 'Fair';
    if (s < 80) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="card p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-[120px]">
            <Loader2 className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <CircleProgress 
              percentage={latestScore} 
              color={getScoreColor(latestScore)}
              size={120}
              strokeWidth={12}
            />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold text-text-primary mb-2">Your Readiness Score</h3>
              <div className="text-3xl font-bold mb-2" style={{ color: getScoreColor(latestScore) }}>
                {latestScore}%
              </div>
              <span 
                className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: getScoreColor(latestScore) }}
              >
                {getScoreLabel(latestScore)}
              </span>
            </div>
          </div>
          <p className="text-text-secondary leading-relaxed">
            {getScoreDescription(latestScore)}
          </p>
        </>
      )}
    </div>
  );
};
