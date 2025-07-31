import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AssessmentAnswer } from '../../contexts/ReadinessContext';
import { Loader2, Lightbulb } from 'lucide-react';

interface Recommendation {
  recommendation_text: string;
  category: string;
}

interface RecommendationsComponentProps {
  answers: AssessmentAnswer[];
}

const RecommendationsComponent: React.FC<RecommendationsComponentProps> = ({ answers }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!answers || answers.length === 0) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      
      // Create a list of answer values that are not the best possible score (10)
      const answersNeedingImprovement = answers
        .filter(answer => answer.pointsAwarded < 10)
        .map(answer => ({
            question_id: answer.questionId,
            answer_value: answer.pointsAwarded
        }));

      if (answersNeedingImprovement.length === 0) {
          setIsLoading(false);
          return;
      }

      try {
        // Fetch all recommendations from the database
        const { data, error } = await supabase
          .from('recommendations')
          .select('question_id, triggering_answer_value, recommendation_text, category');

        if (error) throw error;

        // Filter the recommendations to find ones that match the user's specific answers
        const matchedRecommendations = data.filter(rec => 
            answersNeedingImprovement.some(ans => 
                rec.question_id === ans.question_id && rec.triggering_answer_value === ans.answer_value
            )
        );
        
        setRecommendations(matchedRecommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [answers]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
        <div className="text-center p-6 bg-surface rounded-lg">
            <h3 className="font-bold text-lg text-success">Great Job!</h3>
            <p className="text-text-secondary">No specific recommendations based on your answers. You are well-prepared!</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
        {recommendations.map((rec, index) => (
            <div key={index} className="p-4 border border-divider rounded-lg bg-surface/50">
                <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Lightbulb className="text-accent" size={16} />
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary">{rec.category}</p>
                        <p className="text-sm text-text-secondary">{rec.recommendation_text}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
  );
};

export default RecommendationsComponent;
