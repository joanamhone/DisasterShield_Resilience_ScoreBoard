import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface SeasonalReadinessQuizProps {
  location: string
  season: string
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

const SeasonalReadinessQuiz: React.FC<SeasonalReadinessQuizProps> = ({
  location,
  season,
  onComplete,
  onCancel,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizComplete, setQuizComplete] = useState(false)

  const getSeasonalQuestions = (): Question[] => {
    return [
      {
        id: 1,
        text: 'How many students are currently enrolled at your school?',
        options: [
          { id: 1, text: 'Less than 100', value: 2 },
          { id: 2, text: '100 to 300', value: 5 },
          { id: 3, text: '301 to 500', value: 7 },
          { id: 4, text: 'More than 500', value: 10 },
        ],
      },
      {
        id: 2,
        text: 'How many classrooms are in use on a typical school day?',
        options: [
          { id: 1, text: 'Less than 5', value: 2 },
          { id: 2, text: '5 to 10', value: 5 },
          { id: 3, text: '11 to 20', value: 7 },
          { id: 4, text: 'More than 20', value: 10 },
        ],
      },
      {
        id: 3,
        text: 'Do you have enough classrooms relative to the number of students (no overcrowding)?',
        options: [
          { id: 1, text: 'Yes, sufficient classrooms', value: 10 },
          { id: 2, text: 'No, some overcrowding', value: 5 },
          { id: 3, text: 'Severe overcrowding', value: 2 },
          { id: 4, text: 'Unsure', value: 0 },
        ],
      },
      {
        id: 4,
        text: 'Which hazard does your school consider as the main potential threat? (Choose one)',
        options: [
          { id: 1, text: 'Flooding', value: 10 },
          { id: 2, text: 'Fire', value: 8 },
          { id: 3, text: 'Structural collapse', value: 7 },
          { id: 4, text: 'Disease outbreak', value: 6 },
          { id: 5, text: 'Violence or unrest', value: 5 },
          { id: 6, text: 'Chemical spill', value: 4 },
          { id: 7, text: 'Other', value: 3 },
        ],
      },
      {
        id: 5,
        text: 'Does the school have a written, multi-hazard emergency response plan?',
        options: [
          { id: 1, text: 'Yes, fully documented', value: 10 },
          { id: 2, text: 'No, but in preparation', value: 5 },
          { id: 3, text: 'No plan exists', value: 0 },
        ],
      },
      {
        id: 6,
        text: 'Is there a designated crisis or emergency response team or coordinator?',
        options: [
          { id: 1, text: 'Yes, full-time', value: 10 },
          { id: 2, text: 'Yes, part-time', value: 7 },
          { id: 3, text: 'No', value: 0 },
        ],
      },
      {
        id: 7,
        text: 'How frequently does your school conduct emergency drills (e.g., fire, evacuation)?',
        options: [
          { id: 1, text: 'Quarterly or more', value: 10 },
          { id: 2, text: 'Bi-annual', value: 7 },
          { id: 3, text: 'Annual', value: 5 },
          { id: 4, text: 'Never', value: 0 },
        ],
      },
      {
        id: 8,
        text: 'Does your school maintain emergency supplies (water, first aid kits, fire extinguishers, masks)?',
        options: [
          { id: 1, text: 'All essential items available', value: 10 },
          { id: 2, text: 'Many but not all items', value: 7 },
          { id: 3, text: 'Few items', value: 4 },
          { id: 4, text: 'None', value: 0 },
        ],
      },
      {
        id: 9,
        text: 'Are emergency exits, staircases, and evacuation routes adequate and accessible for the school population?',
        options: [
          { id: 1, text: 'Yes, fully adequate and accessible', value: 10 },
          { id: 2, text: 'Partially adequate', value: 5 },
          { id: 3, text: 'No, inadequate or inaccessible', value: 0 },
        ],
      },
      {
        id: 10,
        text: 'Are parents regularly informed and involved in disaster preparedness activities?',
        options: [
          { id: 1, text: 'Yes, actively involved', value: 10 },
          { id: 2, text: 'Sometimes involved', value: 5 },
          { id: 3, text: 'Not involved', value: 0 },
        ],
      },
    ]
  }

  const questions = getSeasonalQuestions()
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

  const getSeasonEmoji = (season: string) => {
    const seasonEmojis: Record<string, string> = {
      spring: '🌸',
      summer: '☀️',
      autumn: '🍂',
      winter: '❄️',
      rainy: '🌧️',
      dry: '🏜️',
    }
    return seasonEmojis[season] || '🌍'
  }

  const formattedSeason = season
    ? season.charAt(0).toUpperCase() + season.slice(1)
    : ''

  if (quizComplete) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium text-text-primary">
            Calculating your school disaster preparedness score...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-divider">
        <div>
          <h2 className="text-lg font-bold text-text-primary">
            {getSeasonEmoji(season)} School Disaster Preparedness Assessment
          </h2>
          <p className="text-sm text-text-secondary">
            {location} • {formattedSeason} Season
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-surface rounded-lg transition-colors duration-200"
          aria-label="Cancel Assessment"
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
              aria-pressed={answers[currentQuestionIndex] === option.value}
            >
              <span className="flex-1 leading-relaxed">{option.text}</span>
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
          aria-disabled={currentQuestionIndex === 0}
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
          aria-disabled={!isAnswered}
        >
          {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
          {!isLastQuestion && <ChevronRight size={20} className="ml-1" />}
        </button>
      </div>
    </div>
  )
}

export default SeasonalReadinessQuiz
