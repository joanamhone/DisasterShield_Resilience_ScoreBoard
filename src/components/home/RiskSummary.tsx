import React from 'react';
import { useDisasterPrediction } from '../../contexts/DisasterPredictionContext';
import { 
  AlertOctagon, 
  Droplets, 
  Wind, 
  Flame, 
  Sun, 
  CloudSnow,
  Loader2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

// Define the component's props
interface RiskSummaryProps {
  displayMode?: 'summary' | 'full';
}

// Helper to determine the risk level class based on probability
const getRiskLevelClass = (probability: number): 'text-risk-low' | 'text-risk-medium' | 'text-risk-high' => {
  if (probability > 0.5) return 'text-risk-high'; // Over 50%
  if (probability > 0.2) return 'text-risk-medium'; // Over 20%
  return 'text-risk-low'; // 20% or less
};

// Helper to get only the icon for a specific risk type
const getRiskIcon = (riskName: string) => {
  const lowerCaseName = riskName.toLowerCase();
  if (lowerCaseName.includes('flood')) return Droplets;
  if (lowerCaseName.includes('fire')) return Flame;
  if (lowerCaseName.includes('drought')) return Sun;
  if (lowerCaseName.includes('storm')) return Wind;
  if (lowerCaseName.includes('snow')) return CloudSnow;
  return AlertOctagon;
};

const RiskSummary: React.FC<RiskSummaryProps> = ({ displayMode = 'full' }) => {
  const { prediction, isLoading, error, retryFetch } = useDisasterPrediction();

  if (isLoading) {
    return (
      <div className="card p-4 h-64 flex flex-col items-center justify-center text-center">
        <Loader2 className="animate-spin text-primary mb-3" size={24} />
        <h3 className="font-bold text-text-primary text-sm">Loading Risks...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4 h-64 flex flex-col items-center justify-center text-center bg-error/10">
        <AlertTriangle className="text-error mb-3" size={24} />
        <h3 className="font-bold text-error text-sm mb-2">Could Not Load Risks</h3>
        <button onClick={retryFetch} className="btn-secondary text-xs">
          <RefreshCw size={12} className="mr-1" />
          Retry
        </button>
      </div>
    );
  }

  const allCurrentRisks = prediction 
    ? Object.entries(prediction)
        .map(([name, probability]) => ({
          type: name,
          probability,
          icon: getRiskIcon(name),
          color: getRiskLevelClass(probability),
        }))
        .sort((a, b) => b.probability - a.probability)
        .filter(risk => risk.probability > 0.01)
    : [];

  const topRisk = allCurrentRisks.length > 0 
    ? allCurrentRisks[0] 
    : { type: 'None', probability: 0, color: 'text-success', icon: AlertOctagon };

  // Determine which risks to display based on the mode
  // The summary view shows the top 2 risks in the list
  const risksToDisplay = displayMode === 'summary' 
    ? allCurrentRisks.slice(0, 2) 
    : allCurrentRisks;

  return (
    <div className="card p-4 h-64 flex flex-col">
      <h3 className="font-bold text-text-primary mb-3">
        Current Risks
      </h3>
      
      <div className="flex items-center mb-3">
        <AlertOctagon className={topRisk.color} size={24} />
        <span className={`font-bold text-base ml-2 ${topRisk.color}`}>
          {topRisk.type} Risk
        </span>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="space-y-2">
          {risksToDisplay.length > 0 ? (
            risksToDisplay.map((risk, index) => {
              const Icon = risk.icon;
              const percentage = (risk.probability * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon size={16} className={risk.color} />
                    <span className="text-sm text-text-secondary ml-2">
                      {risk.type}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${risk.color}`}>
                    {percentage}%
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-text-secondary">
              No significant disaster risks detected at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskSummary;
