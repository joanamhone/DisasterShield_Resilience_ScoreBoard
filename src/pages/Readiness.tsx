import React, { useState } from 'react';
// Added Users2 for the new community button
import { AlertCircle, ChevronRight, Loader2, Users2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReadiness, ReadinessResponse, AssessmentAnswer } from '../contexts/ReadinessContext';
import { format } from 'date-fns';

// Import your components
import ReadinessQuiz from '../components/readiness/ReadinessQuiz';
import { ScoreOverview } from '../components/readiness/ScoreComponents';
import AssessmentDetails from '../components/readiness/AssessmentDetails';
import CommunityReadinessQuiz from '../components/readiness/CommunityReadinessQuiz'; 

const Readiness: React.FC = () => {
  useAuth();
  const { assessmentHistory, isLoading, saveAssessment } = useReadiness();
  
  const [currentStep, setCurrentStep] = useState<'choice' | 'quiz' | 'results' | 'history-detail'>('choice');
  const [quizType, setQuizType] = useState<'general' | 'school' | 'community'>('general');
  const [completedScore, setCompletedScore] = useState<number>(0);
  const [selectedAssessment, setSelectedAssessment] = useState<ReadinessResponse | null>(null);

  const handleQuizComplete = async (score: number, answers: AssessmentAnswer[]) => {
    try {
      setCompletedScore(score);
      await saveAssessment(score, quizType, answers);
    } catch (error) {
      console.error("Failed to save readiness assessment:", error);
    } finally {
      setCurrentStep('results');
    }
  };

  const handleAssessmentChoice = (type: 'general' | 'school' | 'community' = 'general') => {
    setQuizType(type);
    setCurrentStep('quiz');
  };
  
  const startNewAssessment = () => {
    setCurrentStep('choice');
    setQuizType('general');
    setSelectedAssessment(null);
  };

  const handleViewAssessmentDetails = (assessment: ReadinessResponse) => {
    setSelectedAssessment(assessment);
    setCurrentStep('history-detail');
  };

  if (isLoading && currentStep !== 'quiz') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // --- MODIFICATION: Conditionally render the correct quiz component ---
  if (currentStep === 'quiz') {
    if (quizType === 'community') {
      return (
        <CommunityReadinessQuiz 
          onComplete={handleQuizComplete}
          onCancel={() => setCurrentStep('choice')} location={''}        />
      );
    }
    // Default to the general quiz for 'general' or 'school' types
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

  if (currentStep === 'history-detail' && selectedAssessment) {
      return <AssessmentDetails assessment={selectedAssessment} onBack={startNewAssessment} />;
  }

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

          {/* --- MODIFICATION: Added button for Community Assessment --- */}
          <button
            onClick={() => handleAssessmentChoice('community')}
            className="card p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/20 text-left w-full"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mr-4">
                <Users2 className="text-secondary" size={24} />
              </div>
              <h4 className="font-bold text-text-primary">Community Assessment</h4>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              For Community Leaders. Evaluate the preparedness of your local community.
            </p>
            <div className="mt-4 flex items-center text-secondary">
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
              <button 
                key={assessment.id} 
                onClick={() => handleViewAssessmentDetails(assessment)}
                className="w-full flex justify-between items-center p-3 bg-surface rounded-lg text-left hover:bg-border transition-colors"
              >
                <div>
                  <p className="font-semibold text-text-primary">
                    Readiness Score: {assessment.score}%
                  </p>
                  <p className="text-sm text-text-secondary">
                    Taken on {format(new Date(assessment.created_at), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex items-center">
                    <span className="text-lg font-bold text-primary mr-2">{assessment.score}%</span>
                    <ChevronRight size={16} className="text-text-tertiary" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Readiness;