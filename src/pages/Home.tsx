import React, { useState } from 'react'
import { ClipboardCheck, AlertCircle, BarChart3, TrendingUp, Shield, Bell, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useReadiness } from '../contexts/ReadinessContext'
import { useRoleAccess } from '../hooks/useRoleAccess'
import RecentAlerts from '../components/home/RecentAlerts'
import ReadinessScore from '../components/home/ReadinessScore'
import RiskSummary from '../components/home/RiskSummary'
import RoleDashboard from '../components/dashboard/RoleDashboard'
import { useLocation } from '../hooks/useLocation'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { currentScore } = useReadiness()
  const { user, canAccessCommunityFeatures, canAccessSchoolFeatures, canAccessCoordinatorFeatures, isIndividualUser } = useRoleAccess()
  const [userName] = useState('Alex Johnson')
  const location = useLocation()

  const handleReadinessScoreClick = () => {
    navigate('/readiness')
  }

  const handleRiskSummaryClick = () => {
    navigate('/assessment')
  }

  // Show role-specific dashboard for non-individual users
  // Only show individual dashboard for individual users
  if (!isIndividualUser()) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              Welcome back, {user?.fullName || userName}
            </h2>
            <p className="text-base sm:text-lg text-text-secondary mb-2">
              Access your role-specific dashboard from the navigation menu
            </p>
            {/* Location display */}
            <div className="flex items-center text-sm text-text-tertiary">
              <MapPin size={16} className="mr-1" />
              {location.loading ? (
                <span>Getting your location...</span>
              ) : location.error ? (
                <span>Location unavailable</span>
              ) : (
                <span>{location.city}, {location.country}</span>
              )}
            </div>
          </div>
        </div>

        {/* Role-specific dashboard links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {canAccessCoordinatorFeatures() && (
            <button 
              onClick={() => navigate('/coordinator-dashboard')}
              className="card p-6 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-error/30 transition-colors">
                <AlertTriangle className="text-error" size={24} />
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Coordinator Dashboard</h4>
              <p className="text-sm text-text-secondary">Manage regional emergency response</p>
            </button>
          )}
          
          {canAccessSchoolFeatures() && (
            <button 
              onClick={() => navigate('/school-dashboard')}
              className="card p-6 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
                <Users className="text-secondary" size={24} />
              </div>
              <h4 className="font-semibold text-text-primary mb-2">School Dashboard</h4>
              <p className="text-sm text-text-secondary">Manage school emergency preparedness</p>
            </button>
          )}
          
          {canAccessCommunityFeatures() && (
            <button 
              onClick={() => navigate('/community-dashboard')}
              className="card p-6 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <Users className="text-primary" size={24} />
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Community Dashboard</h4>
              <p className="text-sm text-text-secondary">Lead community preparedness efforts</p>
            </button>
          )}
        </div>
      </div>
    )
  }

  // Individual user dashboard (existing layout)
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            Welcome back, {user?.fullName || userName}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-2">
            Stay prepared and informed about climate risks in your area
          </p>
          {/* Location display */}
          <div className="flex items-center text-sm text-text-tertiary">
            <MapPin size={16} className="mr-1" />
            {location.loading ? (
              <span>Getting your location...</span>
            ) : location.error ? (
              <span>Location unavailable</span>
            ) : (
              <span>{location.city}, {location.country}</span>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <div onClick={handleReadinessScoreClick} className="cursor-pointer">
          <ReadinessScore score={currentScore} />
        </div>
        <div onClick={handleRiskSummaryClick} className="cursor-pointer">
          <RiskSummary />
        </div>
        
        {/* Additional metric card */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary">Active Alerts</h3>
            <Bell className="text-warning" size={24} />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-warning mb-2">3</div>
          <p className="text-sm text-text-secondary">2 weather, 1 air quality</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button 
            onClick={() => navigate('/readiness')}
            className="card p-4 sm:p-6 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/30 transition-colors">
              <ClipboardCheck className="text-primary" size={20} />
            </div>
            <h4 className="font-semibold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base">Take Assessment</h4>
            <p className="text-xs sm:text-sm text-text-secondary">Evaluate your emergency readiness</p>
          </button>
          
          <button 
            onClick={() => navigate('/assessment')}
            className="card p-4 sm:p-6 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-secondary/30 transition-colors">
              <AlertCircle className="text-secondary" size={20} />
            </div>
            <h4 className="font-semibold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base">View Risk Map</h4>
            <p className="text-xs sm:text-sm text-text-secondary">Check current disaster risks</p>
          </button>
          
          <button 
            onClick={() => navigate('/progress')}
            className="card p-4 sm:p-6 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-accent/30 transition-colors">
              <BarChart3 className="text-accent" size={20} />
            </div>
            <h4 className="font-semibold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base">Track Progress</h4>
            <p className="text-xs sm:text-sm text-text-secondary">Monitor your improvements</p>
          </button>

          <button 
            onClick={() => navigate('/emergency-kit')}
            className="card p-4 sm:p-6 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-success/30 transition-colors">
              <Shield className="text-success" size={20} />
            </div>
            <h4 className="font-semibold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base">Emergency Kit</h4>
            <p className="text-xs sm:text-sm text-text-secondary">Review your supplies</p>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Alerts - Takes up 2 columns on xl screens */}
        <div className="xl:col-span-2">
          <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-4">
            Recent Climate Alerts
          </h3>
          <RecentAlerts />
        </div>

        {/* Tips & Resources */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-4">
            Tips & Resources
          </h3>
          <div className="space-y-4">
            <div className="card p-4 sm:p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <TrendingUp className="text-primary" size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-2">
                    Create an Emergency Plan
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    Having a well-thought-out emergency plan can significantly improve your readiness.
                    Make sure everyone in your household knows what to do.
                  </p>
                  <button className="btn-primary text-sm">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/20 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <Shield className="text-accent" size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-2">
                    Build Your Emergency Kit
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    Essential supplies can make all the difference during an emergency.
                    Start with the basics and build from there.
                  </p>
                  <button 
                    onClick={() => navigate('/emergency-kit')}
                    className="btn-secondary text-sm"
                  >
                    View Checklist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home