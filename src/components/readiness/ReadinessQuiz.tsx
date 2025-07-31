// src/components/readiness/ReadinessQuiz.tsx
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useReadiness, AssessmentAnswer } from '../../contexts/ReadinessContext'; // Import AssessmentAnswer

interface ReadinessQuizProps {
  // onComplete now receives score and detailed answers
  onComplete: (score: number, answers: AssessmentAnswer[]) => void;
  onCancel: () => void;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}
interface Option {
  id: number;
  text: string;
  value: number;
}

const ReadinessQuiz: React.FC<ReadinessQuizProps> = ({ onComplete, onCancel }) => {
  // We don't use useReadiness's updateScore directly here.
  // We'll pass the completed data back to Readiness.tsx via onComplete prop.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionValues, setSelectedOptionValues] = useState<number[]>([]); // Store only selected option values
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: 'How many people are currently living in your household?',
      options: [
        { id: 1, text: '1 person', value: 2 },
        { id: 2, text: '2–3 people', value: 4 },
        { id: 3, text: '4–5 people', value: 6 },
        { id: 4, text: '6–8 people', value: 8 },
        { id: 5, text: 'More than 8', value: 10 },
      ],
    },
    {
      id: 2,
      text: 'Are there vulnerable individuals in your household (e.g., babies, elderly, disabled)?',
      options: [
        { id: 1, text: 'Yes, more than one', value: 10 },
        { id: 2, text: 'Yes, one', value: 8 },
        { id: 3, text: 'No, but often care for visitors who are', value: 5 },
        { id: 4, text: 'Not sure', value: 2 },
        { id: 5, text: 'No', value: 0 },
      ],
    },
    {
      id: 3,
      text: 'What type of home do you live in?',
      options: [
        { id: 1, text: 'Brick or cement house with strong roof', value: 10 },
        { id: 2, text: 'Semi-permanent house (brick and thatch/iron sheet)', value: 7 },
        { id: 3, text: 'Traditional hut or mud house', value: 4 },
        { id: 4, text: 'Makeshift shelter or temporary housing', value: 2 },
        { id: 5, text: 'Other', value: 5 },
      ],
    },
    {
      id: 4,
      text: 'How close is your home to a flood-prone or high-risk area?',
      options: [
        { id: 1, text: 'Within 100 meters', value: 0 },
        { id: 2, text: 'Nearby (100–500 meters)', value: 2 },
        { id: 3, text: 'Slightly distant (0.5–1 km)', value: 4 },
        { id: 4, text: 'Far from danger zones', value: 8 },
        { id: 5, text: 'I don’t know', value: 1 },
      ],
    },
    {
      id: 5,
      text: 'Do you have a household emergency plan (evacuation, meeting point, communication)?',
      options: [
        { id: 1, text: 'Yes, and we’ve practiced it', value: 10 },
        { id: 2, text: 'Yes, but not practiced', value: 7 },
        { id: 3, text: 'Talked about it only', value: 4 },
        { id: 4, text: 'Planning to make one', value: 2 },
        { id: 5, text: 'No plan at all', value: 0 },
      ],
    },
    {
      id: 6,
      text: 'Have you stored emergency supplies (food, water, flashlight, battery, etc.) for disasters?',
      options: [
        { id: 1, text: 'Yes, supplies for 3+ days', value: 10 },
        { id: 2, text: 'Yes, for 1–2 days', value: 8 },
        { id: 3, text: 'Some basic items only', value: 5 },
        { id: 4, text: 'Planning to collect', value: 2 },
        { id: 5, text: 'None', value: 0 },
      ],
    },
    {
      id: 7,
      text: 'How confident are you in performing basic first aid in an emergency?',
      options: [
        { id: 1, text: 'Very confident (trained)', value: 10 },
        { id: 2, text: 'Somewhat confident', value: 7 },
        { id: 3, text: 'Know a few basic things', value: 5 },
        { id: 4, text: 'Not confident', value: 2 },
        { id: 5, text: 'No knowledge at all', value: 0 },
      ],
    },
    {
      id: 8,
      text: 'How do you usually receive emergency information or alerts?',
      options: [
        { id: 1, text: 'Phone (SMS or apps)', value: 10 },
        { id: 2, text: 'Radio', value: 8 },
        { id: 3, text: 'Neighbors or community leaders', value: 5 },
        { id: 4, text: 'I don’t usually receive alerts', value: 1 },
        { id: 5, text: 'I rely on social media', value: 3 },
      ],
    },
    {
      id: 9,
      text: 'Do you know where the nearest emergency shelter or safe area is?',
      options: [
        { id: 1, text: 'Yes, and we’ve practiced going there', value: 10 },
        { id: 2, text: 'Yes, but never visited', value: 7 },
        { id: 3, text: 'Heard about it, unsure where it is', value: 4 },
        { id: 4, text: 'No shelter nearby', value: 1 },
        { id: 5, text: 'I don’t know about any', value: 0 },
      ],
    },
    {
      id: 10,
      text: 'Do you have digital or physical copies of important documents (IDs, health records, etc.) stored safely?',
      options: [
        { id: 1, text: 'Yes, both digital and physical', value: 10 },
        { id: 2, text: 'Only physical', value: 7 },
        { id: 3, text: 'Only digital', value: 5 },
        { id: 4, text: 'Some, but not all documents', value: 3 },
        { id: 5, text: 'No backup at all', value: 0 },
      ],
    },
  ];

  // Store the selected option's value for the current question
  const handleAnswer = (value: number) => {
    const newAnswers = [...selectedOptionValues];
    newAnswers[currentQuestionIndex] = value;
    setSelectedOptionValues(newAnswers);
  };

  const calculateAndProvideAnswers = () => {
    setIsSubmitting(true);
    // Transform numerical answers into detailed AssessmentAnswer objects
    const detailedAnswers: AssessmentAnswer[] = questions.map((q, index) => {
      const selectedValue = selectedOptionValues[index];
      const selectedOption = q.options.find(opt => opt.value === selectedValue);
      const userAnswerText = selectedOption ? selectedOption.text : 'No answer';

      // For general quiz, we don't have a 'correct' answer directly.
      // The 'value' is just a score. You might define 'correctAnswer' differently
      // or omit it if it doesn't apply to a self-assessment.
      // For simplicity, let's assume no explicit 'correctAnswer' for this type of quiz
      // unless you add it to your question data later.
      return {
        questionId: q.id,
        question: q.text,
        userAnswer: userAnswerText,
        // No explicit correctAnswer/isCorrect for a self-assessment,
        // pointsAwarded is simply the value chosen.
        pointsAwarded: selectedValue,
        maxPoints: 10, // Max points per question is 10
        selectedOptionText: userAnswerText // Store the text for display
      };
    });

    const totalPoints = selectedOptionValues.reduce((sum, value) => sum + value, 0);
    const maxPossiblePoints = questions.length * 10;
    const scorePercentage = Math.round((totalPoints / maxPossiblePoints) * 100);

    onComplete(scorePercentage, detailedAnswers); // Pass detailed answers to parent
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateAndProvideAnswers(); // Call the function to calculate and pass answers
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const isAnswered = selectedOptionValues[currentQuestionIndex] !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium text-text-primary">Completing your assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* UI remains the same */}
      <div className="flex justify-between items-center p-4 border-b border-divider">
        <h2 className="text-lg font-bold text-text-primary">Comprehensive Readiness Assessment</h2>
        <button onClick={onCancel} className="p-1 hover:bg-surface rounded-lg transition-colors duration-200">
          <X size={24} className="text-text-primary" />
        </button>
      </div>
      <div className="p-4 pb-2">
        <div className="w-full bg-border h-2 rounded-full mb-2">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-text-secondary">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>
      <div className="p-4 space-y-6">
        <h3 className="text-lg font-bold text-text-primary leading-relaxed">{currentQuestion.text}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.value)}
              className={`w-full flex justify-between items-start p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedOptionValues[currentQuestionIndex] === option.value
                  ? 'bg-primary border-primary text-white'
                  : 'bg-card border-divider hover:border-primary/50 text-text-primary'
              }`}
            >
              <span className="flex-1 leading-relaxed">{option.text}</span>
              {selectedOptionValues[currentQuestionIndex] === option.value && (
                <Check size={20} className="text-white ml-3 flex-shrink-0 mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center p-4 border-t border-divider">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
            currentQuestionIndex === 0
              ? 'text-text-tertiary cursor-not-allowed'
              : 'text-text-primary hover:bg-surface'
          }`}
        >
          <ChevronLeft size={20} className="mr-1" />
          Previous
        </button>
        <button
          onClick={goToNextQuestion}
          disabled={!isAnswered}
          className={`flex items-center px-6 py-2 rounded-lg font-bold transition-colors duration-200 ${
            !isAnswered
              ? 'bg-border text-text-tertiary cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
          {!isLastQuestion && <ChevronRight size={20} className="ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default ReadinessQuiz;