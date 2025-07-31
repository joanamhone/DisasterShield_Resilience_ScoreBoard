import React from 'react';
import { Shield, Info } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const ActionableRecommendations: React.FC = () => {
  const { activeRisks } = useNotifications();

  // If there are active risks, show tailored recommendations in separate cards
  if (activeRisks.length > 0) {
    return (
      <div className="space-y-4">
        {activeRisks.map(risk => (
          <div key={risk.key} className="card p-4 sm:p-6">
            <div className="flex items-start mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-error/10 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Shield className="text-error" size={16} />
                </div>
                <div>
                    <h4 className="font-bold text-text-primary">
                      Priority Actions for {risk.title}
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Based on the current high-risk alert.
                    </p>
                </div>
            </div>
            
            {/* Recommendations are now a list of activities */}
            <ul className="space-y-2 list-disc list-inside text-text-secondary text-sm pl-2">
                {risk.recommendation.map((action, index) => (
                    <li key={index}>
                        {action}
                    </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  // If there are no active risks, show a message indicating everything is clear.
  return (
    <div className="card p-6 text-center">
        <Info size={24} className="mx-auto text-text-tertiary mb-2" />
        <p className="text-text-secondary">No specific recommendations at the moment. Your area is currently clear of high-risk threats.</p>
    </div>
  );
};

export default ActionableRecommendations;
