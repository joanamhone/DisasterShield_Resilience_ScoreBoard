import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface CommunityReadinessQuizProps {
  location: string
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

const CommunityReadinessQuiz: React.FC<CommunityReadinessQuizProps> = ({
  location,
  onComplete,
  onCancel
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizComplete, setQuizComplete] = useState(false)

  const questions: Question[] = [
    {
      id: 1,
      text: 'What is the estimated population of your community?',
      options: [
        { id: 1, text: 'Under 500', value: 2 },
        { id: 2, text: '500–1,000', value: 5 },
        { id: 3, text: '1,000–5,000', value: 7 },
        { id: 4, text: 'Over 5,000', value: 10 }
      ]
    },
    {
      id: 2,
      text: 'Does your community have a local health center or clinic equipped to handle emergency victims during a disaster?',
      options: [
        { id: 1, text: 'Yes, fully equipped', value: 10 },
        { id: 2, text: 'Partially equipped', value: 7 },
        { id: 3, text: 'Basic clinic only', value: 4 },
        { id: 4, text: 'None', value: 0 }
      ]
    },
    {
      id: 3,
      text: 'Are there designated emergency shelters or safe locations known to the community?',
      options: [
        { id: 1, text: 'Yes, well-known and accessible', value: 10 },
        { id: 2, text: 'Yes, but few know them', value: 5 },
        { id: 3, text: 'Not really', value: 2 },
        { id: 4, text: 'None', value: 0 }
      ]
    },
    {
      id: 4,
      text: 'Are evacuation routes clearly marked and accessible to all residents?',
      options: [
        { id: 1, text: 'Yes', value: 10 },
        { id: 2, text: 'Somewhat marked', value: 5 },
        { id: 3, text: 'Not marked', value: 0 }
      ]
    },
    {
      id: 5,
      text: 'Does the community have an early warning system (e.g., SMS, sirens, radio)?',
      options: [
        { id: 1, text: 'Yes, reliable and tested', value: 10 },
        { id: 2, text: 'Yes, but not reliable', value: 5 },
        { id: 3, text: 'No', value: 0 }
      ]
    },
    {
      id: 6,
      text: 'Is there a stockpile of emergency supplies (e.g., first aid, food, water)?',
      options: [
        { id: 1, text: 'Yes, fully stocked', value: 10 },
        { id: 2, text: 'Some supplies available', value: 5 },
        { id: 3, text: 'No supplies', value: 0 }
      ]
    },
    {
      id: 7,
      text: 'Are there trained disaster response teams or volunteers in the community?',
      options: [
        { id: 1, text: 'Yes, trained and active', value: 10 },
        { id: 2, text: 'Some training done', value: 5 },
        { id: 3, text: 'No team or training', value: 0 }
      ]
    },
    {
      id: 8,
      text: 'How often does the community conduct disaster response drills?',
      options: [
        { id: 1, text: 'At least once a year', value: 10 },
        { id: 2, text: 'Every few years', value: 5 },
        { id: 3, text: 'Never', value: 0 }
      ]
    },
    {
      id: 9,
      text: 'Have community members received disaster preparedness training in the past year?',
      options: [
        { id: 1, text: 'Yes, many have', value: 10 },
        { id: 2, text: 'Few have', value: 5 },
        { id: 3, text: 'None', value: 0 }
      ]
    },
    {
      id: 10,
      text: 'Are emergency contacts (fire, police, clinic) known to the community?',
      options: [
        { id: 1, text: 'Yes and accessible', value: 10 },
        { id: 2, text: 'Known to some', value: 5 },
        { id: 3, text: 'Not known or accessible', value: 0 }
      ]
    },
    {
      id: 11,
      text: 'Are local leaders or community groups involved in disaster preparedness planning?',
      options: [
        { id: 1, text: 'Yes, actively involved', value: 10 },
        { id: 2, text: 'Somewhat involved', value: 5 },
        { id: 3, text: 'Not involved', value: 0 }
      ]
    },
    {
      id: 12,
      text: 'Are vulnerable groups (elderly, disabled, children) considered in disaster plans?',
      options: [
        { id: 1, text: 'Yes, fully considered', value: 10 },
        { id: 2, text: 'Partially considered', value: 5 },
        { id: 3, text: 'Not considered', value: 0 }
      ]
    }
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
      const total = answers.reduce((sum, v) => sum + v, 0)
      const max = questions.length * 10
      const percent = Math.round((total / max) * 100)
      onComplete(percent, answers)
    }, 1000)
  }

  const isAnswered = answers[currentQuestionIndex] !== undefined
  const isLast = currentQuestionIndex === questions.length - 1

  if (quizComplete) {
    return (
      <div className="flex justify-center items-center min-h-60">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-text-primary">Scoring community readiness...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-divider">
        <div>
          <h2 className="text-lg font-bold">🏘️ Community Readiness Assessment</h2>
          <p className="text-sm text-text-secondary">{location}</p>
        </div>
        <button onClick={onCancel} className="p-1 hover:bg-surface rounded-lg">
          <X size={22} />
        </button>
      </div>

      {/* Progress */}
      <div className="p-4 pb-2">
        <div className="w-full bg-border h-2 rounded-full mb-2">
          <div
            className="h-2 bg-primary rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-text-secondary">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="p-4 space-y-6">
        <h3 className="text-base font-bold text-text-primary leading-snug">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.value)}
              className={`w-full flex justify-between items-start p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                answers[currentQuestionIndex] === option.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-card border-divider hover:border-primary/50 text-text-primary'
              }`}
            >
              <span>{option.text}</span>
              {answers[currentQuestionIndex] === option.value && (
                <Check size={20} className="ml-3 text-white" />
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
          className={`flex items-center px-4 py-2 rounded-lg ${
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
          className={`flex items-center px-6 py-2 font-bold rounded-lg transition-colors ${
            !isAnswered
              ? 'bg-border text-text-tertiary cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {isLast ? 'Complete Assessment' : 'Next Question'}
          {!isLast && <ChevronRight size={20} className="ml-1" />}
        </button>
      </div>
    </div>
  )
}

export default CommunityReadinessQuiz
