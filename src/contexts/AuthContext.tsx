import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
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
  organizationName?: string
  region?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, location: string, userType: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from Supabase on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          location: profile.location,
          userType: profile.user_type,
          contactMethod: profile.contact_method,
          phoneNumber: profile.phone_number,
          profilePhoto: profile.profile_photo,
          languages: profile.languages,
          profileCompleted: profile.profile_completed,
          organizationName: profile.organization_name,
          region: profile.region,
          createdAt: new Date(profile.created_at)
        }
        setUser(userData)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, location: string, userType: string) => {
    setLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No user returned from signup')

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          location,
          user_type: userType as any,
          profile_completed: false
        })

      if (profileError) throw profileError

      // Load the user profile
      await loadUserProfile(authData.user)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      if (!data.user) throw new Error('No user returned from signin')

      // User profile will be loaded by the auth state change listener
    } catch (error: any) {
      throw new Error(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile-setup`
        }
      })

      if (error) throw error
    } catch (error: any) {
      setLoading(false)
      throw new Error(error.message || 'Google sign-in failed')
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const currentUser = user
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Store user info for sign-in page
      if (currentUser) {
        sessionStorage.setItem('previous_user', JSON.stringify(currentUser))
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) throw new Error('No user logged in')
    
    setLoading(true)
    try {
      const updateData: any = {}
      
      if (profileData.fullName !== undefined) updateData.full_name = profileData.fullName
      if (profileData.location !== undefined) updateData.location = profileData.location
      if (profileData.contactMethod !== undefined) updateData.contact_method = profileData.contactMethod
      if (profileData.phoneNumber !== undefined) updateData.phone_number = profileData.phoneNumber
      if (profileData.languages !== undefined) updateData.languages = profileData.languages
      if (profileData.profileCompleted !== undefined) updateData.profile_completed = profileData.profileCompleted
      if (profileData.organizationName !== undefined) updateData.organization_name = profileData.organizationName
      if (profileData.region !== undefined) updateData.region = profileData.region

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)

      if (error) throw error

      // Update local user state
      const updatedUser = { ...user, ...profileData }
      setUser(updatedUser)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      updateProfile,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}