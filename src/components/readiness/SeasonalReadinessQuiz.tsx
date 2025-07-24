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
  onCancel 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizComplete, setQuizComplete] = useState(false)

  const getSeasonalQuestions = (): Question[] => {
    const baseQuestions: Question[] = [
      {
        id: 1,
        text: 'How comprehensive is your emergency communication plan for your household?',
        options: [
          { id: 1, text: 'Complete plan with multiple contact methods and designated meeting points', value: 10 },
          { id: 2, text: 'Basic plan established but could use more detail or practice', value: 7 },
          { id: 3, text: 'Informal discussions held but no written plan exists', value: 4 },
          { id: 4, text: 'No emergency communication plan has been developed', value: 0 },
        ],
      },
      {
        id: 2,
        text: 'How well-prepared is your emergency supply kit for extended disruptions?',
        options: [
          { id: 1, text: 'Fully stocked with 2+ weeks of supplies, regularly updated and organized', value: 10 },
          { id: 2, text: 'Well-stocked with 1 week of supplies, occasionally maintained', value: 7 },
          { id: 3, text: 'Basic supplies available but incomplete or needs updating', value: 4 },
          { id: 4, text: 'Minimal emergency supplies or no organized kit', value: 0 },
        ],
      },
    ]

    const seasonalQuestions: Record<string, Question[]> = {
      summer: [
        {
          id: 3,
          text: 'How prepared are you for extreme heat events and potential power outages during hot weather?',
          options: [
            { id: 1, text: 'Multiple cooling strategies, backup power, and heat emergency plan ready', value: 10 },
            { id: 2, text: 'Some cooling alternatives and basic heat safety measures in place', value: 7 },
            { id: 3, text: 'Limited heat preparations, mostly relying on air conditioning', value: 4 },
            { id: 4, text: 'No specific preparations for extreme heat events', value: 0 },
          ],
        },
        {
          id: 4,
          text: 'How adequate is your water storage and conservation plan for hot, dry conditions?',
          options: [
            { id: 1, text: 'Extensive water storage (1+ gallon per person per day for 2+ weeks) with conservation plan', value: 10 },
            { id: 2, text: 'Good water storage (1 week supply) with some conservation measures', value: 7 },
            { id: 3, text: 'Basic water storage but limited conservation planning', value: 4 },
            { id: 4, text: 'Minimal water storage and no conservation plan', value: 0 },
          ],
        },
        {
          id: 5,
          text: 'How well-prepared are you for wildfire risks and evacuation scenarios?',
          options: [
            { id: 1, text: 'Comprehensive wildfire plan with defensible space, evacuation routes, and go-bags ready', value: 10 },
            { id: 2, text: 'Some wildfire preparations including cleared vegetation and evacuation planning', value: 7 },
            { id: 3, text: 'Basic awareness of wildfire risk with minimal specific preparations', value: 4 },
            { id: 4, text: 'No specific wildfire preparedness measures taken', value: 0 },
          ],
        },
      ],
      winter: [
        {
          id: 3,
          text: 'How prepared are you for severe winter weather and extended power outages?',
          options: [
            { id: 1, text: 'Multiple heating sources, winterized home, and comprehensive cold weather supplies', value: 10 },
            { id: 2, text: 'Some backup heating options and basic winter emergency supplies', value: 7 },
            { id: 3, text: 'Limited winter preparations, mostly relying on central heating', value: 4 },
            { id: 4, text: 'No specific winter weather emergency preparations', value: 0 },
          ],
        },
        {
          id: 4,
          text: 'How well-stocked are you with food and supplies for potential winter isolation?',
          options: [
            { id: 1, text: 'Extensive food storage (2+ weeks) with winter-specific supplies and medications', value: 10 },
            { id: 2, text: 'Good food storage (1+ week) with some winter emergency supplies', value: 7 },
            { id: 3, text: 'Basic food storage but limited winter-specific preparations', value: 4 },
            { id: 4, text: 'Minimal food storage and no winter isolation planning', value: 0 },
          ],
        },
        {
          id: 5,
          text: 'How well-winterized is your home and property for cold weather emergencies?',
          options: [
            { id: 1, text: 'Fully winterized with insulated pipes, sealed air leaks, and emergency heating plan', value: 10 },
            { id: 2, text: 'Most winterization completed with some emergency heating preparations', value: 7 },
            { id: 3, text: 'Basic winterization but limited emergency cold weather planning', value: 4 },
            { id: 4, text: 'Minimal winterization and no cold weather emergency preparations', value: 0 },
          ],
        },
      ],
      rainy: [
        {
          id: 3,
          text: 'How prepared are you for flooding and water damage in your area?',
          options: [
            { id: 1, text: 'Comprehensive flood plan with barriers, waterproof storage, and evacuation routes', value: 10 },
            { id: 2, text: 'Some flood preparations including elevated storage and basic barriers', value: 7 },
            { id: 3, text: 'Basic flood awareness with minimal specific preparations', value: 4 },
            { id: 4, text: 'No specific flood preparedness measures in place', value: 0 },
          ],
        },
        {
          id: 4,
          text: 'How effective is your property drainage and water management system?',
          options: [
            { id: 1, text: 'Excellent drainage with maintained gutters, proper grading, and water diversion systems', value: 10 },
            { id: 2, text: 'Good drainage with regular gutter maintenance and adequate grading', value: 7 },
            { id: 3, text: 'Basic drainage but some areas prone to water accumulation', value: 4 },
            { id: 4, text: 'Poor drainage with frequent water accumulation issues', value: 0 },
          ],
        },
        {
          id: 5,
          text: 'How well-protected are your important documents and electronics from water damage?',
          options: [
            { id: 1, text: 'All important items in waterproof containers with digital backups stored securely', value: 10 },
            { id: 2, text: 'Most important items protected with some digital backups available', value: 7 },
            { id: 3, text: 'Some protection measures but not comprehensive coverage', value: 4 },
            { id: 4, text: 'No specific water damage protection for important items', value: 0 },
          ],
        },
      ],
      spring: [
        {
          id: 3,
          text: 'How prepared are you for severe thunderstorms and tornado risks?',
          options: [
            { id: 1, text: 'Designated safe room, weather radio, and comprehensive severe weather plan', value: 10 },
            { id: 2, text: 'Identified safe areas and basic severe weather preparations', value: 7 },
            { id: 3, text: 'Basic storm awareness but limited specific safety preparations', value: 4 },
            { id: 4, text: 'No specific severe weather or tornado preparedness measures', value: 0 },
          ],
        },
        {
          id: 4,
          text: 'How well-protected is your property from hail and wind damage?',
          options: [
            { id: 1, text: 'Comprehensive protection with covered parking, secured outdoor items, and impact-resistant features', value: 10 },
            { id: 2, text: 'Good protection measures with most outdoor items secured', value: 7 },
            { id: 3, text: 'Basic protection but some vulnerable areas remain', value: 4 },
            { id: 4, text: 'No specific hail or wind damage protection measures', value: 0 },
          ],
        },
        {
          id: 5,
          text: 'How prepared are you for spring flooding from rapid snowmelt or heavy rains?',
          options: [
            { id: 1, text: 'Comprehensive flood insurance, emergency supplies, and detailed evacuation plan', value: 10 },
            { id: 2, text: 'Some flood preparations including insurance and basic emergency supplies', value: 7 },
            { id: 3, text: 'Basic flood awareness with minimal specific preparations', value: 4 },
            { id: 4, text: 'No specific spring flood preparedness measures', value: 0 },
          ],
        },
      ],
      autumn: [
        {
          id: 3,
          text: 'How prepared are you for hurricane/typhoon season and severe storms?',
          options: [
            { id: 1, text: 'Comprehensive storm plan with shutters, secured property, and evacuation preparations', value: 10 },
            { id: 2, text: 'Good storm preparations with most property secured and basic evacuation plan', value: 7 },
            { id: 3, text: 'Basic storm awareness with some preparation measures taken', value: 4 },
            { id: 4, text: 'No specific hurricane or severe storm preparedness measures', value: 0 },
          ],
        },
        {
          id: 4,
          text: 'How reliable is your backup power system for extended outages?',
          options: [
            { id: 1, text: 'Multiple backup power sources including generator with proper installation and fuel storage', value: 10 },
            { id: 2, text: 'Reliable backup power system with generator or substantial battery backup', value: 7 },
            { id: 3, text: 'Basic backup power with portable batteries and small devices', value: 4 },
            { id: 4, text: 'No backup power system for extended outages', value: 0 },
          ],
        },
        {
          id: 5,
          text: 'How well-maintained is your property for storm season (trees, gutters, roof)?',
          options: [
            { id: 1, text: 'Comprehensive maintenance with trimmed trees, clean gutters, and storm-ready property', value: 10 },
            { id: 2, text: 'Good maintenance with most storm preparations completed', value: 7 },
            { id: 3, text: 'Basic maintenance but some storm vulnerabilities remain', value: 4 },
            { id: 4, text: 'Minimal property maintenance for storm season', value: 0 },
          ],
        },
      ],
      dry: [
        {
          id: 3,
          text: 'How prepared are you for extended drought conditions and water scarcity?',
          options: [
            { id: 1, text: 'Comprehensive water conservation system with storage, recycling, and drought-resistant landscaping', value: 10 },
            { id: 2, text: 'Good water conservation practices with some storage and efficient landscaping', value: 7 },
            { id: 3, text: 'Basic water conservation awareness with minimal specific preparations', value: 4 },
            { id: 4, text: 'No specific drought or water scarcity preparations', value: 0 },
          ],
        },
        {
          id: 4,
          text: 'How prepared are you for dust storms and poor air quality conditions?',
          options: [
            { id: 1, text: 'Comprehensive air filtration system, sealed home, and dust storm emergency supplies', value: 10 },
            { id: 2, text: 'Good air filtration with some dust storm preparation measures', value: 7 },
            { id: 3, text: 'Basic air quality awareness with minimal specific preparations', value: 4 },
            { id: 4, text: 'No specific dust storm or air quality preparedness measures', value: 0 },
          ],
        },
        {
          id: 5,
          text: 'How prepared are you for extreme heat and increased fire risk during dry conditions?',
          options: [
            { id: 1, text: 'Comprehensive heat and fire plan with cooling systems, defensible space, and evacuation preparations', value: 10 },
            { id: 2, text: 'Good heat and fire preparations with cooling options and some fire prevention measures', value: 7 },
            { id: 3, text: 'Basic heat and fire awareness with minimal specific preparations', value: 4 },
            { id: 4, text: 'No specific extreme heat or fire risk preparations', value: 0 },
          ],
        },
      ],
    }

    return [...baseQuestions, ...(seasonalQuestions[season] || [])]
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
      dry: '🏜️'
    }
    return seasonEmojis[season] || '🌍'
  }

  if (quizComplete) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium text-text-primary">
            Calculating your seasonal readiness score...
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
            {getSeasonEmoji(season)} Seasonal Readiness Assessment
          </h2>
          <p className="text-sm text-text-secondary">
            {location} • {season.charAt(0).toUpperCase() + season.slice(1)} Season
          </p>
        </div>
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

export default SeasonalReadinessQuiz