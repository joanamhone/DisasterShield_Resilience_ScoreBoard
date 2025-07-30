import React, { useState, useEffect } from 'react'; // **THE FIX: Added useEffect here**
import { Check, X, AlertCircle, ChevronRight, Users, School, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReadiness } from '../contexts/ReadinessContext';
import { format } from 'date-fns';

// Assuming these components exist in your project structure
import ReadinessQuiz from '../components/readiness/ReadinessQuiz';
import { ScoreOverview } from '../components/readiness/ScoreComponents'; 
// import SchoolReadinessQuiz from '../components/readiness/SchoolReadinessQuiz';
// import CommunityReadinessQuiz from '../components/readiness/CommunityReadinessQuiz';

const Readiness: React.FC = () => {
  const { user } = useAuth();
  const { assessmentHistory, isLoading, saveResponse } = useReadiness();
  
  const [currentStep, setCurrentStep] = useState<'choice' | 'quiz' | 'results'>('choice');
  const [quizType, setQuizType] = useState<'general' | 'school' | 'community'>('general');
  const [completedScore, setCompletedScore] = useState<number>(0); 
  const [currentAnswers, setCurrentAnswers] = useState<number[]>([]);

  // This function is now the single point of truth for completing a quiz
  const handleQuizComplete = (score: number, answers: number[]) => {
    setCompletedScore(score);
    setCurrentAnswers(answers);
    setCurrentStep('results'); // Immediately switch to the results view
  };
  
  // A new effect to save the score *after* the view has changed
  useEffect(() => {
      if(currentStep === 'results' && completedScore > 0 && currentAnswers.length > 0) {
          saveResponse(completedScore, currentAnswers);
      }
  }, [currentStep, completedScore, currentAnswers, saveResponse]);


  const handleAssessmentChoice = (type: 'general' | 'school' | 'community' = 'general') => {
    setQuizType(type);
    setCurrentStep('quiz');
  };
  
  const startNewAssessment = () => {
    setCurrentStep('choice');
    setQuizType('general');
  };

  if (isLoading && currentStep !== 'quiz') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (currentStep === 'quiz') {
    return (
      <ReadinessQuiz 
        onComplete={handleQuizComplete} 
        onCancel={() => setCurrentStep('choice')} 
      />
    );
  }

  if (currentStep === 'results') {
    return (
        <div className="space-y-6 pb-6">
            <ScoreOverview score={completedScore} />
            <div className="card p-4 flex items-center justify-between">
                <h3 className="font-bold text-text-primary">Assessment Complete</h3>
                <button onClick={startNewAssessment} className="btn-primary">
                    New Assessment
                </button>
            </div>
        </div>
    );
  }

  // Default view: 'choice'
  return (
    <div className="space-y-6 pb-6">
      <div className="card p-6">
        <h3 className="text-xl font-bold text-text-primary mb-4">
          Disaster Readiness and Preparedness Assessment
        </h3>
        <p className="text-text-secondary mb-6">
          Select an assessment to evaluate your readiness.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleAssessmentChoice('general')}
            className="card p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/20 text-left w-full"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <AlertCircle className="text-primary" size={24} />
              </div>
              <h4 className="font-bold text-text-primary">Individual/Household Assessment</h4>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              For Individuals & Families. Evaluate how prepared you and your household are.
            </p>
            <div className="mt-4 flex items-center text-primary">
              <span className="text-sm font-medium">Start Assessment</span>
              <ChevronRight size={16} className="ml-1" />
            </div>
          </button>
        </div>
      </div>

      {assessmentHistory.length > 0 && (
        <div className="card p-4">
          <h3 className="text-lg font-bold text-text-primary mb-4">Assessment History</h3>
          <div className="space-y-3">
            {assessmentHistory.map((assessment) => (
              <div key={assessment.id} className="flex justify-between items-center p-3 bg-surface rounded-lg">
                <div>
                  <p className="font-semibold text-text-primary">
                    Readiness Score: {assessment.score}%
                  </p>
                  <p className="text-sm text-text-secondary">
                    Taken on {format(new Date(assessment.created_at), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <span className="text-lg font-bold text-primary">{assessment.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Readiness;
