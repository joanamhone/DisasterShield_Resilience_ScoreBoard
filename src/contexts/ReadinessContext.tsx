import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Make sure you have a central supabase client
import { useAuth } from './AuthContext';

// --- Interfaces ---
export interface ReadinessResponse {
  id: string;
  score: number;
  answers: number[];
  created_at: string;
}

interface ReadinessContextType {
  latestScore: number;
  latestResponse: ReadinessResponse | null;
  assessmentHistory: ReadinessResponse[];
  isLoading: boolean; // Provide the loading state
  saveResponse: (score: number, answers: number[]) => Promise<void>;
}

const ReadinessContext = createContext<ReadinessContextType | undefined>(undefined);

export const ReadinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [assessmentHistory, setAssessmentHistory] = useState<ReadinessResponse[]>([]);
  const [latestResponse, setLatestResponse] = useState<ReadinessResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResponses = useCallback(async () => {
    if (!user) {
        setAssessmentHistory([]);
        setLatestResponse(null);
        setIsLoading(false);
        return;
    };

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('readiness_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        setAssessmentHistory(data);
        setLatestResponse(data[0] || null); // Set to null if no data
      }
    } catch (error) {
      console.error('Error loading readiness responses:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetch is complete
    }
  }, [user]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  const saveResponse = async (score: number, answers: number[]) => {
    // Safeguard to prevent saving invalid data
    if (!user || typeof score !== 'number' || isNaN(score)) {
        console.error("Save aborted: Invalid data provided.", { user, score });
        return;
    }
    
    const { error } = await supabase
      .from('readiness_responses')
      .insert({
        user_id: user.id,
        score,
        answers,
      });

    if (error) throw error;

    await fetchResponses(); // Refresh data after saving
  };
  
  const latestScore = latestResponse?.score ?? 0;

  return (
    <ReadinessContext.Provider value={{ latestScore, latestResponse, assessmentHistory, isLoading, saveResponse }}>
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
