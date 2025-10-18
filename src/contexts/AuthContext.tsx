import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'; // Import the configured Supabase client
import { AuthError } from '@supabase/supabase-js'; // Import Supabase AuthError type

// --- Interfaces (Kept intact) ---
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
  deleteProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// --- Helper Functions ---

const saveUserToLocalStorage = (userData: User) => {
    localStorage.setItem('disaster_shield_user', JSON.stringify(userData))
}

const fetchUserProfile = async (userId: string, email: string): Promise<User> => {
    // Fetch profile data from your custom 'users' table
    const { data: profileData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

    if (error || !profileData) {
        // Fallback for brand new sign-ups before profile setup is complete
        console.warn("User profile not found in 'users' table. Using placeholder.");
        return {
            id: userId,
            email: email,
            fullName: 'New User',
            userType: 'individual', // Default type
            profileCompleted: false,
            createdAt: new Date(),
        } as User;
    }
    
    // Map database row (snake_case) to frontend User interface (camelCase)
    return {
        id: profileData.id,
        email: profileData.email,
        fullName: profileData.full_name,
        location: profileData.location ?? undefined,
        userType: profileData.user_type, 
        contactMethod: profileData.contact_method ?? undefined,
        phoneNumber: profileData.phone_number ?? undefined,
        profileCompleted: profileData.profile_completed,
        createdAt: new Date(profileData.created_at),
        organizationName: profileData.organization_name ?? undefined,
        region: profileData.region ?? undefined,
    } as User;
}

// --- Auth Provider ---

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const saveUser = (userData: User) => {
    setUser(userData)
    saveUserToLocalStorage(userData)
  }

  // Session Listener and Initial Load
  useEffect(() => {
    const handleSession = async (session: any) => {
        if (session) {
            const authUser = session.user;
            const profile = await fetchUserProfile(authUser.id, authUser.email || '');
            saveUser(profile);
        } else {
            setUser(null);
            localStorage.removeItem('disaster_shield_user');
        }
        setLoading(false);
    };

    // Listen for auth state changes (login/logout/refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
                handleSession(session);
            } else if (event === 'SIGNED_OUT') {
                handleSession(null);
            }
        }
    );

    // Initial check (handles the case where the user is already logged in)
    supabase.auth.getSession().then(({ data: { session } }) => {
        handleSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // --- Core Auth Functions ---

  const signUp = async (email: string, password: string, fullName: string, location: string, userType: string) => {
    setLoading(true)
    try {
      // 1. Sign up user using Supabase
      const { data, error } = await supabase.auth.signUp({ 
          email, 
          password 
      });

      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) throw new Error("Sign up failed: User ID not returned.");

      // 2. Insert initial profile data into your 'users' table
      const { error: profileError } = await supabase
          .from('users')
          .insert({
              id: userId,
              email: email,
              full_name: fullName,
              location,
              user_type: userType,
              profile_completed: false,
          });

      if (profileError) throw profileError;
      
      // The onAuthStateChange listener will handle setting the user state after signup
    } catch (error) {
      throw new Error(`Failed to create account: ${(error as AuthError).message || error}`);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // FIX: Use real Supabase authentication
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error;
      
      // The onAuthStateChange listener handles fetching the profile and saving the user state.

    } catch (error) {
      const message = (error as AuthError).message || 'Invalid email or password.';
      throw new Error(`Authentication failed: ${message}`);
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
     // NOTE: This feature requires more configuration (redirects, etc.)
     throw new Error("Google sign-in is currently not supported in this environment.")
  }

  const signOut = async () => {
    setLoading(true)
    try {
      // FIX: Use real Supabase sign out
      await supabase.auth.signOut(); 

      setUser(null);
      localStorage.removeItem('disaster_shield_user')
      localStorage.removeItem('disaster_shield_readiness_score')
      localStorage.removeItem('disaster_shield_assessment_history')
      sessionStorage.clear()
      
    } catch (error) {
      throw new Error('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) throw new Error('No user logged in')
    
    setLoading(true)
    try {
      // Prepare data for database (snake_case mapping)
      const dbUpdate = {
           // Only include fields that exist on the Supabase 'users' table
           full_name: profileData.fullName,
           location: profileData.location,
           contact_method: profileData.contactMethod,
           phone_number: profileData.phoneNumber,
           organization_name: profileData.organizationName,
           region: profileData.region,
      };
      
      const { error } = await supabase
          .from('users')
          .update(dbUpdate)
          .eq('id', user.id);
          
      if (error) throw error;
      
      // Update local state and storage
      const updatedUser = { ...user, ...profileData } as User
      saveUser(updatedUser)
      
    } catch (error) {
      throw new Error(`Failed to update profile: ${(error as AuthError).message || error}`);
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    // FIX: Use real Supabase reset password flow
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, // Placeholder redirect
    });

    if (error) throw new Error(`Failed to send reset email: ${error.message}`);
  }

  const deleteProfile = async () => {
    if (!user) throw new Error('No user logged in')
    
    setLoading(true)
    try {
      // WARNING: Client-side deletion is typically disabled for security.
      // You MUST use a Supabase Function/Postgres Function to delete the auth.user record 
      // and associated data safely. Since we don't have that function, we throw an error.
      throw new Error("Deletion failed: Client-side removal of user records is restricted. Contact a coordinator.");
      
    } catch (error) {
       // On deletion failure, we still perform client-side cleanup for safety
       setUser(null)
       localStorage.clear()
       sessionStorage.clear()
       // Re-throw specific error or general failure message
       throw new Error('Failed to delete account. You may need to manually sign out and try again.');
    } finally {
      setLoading(false)
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
      resetPassword,
      deleteProfile
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
