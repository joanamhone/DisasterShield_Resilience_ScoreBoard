import { useAuth } from '../contexts/AuthContext'

export const useRoleAccess = () => {
  const { user } = useAuth()

  const hasRole = (role: string | string[]) => {
    if (!user) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(user.userType)
  }

  const canAccessCommunityFeatures = () => {
    return hasRole('community_leader')
  }

  const canAccessSchoolFeatures = () => {
    return hasRole('school_admin')
  }

  const canAccessCoordinatorFeatures = () => {
    return hasRole('disaster_coordinator')
  }

  const canManageAlerts = () => {
    return hasRole(['community_leader', 'school_admin', 'disaster_coordinator'])
  }

  const canViewAnalytics = () => {
    return hasRole(['community_leader', 'school_admin', 'disaster_coordinator'])
  }

  const isIndividualUser = () => {
    return hasRole('individual')
  }
  const getRoleDisplayName = () => {
    if (!user) return 'User'
    
    const roleNames = {
      individual: 'Individual',
      community_leader: 'Community Leader',
      school_admin: 'School Administrator',
      disaster_coordinator: 'Disaster Coordinator'
    }
    
    return roleNames[user.userType] || 'User'
  }

  return {
    user,
    hasRole,
    canAccessCommunityFeatures,
    canAccessSchoolFeatures,
    canAccessCoordinatorFeatures,
    canManageAlerts,
    canViewAnalytics,
    isIndividualUser,
    getRoleDisplayName
  }
}