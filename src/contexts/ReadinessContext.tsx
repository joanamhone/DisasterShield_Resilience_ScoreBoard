import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// --- Interfaces ---
// This structure holds the detailed breakdown of each answer.
export interface AssessmentAnswer {
  questionId: number;
  question: string;
  userAnswer: string;
  pointsAwarded: number;
  maxPoints: number;
  selectedOptionText: string;
}

// This matches your updated readiness_responses table.
export interface ReadinessResponse {
  id: string;
  user_id: string;
  score: number;
  type: 'general' | 'seasonal' | 'school' | 'community';
  location?: string;
  season?: string;
  answers: AssessmentAnswer[];
  created_at: string;
}

interface ReadinessContextType {
  latestScore: number;
  assessmentHistory: ReadinessResponse[];
  isLoading: boolean;
  // This function now accepts all the new details.
  updateScore: (
    score: number,
    type: 'general' | 'seasonal' | 'school' | 'community',
    answers: AssessmentAnswer[],
    location?: string,
    season?: string
  ) => Promise<void>;
}

const ReadinessContext = createContext<ReadinessContextType | undefined>(undefined);

export const ReadinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [assessmentHistory, setAssessmentHistory] = useState<ReadinessResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResponses = useCallback(async () => {
    if (!user) {
      setAssessmentHistory([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('readiness_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAssessmentHistory(data || []);
    } catch (error) {
      console.error('Error loading readiness responses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  const updateScore = async (
    score: number,
    type: 'general' | 'seasonal' | 'school' | 'community',
    answers: AssessmentAnswer[],
    location?: string,
    season?: string
  ) => {
    if (!user) throw new Error("User must be logged in.");

    const { error } = await supabase
      .from('readiness_responses')
      .insert({
        user_id: user.id,
        score,
        type,
        answers, // The detailed answers are saved here
        location,
        season,
      });

    if (error) throw error;
    await fetchResponses(); // Refresh the history after saving
  };
  
  const latestScore = assessmentHistory[0]?.score ?? 0;

  return (
    <ReadinessContext.Provider value={{ latestScore, assessmentHistory, isLoading, updateScore }}>
      {children}
    </ReadinessContext.Provider>
  );
};

export const useReadiness = () => {
  const context = useContext(ReadinessContext);
  if (context === undefined) {
    throw new Error('useReadiness must be used within a ReadinessProvider');
  }
  return context;
};
