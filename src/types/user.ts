export interface User {
  id: string
  email: string
  fullName: string
  location?: string
  userType: 'individual' | 'community_leader' | 'school_admin' | 'disaster_coordinator'
  contactMethod?: 'email' | 'sms'
  phoneNumber?: string
  profilePhoto?: string
  languages?: string[]
  profileCompleted: boolean
  createdAt: Date
  // Role-specific data
  organizationName?: string
  region?: string
  permissions?: string[]
}

export interface Community {
  id: string
  name: string
  leaderId: string
  memberCount: number
  averageReadinessScore: number
  location: string
  createdAt: Date
}

export interface School {
  id: string
  name: string
  adminId: string
  studentCount: number
  staffCount: number
  readinessScore: number
  location: string
  emergencyPlan?: string
  createdAt: Date
}

export interface EmergencyAlert {
  id: string
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'weather' | 'fire' | 'flood' | 'earthquake' | 'general'
  targetAudience: 'all' | 'community' | 'school' | 'region'
  createdBy: string
  location?: string
  expiresAt?: Date
  createdAt: Date
}