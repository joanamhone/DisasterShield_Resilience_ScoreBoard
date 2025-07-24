import React from 'react'
import { useRoleAccess } from '../../hooks/useRoleAccess'
import CommunityOverview from './CommunityOverview'
import SchoolManagement from './SchoolManagement'
import EmergencyManagement from './EmergencyManagement'

const RoleDashboard: React.FC = () => {
  const { 
    canAccessCommunityFeatures, 
    canAccessSchoolFeatures, 
    canAccessCoordinatorFeatures,
    getRoleDisplayName 
  } = useRoleAccess()

  return (
    <div className="space-y-6">
      {/* Role-specific welcome message */}
      <div className="card p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <h2 className="text-lg font-bold text-text-primary mb-2">
          {getRoleDisplayName()} Dashboard
        </h2>
        <p className="text-text-secondary">
          {canAccessCoordinatorFeatures() && "Manage regional emergency response and coordinate with multiple organizations."}
          {canAccessSchoolFeatures() && !canAccessCoordinatorFeatures() && "Manage school emergency preparedness and coordinate with staff and students."}
          {canAccessCommunityFeatures() && !canAccessSchoolFeatures() && !canAccessCoordinatorFeatures() && "Lead your community's disaster preparedness efforts and coordinate group activities."}
          {!canAccessCommunityFeatures() && !canAccessSchoolFeatures() && !canAccessCoordinatorFeatures() && "Track your personal disaster preparedness and stay informed about local risks."}
        </p>
      </div>

      {/* Role-specific dashboard components */}
      {canAccessCoordinatorFeatures() && <EmergencyManagement />}
      {canAccessSchoolFeatures() && <SchoolManagement />}
      {canAccessCommunityFeatures() && <CommunityOverview />}
    </div>
  )
}

export default RoleDashboard