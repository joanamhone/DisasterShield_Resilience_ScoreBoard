import React, { useState, useEffect } from 'react';
import { Users, Award, AlertTriangle, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface ProgressStats {
  courses_completed: number;
  certifications_earned: number;
  drills_led: number;
  assessments_conducted: number;
  workshops_held: number;
  alerts_sent: number;
  engagement_score: number;
}

interface CommunityStats {
  readiness_score: number;
  drills_completed: number;
  workshops_held: number;
  alerts_sent: number;
  members_trained: number;
}

const CommunityProgress: React.FC = () => {
  const { user } = useAuth();
  const [personalStats, setPersonalStats] = useState<ProgressStats | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;

    try {
      const { data: progressData } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (progressData) {
        setPersonalStats(progressData);
      }

      const { data: communities } = await supabase
        .from('community_groups')
        .select('id')
        .eq('leader_id', user.id);

      if (communities && communities.length > 0) {
        const { data: commStats } = await supabase
          .from('community_progress')
          .select('*')
          .eq('community_id', communities[0].id)
          .maybeSingle();

        if (commStats) {
          setCommunityStats(commStats);
        }
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const leadershipAchievements = [
    {
      id: 1,
      title: 'First Drill',
      earned: (personalStats?.drills_led || 0) > 0,
      description: 'Led your first emergency drill',
      icon: Calendar
    },
    {
      id: 2,
      title: 'Alert Sender',
      earned: (personalStats?.alerts_sent || 0) > 0,
      description: 'Sent your first community alert',
      icon: AlertTriangle
    },
    {
      id: 3,
      title: 'Workshop Leader',
      earned: (personalStats?.workshops_held || 0) >= 3,
      description: 'Conducted 3 or more workshops',
      icon: BookOpen
    },
    {
      id: 4,
      title: 'Certified Leader',
      earned: (personalStats?.certifications_earned || 0) > 0,
      description: 'Earned disaster preparedness certification',
      icon: Award
    },
    {
      id: 5,
      title: 'Active Organizer',
      earned: (personalStats?.drills_led || 0) >= 5,
      description: 'Led 5 or more emergency drills',
      icon: TrendingUp
    },
    {
      id: 6,
      title: 'Community Trainer',
      earned: (communityStats?.members_trained || 0) >= 50,
      description: 'Trained 50 or more community members',
      icon: Users
    }
  ];

  const personalProgressData = [
    { name: 'Courses', value: personalStats?.courses_completed || 0 },
    { name: 'Certifications', value: personalStats?.certifications_earned || 0 },
    { name: 'Drills Led', value: personalStats?.drills_led || 0 },
    { name: 'Workshops', value: personalStats?.workshops_held || 0 },
    { name: 'Alerts Sent', value: personalStats?.alerts_sent || 0 },
  ];

  const communityProgressData = [
    { name: 'Drills', value: communityStats?.drills_completed || 0 },
    { name: 'Workshops', value: communityStats?.workshops_held || 0 },
    { name: 'Alerts', value: communityStats?.alerts_sent || 0 },
    { name: 'Members Trained', value: communityStats?.members_trained || 0 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-text-primary mb-2">Community Readiness</h3>
          <div className="text-3xl font-bold text-primary">{Math.round(communityStats?.readiness_score || 0)}%</div>
          <p className="text-sm text-text-secondary">Average score</p>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-text-primary mb-2">Engagement Score</h3>
          <div className="text-3xl font-bold text-accent">{Math.round(personalStats?.engagement_score || 0)}</div>
          <p className="text-sm text-text-secondary">Your leadership impact</p>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-text-primary mb-2">Members Trained</h3>
          <div className="text-3xl font-bold text-success">{communityStats?.members_trained || 0}</div>
          <p className="text-sm text-text-secondary">Total trained</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-text-primary mb-4">Personal Leadership Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={personalProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#718096" fontSize={12} />
                <YAxis stroke="#718096" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#2E7D32" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-text-primary mb-4">Community Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={communityProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#718096" fontSize={12} />
                <YAxis stroke="#718096" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#1976D2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Leadership Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leadershipAchievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned
                    ? 'border-success bg-success/10'
                    : 'border-border bg-surface'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${achievement.earned ? 'text-success' : 'text-text-tertiary'}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${achievement.earned ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-text-secondary">
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
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-text-primary mb-4">Activity Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{personalStats?.courses_completed || 0}</div>
            <div className="text-sm text-text-secondary">Courses Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{personalStats?.certifications_earned || 0}</div>
            <div className="text-sm text-text-secondary">Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{personalStats?.assessments_conducted || 0}</div>
            <div className="text-sm text-text-secondary">Assessments Conducted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{personalStats?.drills_led || 0}</div>
            <div className="text-sm text-text-secondary">Drills Led</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProgress;
