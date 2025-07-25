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

// A helper to map disaster names from the model to icons and colors
const getRiskDetails = (riskName: string) => {
  const lowerCaseName = riskName.toLowerCase();
  if (lowerCaseName.includes('flood')) return { icon: Droplets, color: 'text-risk-medium' };
  if (lowerCaseName.includes('fire')) return { icon: Flame, color: 'text-risk-high' };
  if (lowerCaseName.includes('drought')) return { icon: Sun, color: 'text-risk-high' };
  if (lowerCaseName.includes('storm')) return { icon: Wind, color: 'text-risk-low' };
  if (lowerCaseName.includes('snow')) return { icon: CloudSnow, color: 'text-risk-low' };
  return { icon: AlertOctagon, color: 'text-text-secondary' };
};

const RiskSummary: React.FC = () => {
  // Get live data from the context instead of using static data
  const { prediction, isLoading, error, retryFetch } = useDisasterPrediction();

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="card p-4 flex flex-col items-center justify-center text-center h-full">
        <Loader2 className="animate-spin text-primary mb-3" size={24} />
        <h3 className="font-bold text-text-primary text-sm">Loading Risks...</h3>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="card p-4 flex flex-col items-center justify-center text-center h-full bg-error/10">
        <AlertTriangle className="text-error mb-3" size={24} />
        <h3 className="font-bold text-error text-sm mb-2">Could Not Load Risks</h3>
        <button onClick={retryFetch} className="btn-secondary text-xs">
          <RefreshCw size={12} className="mr-1" />
          Retry
        </button>
      </div>
    );
  }

  // Convert the prediction object into an array of risks
  const currentRisks = prediction 
    ? Object.entries(prediction)
        .map(([name, probability]) => ({
          type: name,
          probability: probability,
          ...getRiskDetails(name),
        }))
        // Sort by probability to show the most likely risks first
        .sort((a, b) => b.probability - a.probability)
        // Only show risks with a meaningful probability
        .filter(risk => risk.probability > 0.01)
    : [];

  const topRisk = currentRisks.length > 0 ? currentRisks[0] : { type: 'None', probability: 0, color: 'text-success' };

  return (
    <div className="card p-4">
      <h3 className="font-bold text-text-primary mb-3">
        Current Risks
      </h3>
      
      <div className="flex items-center mb-3">
        <AlertOctagon className={topRisk.color} size={24} />
        <span className={`font-bold text-base ml-2 ${topRisk.color}`}>
          {topRisk.type} Risk
        </span>
      </div>
      
      <div className="space-y-2">
        {currentRisks.length > 0 ? (
          currentRisks.slice(0, 3).map((risk, index) => { // Show top 3 risks
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
          <p className="text-sm text-text-secondary">No significant disaster risks detected at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default RiskSummary;
