import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface ReadinessQuizProps {
  onComplete: (score: number, answers: number[]) => void
  onCancel: () => void
}

interface Question {
  id: number
  text: string
  options: Option[]
}

interface Option {
  id: number
  text: string
  value: number
}

const ReadinessQuiz: React.FC<ReadinessQuizProps> = ({ onComplete, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizComplete, setQuizComplete] = useState(false)

  const questions: Question[] = [
    {
      id: 1,
      text: 'To what degree has your family developed comprehensive emergency communication plans?',
      options: [
        { id: 1, text: 'Fully developed with multiple contact methods and meeting points', value: 10 },
        { id: 2, text: 'Partially developed with basic contact information', value: 7 },
        { id: 3, text: 'We have discussed it but no formal plan exists', value: 4 },
        { id: 4, text: 'No communication plan has been established', value: 0 },
      ],
    },
    {
      id: 2,
      text: 'How well-stocked is your emergency supply kit with essential items?',
      options: [
        { id: 1, text: 'Fully stocked with 2+ weeks of supplies, regularly maintained', value: 10 },
        { id: 2, text: 'Well-stocked with 1 week of supplies, occasionally updated', value: 8 },
        { id: 3, text: 'Basic supplies available but incomplete or outdated', value: 5 },
        { id: 4, text: 'Minimal or no emergency supplies prepared', value: 0 },
      ],
    },
    {
      id: 3,
      text: 'How extensively have family members received emergency response training?',
      options: [
        { id: 1, text: 'All members trained in first aid, CPR, and emergency procedures', value: 10 },
        { id: 2, text: 'Some members have basic first aid or emergency training', value: 7 },
        { id: 3, text: 'Limited training, mostly from online resources or reading', value: 4 },
        { id: 4, text: 'No formal emergency response training received', value: 0 },
      ],
    },
    {
      id: 4,
      text: 'How prepared are you for extended power outages and utility disruptions?',
      options: [
        { id: 1, text: 'Multiple backup power sources and alternative utilities ready', value: 10 },
        { id: 2, text: 'Some backup power options and basic utility alternatives', value: 7 },
        { id: 3, text: 'Limited backup options, mostly battery-powered devices', value: 4 },
        { id: 4, text: 'No backup power or utility alternatives prepared', value: 0 },
      ],
    },
    {
      id: 5,
      text: 'How secure and accessible are your important documents and financial resources?',
      options: [
        { id: 1, text: 'Multiple copies stored securely with easy emergency access', value: 10 },
        { id: 2, text: 'Digital and physical copies stored in secure locations', value: 8 },
        { id: 3, text: 'Some copies made but storage could be more secure', value: 5 },
        { id: 4, text: 'No secure copies or emergency financial preparations', value: 0 },
      ],
    },
    {
      id: 6,
      text: 'How well do you understand and prepare for the specific risks in your area?',
      options: [
        { id: 1, text: 'Thoroughly researched local risks with specific preparations', value: 10 },
        { id: 2, text: 'Good understanding of major risks with some preparations', value: 7 },
        { id: 3, text: 'Basic awareness of risks but limited specific preparations', value: 4 },
        { id: 4, text: 'Little knowledge of local risks or specific preparations', value: 0 },
      ],
    },
  ]

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = value
    setAnswers(newAnswers)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      calculateScore()
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScore = () => {
    setQuizComplete(true)
    
    setTimeout(() => {
      const totalPoints = answers.reduce((sum, value) => sum + value, 0)
      const maxPossiblePoints = questions.length * 10
      const scorePercentage = Math.round((totalPoints / maxPossiblePoints) * 100)
      
      onComplete(scorePercentage, answers)
    }, 1500)
  }

  const isAnswered = answers[currentQuestionIndex] !== undefined
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  if (quizComplete) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium text-text-primary">
            Calculating your comprehensive readiness score...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-divider">
        <h2 className="text-lg font-bold text-text-primary">
          Comprehensive Readiness Assessment
        </h2>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-surface rounded-lg transition-colors duration-200"
        >
          <X size={24} className="text-text-primary" />
        </button>
      </div>

      {/* Progress */}
      <div className="p-4 pb-2">
        <div className="w-full bg-border h-2 rounded-full mb-2">
          <div 
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-text-secondary">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="p-4 space-y-6">
        <h3 className="text-lg font-bold text-text-primary leading-relaxed">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.value)}
              className={`w-full flex justify-between items-start p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                answers[currentQuestionIndex] === option.value
                  ? 'bg-primary border-primary text-white'
                  : 'bg-card border-divider hover:border-primary/50 text-text-primary'
              }`}
            >
              <span className="flex-1 leading-relaxed">
                {option.text}
              </span>
              {answers[currentQuestionIndex] === option.value && (
                <Check size={20} className="text-white ml-3 flex-shrink-0 mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
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
  )
}

export default ReadinessQuiz