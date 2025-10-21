import React from 'react';
import { 
  ClipboardCheck, 
  AlertCircle, 
  BarChart3, 
  Shield, 
  Bell, 
  MapPin,
  Loader2,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoleAccess } from '../hooks/useRoleAccess';
import RecentAlerts from '../components/home/RecentAlerts';
import { ReadinessScore } from '../components/readiness/ScoreComponents'; 
import RiskSummary from '../components/home/RiskSummary';
import RoleDashboard from '../components/dashboard/RoleDashboard';
import { useLocation } from '../hooks/useLocation';
import { useNotifications } from '../hooks/useNotifications';
import ActionableRecommendations from '../components/home/ActionableRecommendations';
import { useAuth } from '../contexts/AuthContext'; // 1. Import useAuth

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isIndividualUser } = useRoleAccess();
  const location = useLocation();
  const { unreadCount, isLoading: isLoadingNotifications } = useNotifications();
  const { loading: isAuthLoading } = useAuth(); // 2. Get the loading state

  // 3. While authentication is in progress, show a loading indicator.
  // This prevents the component from rendering before the user's role is known.
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // Role-specific dashboard
  if (!isIndividualUser()) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* The RoleDashboard will now render correctly because isIndividualUser() is called after loading is complete */}
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
          <ActionButton onClick={() => navigate('/communities')} icon={Users} title="Join Community" description="Find your local group" />
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
            Recommendations
          </h3>
          {/* Use the isLoading state to show a placeholder */}
          {isLoadingNotifications ? (
            <div className="card p-6 flex justify-center items-center h-48">
                <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
            <ActionableRecommendations />
          )}
        </div>
      </div>
    </div>
  );
};

// Helper components remain the same
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

export default Home;
