import React from 'react';
import { 
  ClipboardCheck, 
  AlertCircle, 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Bell, 
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoleAccess } from '../hooks/useRoleAccess';
import RecentAlerts from '../components/home/RecentAlerts';
// Import the component from the correct, consolidated file
import { ReadinessScore } from '../components/readiness/ScoreComponents'; 
import RiskSummary from '../components/home/RiskSummary';
import RoleDashboard from '../components/dashboard/RoleDashboard';
import { useLocation } from '../hooks/useLocation';
import { useNotifications } from '../hooks/useNotifications';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isIndividualUser } = useRoleAccess();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  // Role-specific dashboard
  if (!isIndividualUser()) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              Welcome back, {user?.fullName || 'User'}
            </h2>
            <p className="text-base sm:text-lg text-text-secondary mb-2">
              Here is your dashboard overview.
            </p>
            <div className="flex items-center text-sm text-text-tertiary">
              <MapPin size={16} className="mr-1" />
              {location.loading ? 'Getting your location...' : location.error || `${location.city}, ${location.country}`}
            </div>
          </div>
        </div>
        <RoleDashboard />
      </div>
    );
  }

  // Individual user dashboard
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            Welcome back, {user?.fullName || 'User'}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-2">
            Stay prepared and informed about climate risks in your area
          </p>
          <div className="flex items-center text-sm text-text-tertiary">
            <MapPin size={16} className="mr-1" />
            {location.loading ? 'Getting your location...' : location.error || `${location.city}, ${location.country}`}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <div onClick={() => navigate('/readiness')} className="cursor-pointer">
          {/* This component now fetches its own data from the context */}
          <ReadinessScore />
        </div>
        <div onClick={() => navigate('/assessment')} className="cursor-pointer">
          <RiskSummary displayMode="summary" />
        </div>
        
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary">Active Alerts</h3>
            <Bell className={unreadCount > 0 ? 'text-warning' : 'text-text-tertiary'} size={24} />
          </div>
          <div className={`text-2xl sm:text-3xl font-bold ${unreadCount > 0 ? 'text-warning' : 'text-text-tertiary'} mb-2`}>
            {unreadCount}
          </div>
          <p className="text-sm text-text-secondary">
            {unreadCount > 0 ? `${unreadCount} unread notification(s)` : 'No new alerts'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <ActionButton onClick={() => navigate('/readiness')} icon={ClipboardCheck} title="Take Assessment" description="Evaluate your readiness" />
          <ActionButton onClick={() => navigate('/assessment')} icon={AlertCircle} title="View Risk Map" description="Check current risks" />
          <ActionButton onClick={() => navigate('/progress')} icon={BarChart3} title="Track Progress" description="Monitor your improvements" />
          <ActionButton onClick={() => navigate('/emergency-kit')} icon={Shield} title="Emergency Kit" description="Review your supplies" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        <div className="xl:col-span-2">
          <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-4">
            Recent Climate Alerts
          </h3>
          <RecentAlerts />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-4">
            Tips & Resources
          </h3>
          <div className="space-y-4">
            <ResourceCard 
              title="Create an Emergency Plan" 
              description="A well-thought-out plan can significantly improve your readiness."
              buttonText="Learn More"
              onClick={() => {}}
              icon={TrendingUp}
            />
            <ResourceCard 
              title="Build Your Emergency Kit" 
              description="Essential supplies can make all the difference."
              buttonText="View Checklist"
              onClick={() => navigate('/emergency-kit')}
              icon={Shield}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for Quick Action buttons to reduce repetition
const ActionButton: React.FC<{onClick: () => void, icon: React.ElementType, title: string, description: string}> = 
({ onClick, icon: Icon, title, description }) => (
    <button onClick={onClick} className="card p-4 sm:p-6 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center group">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
            <Icon className="text-primary" size={20} />
        </div>
        <h4 className="font-semibold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base">{title}</h4>
        <p className="text-xs sm:text-sm text-text-secondary">{description}</p>
    </button>
);

// Helper for Resource cards
const ResourceCard: React.FC<{onClick: () => void, icon: React.ElementType, title: string, description: string, buttonText: string}> = 
({ onClick, icon: Icon, title, description, buttonText }) => (
    <div className="card p-4 sm:p-6">
        <div className="flex items-start">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <Icon className="text-accent" size={16} />
            </div>
            <div>
                <h4 className="font-bold text-text-primary mb-2">{title}</h4>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">{description}</p>
                <button onClick={onClick} className="btn-secondary text-sm">{buttonText}</button>
            </div>
        </div>
    </div>
);


export default Home;
