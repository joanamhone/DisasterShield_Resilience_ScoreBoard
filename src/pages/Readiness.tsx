import React, { useState } from 'react'
import { Check, X, AlertCircle, ChevronRight, Users, School } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useReadiness } from '../contexts/ReadinessContext'
import { format } from 'date-fns'
import LocationSeasonForm from '../components/readiness/LocationSeasonForm'
import ReadinessQuiz from '../components/readiness/ReadinessQuiz'
import SeasonalReadinessQuiz from '../components/readiness/SeasonalReadinessQuiz'
import SchoolReadinessQuiz from '../components/readiness/SchoolReadinessQuiz'
import CommunityReadinessQuiz from '../components/readiness/CommunityReadinessQuiz' // ✅ NEW IMPORT
import ScoreOverview from '../components/readiness/ScoreOverview'
import SeasonalRecommendations from '../components/readiness/SeasonalRecommendations'

const Readiness: React.FC = () => {
  const { user } = useAuth()
  const { currentScore, assessmentHistory, updateScore } = useReadiness()
  const [currentStep, setCurrentStep] = useState<'choice' | 'form' | 'quiz' | 'seasonal-quiz' | 'results'>('choice')
  const [location, setLocation] = useState('')
  const [season, setSeason] = useState('')
  const [newItem, setNewItem] = useState('')
  const [isSeasonalAssessment, setIsSeasonalAssessment] = useState(false)
  const [currentAnswers, setCurrentAnswers] = useState<number[]>([])
  const [quizType, setQuizType] = useState<'general' | 'seasonal' | 'school' | 'community'>('general')

  const [checklist, setChecklist] = useState([
    { id: 1, name: 'Emergency kit prepared', completed: true },
    { id: 2, name: 'Evacuation plan created', completed: true },
    { id: 3, name: 'Important documents secured', completed: false },
    { id: 4, name: 'First aid training completed', completed: false },
    { id: 5, name: 'Emergency contacts updated', completed: true },
  ])

  const handleAssessmentChoice = (seasonal: boolean, type: 'general' | 'school' | 'community' = 'general') => {
    setQuizType(type)
    setIsSeasonalAssessment(seasonal)
    if (seasonal) {
      setCurrentStep('form')
    } else {
      setCurrentStep('quiz')
    }
  }

  const handleLocationSeasonSubmit = (userLocation: string, userSeason: string) => {
    setLocation(userLocation)
    setSeason(userSeason)
    setCurrentStep('seasonal-quiz')
  }

  const handleQuizComplete = (score: number) => {
    updateScore(
      score,
      isSeasonalAssessment ? 'seasonal' : 'general',
      isSeasonalAssessment ? location : undefined,
      isSeasonalAssessment ? season : undefined,
      currentAnswers
    )
    setCurrentStep('results')
  }

  const handleQuizCancel = () => {
    if (isSeasonalAssessment) {
      setCurrentStep('form')
    } else {
      setCurrentStep('choice')
    }
  }

  const toggleChecklistItem = (id: number) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const addChecklistItem = () => {
    if (newItem.trim()) {
      const newId = Math.max(...checklist.map(item => item.id)) + 1
      setChecklist(prev => [...prev, { id: newId, name: newItem.trim(), completed: false }])
      setNewItem('')
    }
  }

  const startNewAssessment = () => {
    setCurrentStep('choice')
    setLocation('')
    setSeason('')
    setIsSeasonalAssessment(false)
    setQuizType('general')
  }

  // === VIEW LOGIC ===

  if (currentStep === 'choice') {
    return (
      <div className="space-y-6 pb-6">
        <div className="card p-6">
          <h3 className="text-xl font-bold text-text-primary mb-4">
            Disaster Readiness and Preparedness Assessment
          </h3>
          <p className="text-text-secondary mb-6">
            Are You Ready for a Disaster?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <button
                onClick={() => handleAssessmentChoice(false, 'general')}
                className="card p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/20 text-left w-full"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <AlertCircle className="text-primary" size={24} />
                  </div>
                  <h4 className="font-bold text-text-primary">Individual/Household Assessment</h4>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  For Individuals & Families. Evaluate how prepared you and your household are for storms, floods, and other emergencies across key readiness areas.
                </p>
                <div className="mt-4 flex items-center text-primary">
                  <span className="text-sm font-medium">Start Assessment</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </button>
            </div>

            {(user?.userType === 'community_leader' || user?.userType === 'school_admin') && (
              <button
                onClick={() =>
                  handleAssessmentChoice(false, user.userType === 'school_admin' ? 'school' : 'community')
                }
                className="card p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-accent/20 text-left md:col-span-2"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-4">
                    {user.userType === 'community_leader' ? (
                      <Users className="text-accent" size={24} />
                    ) : (
                      <School className="text-accent" size={24} />
                    )}
                  </div>
                  <h4 className="font-bold text-text-primary">
                    {user.userType === 'community_leader'
                      ? 'Community Readiness Check'
                      : 'School Readiness Check'}
                  </h4>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {user.userType === 'community_leader'
                    ? "Assess your community's overall disaster preparedness and identify areas for improvement."
                    : "Evaluate your school's emergency preparedness across all safety protocols and procedures."}
                </p>
                <div className="mt-4 flex items-center text-accent">
                  <span className="text-sm font-medium">
                    Start {user.userType === 'community_leader' ? 'Community' : 'School'} Assessment
                  </span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </button>
            )}
          </div>
        </div>

        {assessmentHistory.length > 0 && (
          <div className="card p-4">
            <h3 className="font-bold text-text-primary mb-2">Assessment History</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {assessmentHistory.slice(0, 5).map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-3 bg-surface rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assessment.type === 'seasonal'
                            ? 'bg-secondary/20 text-secondary'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        {assessment.type === 'seasonal' ? 'Seasonal' : 'General'}
                      </span>
                      <span
                        className="font-bold text-lg"
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
                    </div>
                    <div className="text-sm text-text-secondary">
                      {assessment.location && assessment.season ? (
                        <>
                          {assessment.location} •{' '}
                          {assessment.season.charAt(0).toUpperCase() + assessment.season.slice(1)}
                        </>
                      ) : (
                        'General Assessment'
                      )}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {format(assessment.date, 'MMM dd, yyyy • HH:mm')}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-text-tertiary" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (currentStep === 'form') {
    return (
      <div className="space-y-6 pb-6">
        <LocationSeasonForm onSubmit={handleLocationSeasonSubmit} />
      </div>
    )
  }

  if (currentStep === 'quiz') {
    if (quizType === 'school') {
      return (
        <SchoolReadinessQuiz
          onComplete={(score, answers) => {
            setCurrentAnswers(answers)
            handleQuizComplete(score)
          }}
          onCancel={handleQuizCancel}
        />
      )
    } else if (quizType === 'community') {
      return (
        <CommunityReadinessQuiz
          onComplete={(score, answers) => {
            setCurrentAnswers(answers)
            handleQuizComplete(score)
          }}
          onCancel={handleQuizCancel}
        />
      )
    } else {
      return (
        <ReadinessQuiz
          onComplete={(score, answers) => {
            setCurrentAnswers(answers)
            handleQuizComplete(score)
          }}
          onCancel={handleQuizCancel}
        />
      )
    }
  }

  if (currentStep === 'seasonal-quiz') {
    return (
      <SeasonalReadinessQuiz
        location={location}
        season={season}
        onComplete={(score, answers) => {
          setCurrentAnswers(answers)
          handleQuizComplete(score)
        }}
        onCancel={handleQuizCancel}
      />
    )
  }

  return (
    <div className="space-y-6 pb-6">
      <ScoreOverview score={currentScore} />

      <div className="card p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-text-primary">Assessment Details</h3>
          <p className="text-text-secondary">
            {isSeasonalAssessment && location && season ? (
              <>
                {location} • {season.charAt(0).toUpperCase() + season.slice(1)} Season
              </>
            ) : (
              'General Readiness Assessment'
            )}
          </p>
        </div>
        <button onClick={startNewAssessment} className="btn-primary">
          New Assessment
        </button>
      </div>

      {isSeasonalAssessment && location && season && (
        <SeasonalRecommendations
          season={season}
          location={location}
          score={currentScore}
        />
      )}

      <div>
        <h3 className="text-lg font-bold text-text-primary mb-3">
          General Preparedness Checklist
        </h3>
        <div className="card p-4 space-y-3">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-center py-3 border-b border-divider last:border-b-0">
              <button
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center transition-colors duration-200 ${
                  item.completed
                    ? 'bg-success border-success'
                    : 'border-text-tertiary hover:border-text-secondary'
                }`}
              >
                {item.completed ? (
                  <Check size={16} className="text-white" />
                ) : (
                  <X size={16} className="text-text-tertiary" />
                )}
              </button>
              <span className={`text-text-primary ${item.completed ? 'line-through text-text-secondary' : ''}`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-text-primary mb-3">Add to Checklist</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter a new preparedness item"
            className="flex-1 card px-3 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
          />
          <button onClick={addChecklistItem} className="btn-primary px-6">
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default Readiness
