import React, { useState } from 'react';
import { ReadinessResponse } from '../../contexts/ReadinessContext';
import { format, isValid } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import RecommendationsComponent from '../readiness/RecommendationsComponent'; // Import the new component

interface AssessmentDetailsProps {
  assessment: ReadinessResponse;
  onBack: () => void;
}

const AssessmentDetails: React.FC<AssessmentDetailsProps> = ({ assessment, onBack }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'recommendations'>('details');

  const assessmentDate = new Date(assessment.created_at);
  const formattedDate = isValid(assessmentDate)
    ? format(assessmentDate, 'MMMM dd, yyyy • HH:mm')
    : 'Invalid Date';

  return (
    <div className="space-y-6 pb-6">
      <button onClick={onBack} className="flex items-center text-primary font-medium hover:underline mb-4">
        <ChevronLeft size={20} className="mr-1" />
        Back to Assessment History
      </button>

      <div className="card p-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-divider mb-4">
          <button
            className={`px-4 py-2 text-lg font-medium ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            onClick={() => setActiveTab('details')}
          >
            Assessment Details
          </button>
          <button
            className={`px-4 py-2 text-lg font-medium ${activeTab === 'recommendations' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' ? (
          <>
            <h3 className="text-xl font-bold text-text-primary mb-4">Assessment Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Type</p>
                <p className="font-medium text-text-primary capitalize">{assessment.type}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Date Taken</p>
                <p className="font-medium text-text-primary">{formattedDate}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Final Score</p>
                <p className="font-bold text-2xl text-primary">{assessment.score}%</p>
              </div>
            </div>

            <h4 className="font-bold text-text-primary mt-6 mb-3">Your Answers:</h4>
            {assessment.answers && assessment.answers.length > 0 ? (
              <div className="space-y-4">
                {assessment.answers.map((answer, index) => (
                  <div key={index} className="border-t border-divider pt-4">
                    <p className="text-text-primary font-medium mb-1">{index + 1}. {answer.question}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-text-secondary">
                        Your Answer: <span className="font-semibold text-text-primary">{answer.selectedOptionText}</span>
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {answer.pointsAwarded} / {answer.maxPoints} pts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary">No detailed answers were recorded for this assessment.</p>
            )}
          </>
        ) : (
          <div className="py-4">
            <h3 className="text-xl font-bold text-text-primary mb-4">Recommendations Based on Your Assessment</h3>
            {/* Use the new component to show dynamic recommendations */}
            <RecommendationsComponent answers={assessment.answers} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetails;
