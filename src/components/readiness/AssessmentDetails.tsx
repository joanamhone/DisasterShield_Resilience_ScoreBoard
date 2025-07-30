// src/components/readiness/AssessmentDetails.tsx
import React from 'react';
import { AssessmentHistoryItem } from '../../contexts/ReadinessContext';
import { format, isValid } from 'date-fns'; // Import isValid

interface AssessmentDetailsProps {
  assessment: AssessmentHistoryItem;
  onBack: () => void;
}

const AssessmentDetails: React.FC<AssessmentDetailsProps> = ({ assessment, onBack }) => {
  // Robust date handling
  const assessmentDate = new Date(assessment.date);
  const formattedDate = isValid(assessmentDate)
    ? format(assessmentDate, 'MMM dd, yyyy • HH:mm')
    : 'Invalid Date'; // Fallback for invalid dates

  return (
    <div className="space-y-6 pb-6">
      <div className="card p-6">
        <h3 className="text-xl font-bold text-text-primary mb-4">Assessment Details</h3>
        <p className="text-text-secondary mb-2">
          <strong>Type:</strong> {assessment.type === 'seasonal' ? 'Seasonal' : 'General'}
          {assessment.type === 'school' && ' (School)'}
          {assessment.type === 'community' && ' (Community)'}
        </p>
        {assessment.location && assessment.season && (
          <p className="text-text-secondary mb-2">
            <strong>Location:</strong> {assessment.location}, <strong>Season:</strong> {assessment.season}
          </p>
        )}
        <p className="text-text-secondary mb-2">
          <strong>Date:</strong> {formattedDate} {/* Use the formattedDate */}
        </p>
        <p className="text-text-secondary mb-4">
          <strong>Score:</strong>{' '}
          <span
            className="font-bold"
            style={{
              color:
                assessment.score < 30
                  ? '#D32F2F'
                  : assessment.score < 60
                    ? '#FFA000'
                    : assessment.score < 80
                      ? '#F57C00'
                      : '#43A047',
            }}
          >
            {assessment.score}%
          </span>
        </p>

        <h4 className="font-bold text-text-primary mt-6 mb-3">Your Answers:</h4>
        {assessment.answers.length > 0 ? (
          <div className="space-y-4">
            {assessment.answers.map((answer, index) => (
              <div key={index} className="border-b border-divider pb-4 last:border-b-0">
                <p className="text-text-primary font-medium mb-1">{answer.question}</p>
                <p className={`text-sm ${answer.isCorrect ? 'text-success' : 'text-error'}`}>
                  **Your Answer:** {Array.isArray(answer.userAnswer) ? answer.userAnswer.join(', ') : answer.userAnswer}
                  {' '} ({answer.isCorrect ? 'Correct' : 'Incorrect'})
                </p>
                {!answer.isCorrect && (
                  <p className="text-sm text-text-secondary">
                    **Correct Answer:** {Array.isArray(answer.correctAnswer) ? answer.correctAnswer.join(', ') : answer.correctAnswer}
                  </p>
                )}
                {answer.explanation && (
                    <p className="text-xs text-text-tertiary mt-1">
                        **Explanation:** {answer.explanation}
                    </p>
                )}
                {answer.pointsAwarded !== undefined && (
                    <p className="text-xs text-text-tertiary mt-1">
                        Points: {answer.pointsAwarded}{answer.maxPoints ? `/${answer.maxPoints}` : ''}
                    </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary">No detailed answers available for this assessment.</p>
        )}

        <button onClick={onBack} className="btn-secondary mt-6">
          ← Back to History
        </button>
      </div>
    </div>
  );
};

export default AssessmentDetails;