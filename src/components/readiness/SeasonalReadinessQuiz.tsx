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
    // Mandatory 4 questions (same for all seasons)
    const baseQuestions: Question[] = [
      {
        id: 1,
        text: 'Has your household ever experienced seasonal shocks (flood, drought, cold) and how significant was the damage?',
        options: [
          { id: 1, text: 'Yes, major damage (homes, crops, health)', value: 10 },
          { id: 2, text: 'Yes, moderate damage', value: 7 },
          { id: 3, text: 'Minor damage only', value: 4 },
          { id: 4, text: 'No, not affected', value: 0 },
        ],
      },
      {
        id: 2,
        text: 'Do you receive seasonal warnings (radio, SMS, or community alerts) before high-risk weather?',
        options: [
          { id: 1, text: 'Regular warnings through multiple channels', value: 10 },
          { id: 2, text: 'Occasional warnings, sometimes too late', value: 7 },
          { id: 3, text: 'Rare warnings, not always reliable', value: 4 },
          { id: 4, text: 'Never receive warnings', value: 0 },
        ],
      },
      {
        id: 3,
        text: 'Have you taken physical steps to protect your home (reinforce walls/roof, clear gutters, insulate) for seasonal risks?',
        options: [
          { id: 1, text: 'Yes – well-prepared for all seasons', value: 10 },
          { id: 2, text: 'Some reinforcement done', value: 7 },
          { id: 3, text: 'Minimal reinforcement', value: 4 },
          { id: 4, text: 'None at all', value: 0 },
        ],
      },
      {
        id: 4,
        text: 'Does your household have a plan for evacuation or relocation during seasonal emergencies?',
        options: [
          { id: 1, text: 'Yes, with clear route and meeting place', value: 10 },
          { id: 2, text: 'Yes, but route/meeting place is informal', value: 7 },
          { id: 3, text: 'Informal plan only', value: 4 },
          { id: 4, text: 'No plan at all', value: 0 },
        ],
      },
    ]

    // Season-specific sets with added questions 8, 9, 10
    const seasonalQuestions: Record<string, Question[]> = {
      rainy: [
        {
          id: 5,
          text: 'Have you stocked emergency supplies (food, water, documents) before the rainy season?',
          options: [
            { id: 1, text: 'Yes – full kit ready before season', value: 10 },
            { id: 2, text: 'Mostly stocked but missing items', value: 7 },
            { id: 3, text: 'Bare minimum supplies', value: 4 },
            { id: 4, text: 'No supplies stored', value: 0 },
          ],
        },
        {
          id: 6,
          text: 'Do you know where to evacuate (safe ground, community center) in case of floods?',
          options: [
            { id: 1, text: 'Yes – clear location known by all household members', value: 10 },
            { id: 2, text: 'Yes – but some family members are unsure', value: 7 },
            { id: 3, text: 'General idea, no formal planning', value: 4 },
            { id: 4, text: 'No evacuation knowledge', value: 0 },
          ],
        },
        {
          id: 7,
          text: 'Is your home well protected through barriers, drainage, or waterproof storage?',
          options: [
            { id: 1, text: 'Yes – effective physical measures in place', value: 10 },
            { id: 2, text: 'Some measures taken', value: 7 },
            { id: 3, text: 'Minimal protection', value: 4 },
            { id: 4, text: 'None', value: 0 },
          ],
        },
        // New rainy season questions 8,9,10
        {
          id: 8,
          text: 'Do you know if your home is located in a flood-prone area?',
          options: [
            { id: 1, text: 'Yes', value: 10 },
            { id: 2, text: 'No', value: 0 },
            { id: 3, text: 'Not sure', value: 4 },
            { id: 4, text: 'I’ve heard rumors, but nothing official', value: 2 },
            { id: 5, text: 'I’ve experienced floods but didn’t get official information', value: 3 },
          ],
        },
        {
          id: 9,
          text: 'Have you made any changes to your home to protect it from heavy rain or flooding?',
          options: [
            { id: 1, text: 'Elevated home/foundation', value: 10 },
            { id: 2, text: 'Improved drainage', value: 7 },
            { id: 3, text: 'None', value: 0 },
            { id: 4, text: "I want to but can't afford it", value: 3 },
            { id: 5, text: 'I don’t think it’s necessary', value: 1 },
          ],
        },
        {
          id: 10,
          text: 'Do you have an evacuation plan in case of flooding?',
          options: [
            { id: 1, text: 'Yes, and we’ve practiced it', value: 10 },
            { id: 2, text: 'Yes, but never practiced', value: 7 },
            { id: 3, text: 'No', value: 0 },
            { id: 4, text: 'I rely on community response', value: 4 },
            { id: 5, text: 'I don’t think we’ll need it', value: 2 },
          ],
        },
      ],
      summer: [
        {
          id: 5,
          text: 'Have you secured reliable water sources or storage for the hot dry season?',
          options: [
            { id: 1, text: 'Yes – multiple storage options and conservation plan', value: 10 },
            { id: 2, text: 'Yes – adequate storage but no plan', value: 7 },
            { id: 3, text: 'Minimal storage', value: 4 },
            { id: 4, text: 'No storage at all', value: 0 },
          ],
        },
        {
          id: 6,
          text: 'Have you lost crops due to dry spells or drought in past seasons?',
          options: [
            { id: 1, text: 'Yes – major crop loss', value: 10 },
            { id: 2, text: 'Moderate loss', value: 7 },
            { id: 3, text: 'Minor loss', value: 4 },
            { id: 4, text: 'No loss', value: 0 },
          ],
        },
        {
          id: 7,
          text: 'Do you have shading, fans, or other methods to manage heat for household members?',
          options: [
            { id: 1, text: 'Yes – good heat mitigation in place', value: 10 },
            { id: 2, text: 'Some shade or cooling available', value: 7 },
            { id: 3, text: 'Minimal heat relief', value: 4 },
            { id: 4, text: 'None', value: 0 },
          ],
        },
        // New summer questions 8,9,10
        {
          id: 8,
          text: 'How do you protect your family from extreme heat during heatwaves?',
          options: [
            { id: 1, text: 'Stay indoors', value: 10 },
            { id: 2, text: 'Drink lots of water', value: 7 },
            { id: 3, text: 'Use fans/shade', value: 7 },
            { id: 4, text: 'Nothing specific', value: 0 },
            { id: 5, text: 'Didn’t know it was a risk', value: 1 },
          ],
        },
        {
          id: 9,
          text: 'Have you experienced water shortages in this season?',
          options: [
            { id: 1, text: 'Frequently', value: 10 },
            { id: 2, text: 'Occasionally', value: 7 },
            { id: 3, text: 'Rarely', value: 4 },
            { id: 4, text: 'Never', value: 0 },
            { id: 5, text: 'We rely on stored water', value: 6 },
          ],
        },
        {
          id: 10,
          text: 'Do you keep an emergency supply of water and food during this season?',
          options: [
            { id: 1, text: 'Yes, at least 3 days’ worth', value: 10 },
            { id: 2, text: 'Some food but not water', value: 5 },
            { id: 3, text: 'No', value: 0 },
            { id: 4, text: 'I rely on nearby shops/markets', value: 3 },
            { id: 5, text: 'I can\'t afford to store', value: 1 },
          ],
        },
      ],
      winter: [
        {
          id: 5,
          text: 'Does everyone in your household have warm clothing or blankets for the cold season?',
          options: [
            { id: 1, text: 'Yes – adequate for all members', value: 10 },
            { id: 2, text: 'Mostly covered, a few missing items', value: 7 },
            { id: 3, text: 'Minimal warm clothing', value: 4 },
            { id: 4, text: 'None', value: 0 },
          ],
        },
        {
          id: 6,
          text: 'Do you experience frequent colds or respiratory issues during these months?',
          options: [
            { id: 1, text: 'Yes – several household members affected', value: 10 },
            { id: 2, text: 'A few get sick', value: 7 },
            { id: 3, text: 'Rarely get sick', value: 4 },
            { id: 4, text: 'Never', value: 0 },
          ],
        },
        {
          id: 7,
          text: 'What heating or warmth methods do you use at night (e.g. firewood, charcoal)? Are they safe?',
          options: [
            { id: 1, text: 'Safe, reliable heating for all', value: 10 },
            { id: 2, text: 'Heating used but some concerns', value: 7 },
            { id: 3, text: 'Minimal heating or safety concerns', value: 4 },
            { id: 4, text: 'No heating', value: 0 },
          ],
        },
        // New winter questions 8,9,10
        {
          id: 8,
          text: 'How do you keep your home warm and safe during cold nights?',
          options: [
            { id: 1, text: 'Blankets & clothing', value: 10 },
            { id: 2, text: 'Charcoal fire', value: 7 },
            { id: 3, text: 'No special action', value: 0 },
            { id: 4, text: 'I sleep outside due to housing issues', value: 2 },
            { id: 5, text: 'I didn’t think cold was a risk', value: 1 },
          ],
        },
        {
          id: 9,
          text: 'Do you or your family suffer from cold-related illnesses (e.g. pneumonia) during this season?',
          options: [
            { id: 1, text: 'Frequently', value: 10 },
            { id: 2, text: 'Occasionally', value: 7 },
            { id: 3, text: 'Rarely', value: 4 },
            { id: 4, text: 'Never', value: 0 },
            { id: 5, text: 'I’m not sure', value: 3 },
          ],
        },
        {
          id: 10,
          text: 'Do you keep your heating methods safe and well-ventilated?',
          options: [
            { id: 1, text: 'Yes, always safe and ventilated', value: 10 },
            { id: 2, text: 'Usually safe but sometimes concerns', value: 7 },
            { id: 3, text: 'Rarely safe or ventilated', value: 4 },
            { id: 4, text: 'No safety measures', value: 0 },
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