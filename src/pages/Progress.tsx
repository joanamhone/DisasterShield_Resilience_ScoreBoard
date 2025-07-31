import React, { useState, useMemo } from 'react';
import { Award, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, subMonths, subYears, differenceInMonths } from 'date-fns';
import { useReadiness } from '../contexts/ReadinessContext';
import { useEmergencyKit } from '../contexts/EmergencyKitContext';
import { useAuth } from '../contexts/AuthContext';

// This list should be kept in sync with the one in EmergencyKitBuilder
const defaultKitItems = [
    { name: 'Bottled Water (Liters)', category: 'Food & Water', type: 'perPerson', amount: 4 },
    { name: 'Non-perishable Food (Days)', category: 'Food & Water', type: 'perPerson', amount: 3 },
    { name: 'First-Aid Kit', category: 'First Aid', type: 'perHousehold', amount: 1 },
    { name: 'Flashlight', category: 'Tools', type: 'perPerson', amount: 1 },
    { name: 'Batteries (sets)', category: 'Tools', type: 'perHousehold', amount: 2 },
    { name: 'Important Documents (copies)', category: 'Documents', type: 'perHousehold', amount: 1 },
    { name: 'Whistle (to signal for help)', category: 'Tools', type: 'perPerson', amount: 1 },
    { name: 'Dust Mask', category: 'First Aid', type: 'perPerson', amount: 1 },
    { name: 'Specialized Medication', category: 'Personal', type: 'conditional', condition: 'hasVulnerableMembers' },
    { name: 'Pet Food (Days)', category: 'Pets', type: 'conditional', condition: 'hasPets', amount: 3 },
    { name: 'Pet Water (Liters)', category: 'Pets', type: 'conditional', condition: 'hasPets', amount: 4 },
];


const Progress: React.FC = () => {
  const { user } = useAuth();
  const { assessmentHistory, isLoading: isReadinessLoading } = useReadiness();
  const { kitItems, isLoading: isKitLoading } = useEmergencyKit();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const chartData = useMemo(() => {
    if (!assessmentHistory || assessmentHistory.length === 0) return [];
    const now = new Date();
    let startDate;
    let dateFormat;

    switch (timeRange) {
        case 'week':
            startDate = subDays(now, 7);
            dateFormat = 'EEE';
            break;
        case 'year':
            startDate = subYears(now, 1);
            dateFormat = 'MMM yyyy';
            break;
        case 'month':
        default:
            startDate = subMonths(now, 1);
            dateFormat = 'MMM dd';
            break;
    }
    
    const filtered = assessmentHistory.filter(item => new Date(item.created_at) >= startDate);
    const sorted = [...filtered].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return sorted.map(item => ({ date: format(new Date(item.created_at), dateFormat), score: item.score }));
  }, [assessmentHistory, timeRange]);

  const currentScore = assessmentHistory[0]?.score || 0;
  const previousScore = assessmentHistory[1]?.score || currentScore;
  const scoreChange = currentScore - previousScore;

  // Dynamic achievements based on brainstorming ideas
  const achievements = useMemo(() => {
      const householdSize = user?.householdSize || 1;
      const hasVulnerable = !!user?.vulnerableMembersDescription;
      const hasPets = (user?.numberOfPets || 0) > 0;
      const userItemMap = new Map(kitItems.map(item => [item.item_name, item.quantity]));

      const recommendedItems = defaultKitItems.filter(item => {
          if (item.condition === 'hasVulnerableMembers' && !hasVulnerable) return false;
          if (item.condition === 'hasPets' && !hasPets) return false;
          return true;
      });

      const hasBuiltKit = recommendedItems.every(item => (userItemMap.get(item.name) || 0) > 0);
      const isFullyStocked = recommendedItems.every(item => {
          let recommendation = 0;
          if (item.type === 'perPerson') recommendation = Math.ceil(item.amount * householdSize);
          if (item.type === 'perHousehold') recommendation = item.amount;
          if (item.condition === 'hasPets') recommendation = Math.ceil((user?.numberOfPets || 1) * (item.amount || 1));
          return (userItemMap.get(item.name) || 0) >= recommendation;
      });

      const isUpToDate = assessmentHistory.length > 0 && differenceInMonths(new Date(), new Date(assessmentHistory[0].created_at)) < 6;

      return [
        { id: 1, title: 'First Assessment', earned: assessmentHistory.length > 0, description: 'Completed your first readiness assessment' },
        { id: 2, title: 'Emergency Kit Builder', earned: hasBuiltKit, description: 'Added at least one of every recommended item to your kit' },
        { id: 3, title: 'Fully Stocked', earned: isFullyStocked, description: 'Met or exceeded all recommended item quantities' },
        { id: 4, title: 'Consistent Improver', earned: scoreChange > 0 && assessmentHistory.length > 1, description: 'Improved your score from the previous assessment' },
        { id: 5, title: 'Well Prepared', earned: currentScore >= 80, description: 'Achieved a readiness score of 80% or higher' },
        { id: 6, title: 'Up-to-Date', earned: isUpToDate, description: 'Completed an assessment in the last 6 months' }
      ];
  }, [assessmentHistory, kitItems, scoreChange, currentScore, user]);


  if (isReadinessLoading || isKitLoading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={48} />
          </div>
      );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-text-primary">Current Score</h3>
          <div className="text-3xl font-bold text-primary">{Math.round(currentScore)}%</div>
          <div className={`text-sm ${scoreChange >= 0 ? 'text-success' : 'text-error'}`}>
            {scoreChange >= 0 ? '+' : ''}{Math.round(scoreChange)}% from last
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-text-primary">Assessments Taken</h3>
          <div className="text-3xl font-bold text-accent">{assessmentHistory.length}</div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-text-primary">Achievements</h3>
          <div className="text-3xl font-bold text-warning">{achievements.filter(a => a.earned).length} / {achievements.length}</div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center">
        <div className="flex bg-surface rounded-lg p-1">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-md font-medium transition-colors ${timeRange === range ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}>
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Readiness Score Progress</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#718096" fontSize={12} />
              <YAxis stroke="#718096" fontSize={12} domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2E7D32" strokeWidth={3} name="Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Achievements Section */}
      <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned 
                  ? 'border-success bg-success/10' 
                  : 'border-border bg-surface'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {/* Placeholder for icons */}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${achievement.earned ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-text-secondary mb-1">
                    {achievement.description}
                  </p>
                </div>
                {achievement.earned && (
                  <div className="text-success">
                    <Award size={20} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
