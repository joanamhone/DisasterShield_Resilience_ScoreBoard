// src/contexts/ReadinessContext.ts
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Make sure you have a central supabase client
import { useAuth } from './AuthContext'; // <-- ADDED THIS LINE

// --- Interfaces (Centralized and updated for detailed answers) ---
export interface AssessmentAnswer {
  question: string; // The text of the question
  userAnswer: string | number | string[]; // The user's selected answer(s)
  correctAnswer?: string | number | string[]; // The correct answer(s) (optional, if not all quizzes have it)
  isCorrect?: boolean; // Whether the user's answer was correct (optional)
  explanation?: string; // Optional explanation for the correct answer
  pointsAwarded?: number; // Points awarded for this specific question
  maxPoints?: number; // Optional: Maximum possible points for this question
  // Add original question ID and selected option text if needed for detailed history
  questionId: number; // The ID of the question
  selectedOptionText: string; // The text of the option the user selected
}

// Updated ReadinessResponse to include detailed answers and other quiz types
export interface ReadinessResponse {
  id: string;
  user_id: string; // Assuming user_id is always present
  score: number;
  type: 'general' | 'seasonal' | 'school' | 'community'; // Add type field
  location?: string; // Optional for seasonal/community/school
  season?: string; // Optional for seasonal
  answers: AssessmentAnswer[]; // Crucially, this is now AssessmentAnswer[]
  created_at: string;
}

interface ReadinessContextType {
  latestScore: number;
  latestResponse: ReadinessResponse | null;
  assessmentHistory: ReadinessResponse[]; // History now stores ReadinessResponse
  isLoading: boolean;
  // Renamed saveResponse to updateScore to match Readiness.tsx expectation
  // And updated parameters to include type, location, season, and detailed answers
  updateScore: (
    score: number,
    type: 'general' | 'seasonal' | 'school' | 'community',
    location?: string,
    season?: string,
    answers?: AssessmentAnswer[] // Expecting detailed answers here
  ) => Promise<void>;
}

const ReadinessContext = createContext<ReadinessContextType | undefined>(undefined);

export const ReadinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // This line was causing the error
  const [assessmentHistory, setAssessmentHistory] = useState<ReadinessResponse[]>([]);
  const [latestResponse, setLatestResponse] = useState<ReadinessResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch responses from Supabase
  const fetchResponses = useCallback(async () => {
    if (!user) {
      setAssessmentHistory([]);
      setLatestResponse(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('readiness_responses')
        .select('*') // Select all columns, including answers (JSONB)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10); // Limit to latest 10 for history

      if (error) throw error;

      if (data) {
        setAssessmentHistory(data as ReadinessResponse[]); // Cast data to our interface
        setLatestResponse(data[0] || null);
      }
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
    location?: string,
    season?: string,
    answers: AssessmentAnswer[] = [] // Expecting detailed answers here
  ) => {
    if (!user || typeof score !== 'number' || isNaN(score)) {
      console.error("Save aborted: Invalid user or score provided.", { user, score });
      return;
    }

    try {
      const { error } = await supabase
        .from('readiness_responses')
        .insert({
          user_id: user.id,
          score,
          type,
          location: location || null,
          season: season || null,
          answers,
        });

      if (error) {
        throw error;
      }

      console.log('Assessment saved to database successfully!');
      await fetchResponses(); // Refresh data after saving
    } catch (error) {
      console.error('Error saving readiness response:', error);
      throw error;
    }
  };

  const latestScore = latestResponse?.score ?? 0;

  return (
    <ReadinessContext.Provider value={{ latestScore, latestResponse, assessmentHistory, isLoading, updateScore }}>
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