import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface AssessmentHistory {
  id: string
  type: 'general' | 'seasonal'
  score: number
  date: Date
  location?: string
  season?: string
  answers: number[]
}

interface ReadinessContextType {
  currentScore: number
  assessmentHistory: AssessmentHistory[]
  updateScore: (score: number, type: 'general' | 'seasonal', location?: string, season?: string, answers?: number[]) => void
  getLatestAssessment: () => AssessmentHistory | null
}

const ReadinessContext = createContext<ReadinessContextType | undefined>(undefined)

export const ReadinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [currentScore, setCurrentScore] = useState(65) // Default score
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([])

  // Load data from Supabase when user is available
  useEffect(() => {
    if (user) {
      loadAssessments()
    } else {
      // Reset state when user logs out
      setCurrentScore(65)
      setAssessmentHistory([])
    }
  }, [user])

  const loadAssessments = async () => {
    if (!user) return

    try {
      const { data: assessments, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      if (assessments && assessments.length > 0) {
        const history: AssessmentHistory[] = assessments.map(assessment => ({
          id: assessment.id,
          type: assessment.type,
          score: assessment.score,
          date: new Date(assessment.created_at),
          location: assessment.location,
          season: assessment.season,
          answers: assessment.answers
        }))
        
        setAssessmentHistory(history)
        setCurrentScore(history[0].score) // Most recent score
      }
    } catch (error) {
      console.error('Error loading assessments:', error)
    }
  }

  const updateScore = (
    score: number, 
    type: 'general' | 'seasonal', 
    location?: string, 
    season?: string,
    answers: number[] = []
  ) => {
    if (!user) return

    setCurrentScore(score)
    
    const newAssessment: AssessmentHistory = {
      id: crypto.randomUUID(),
      type,
      score,
      date: new Date(),
      location,
      season,
      answers
    }
    
    const updatedHistory = [newAssessment, ...assessmentHistory].slice(0, 10) // Keep last 10 assessments
    setAssessmentHistory(updatedHistory)
    
    // Save to Supabase
    saveAssessment(newAssessment)
  }

  const saveAssessment = async (assessment: AssessmentHistory) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('assessments')
        .insert({
          user_id: user.id,
          type: assessment.type,
          score: assessment.score,
          answers: assessment.answers,
          location: assessment.location,
          season: assessment.season
        })

      if (error) throw error
    } catch (error) {
      console.error('Error saving assessment:', error)
    }
  }

  const getLatestAssessment = () => {
    return assessmentHistory.length > 0 ? assessmentHistory[0] : null
  }

  return (
    <ReadinessContext.Provider value={{
      currentScore,
      assessmentHistory,
      updateScore,
      getLatestAssessment
    }}>
      {children}
    </ReadinessContext.Provider>
  )
}

export const useReadiness = () => {
  const context = useContext(ReadinessContext)
  if (context === undefined) {
    throw new Error('useReadiness must be used within a ReadinessProvider')
  }
  return context
}