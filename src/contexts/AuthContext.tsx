import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { 
  User as SupabaseUser, 
  Session, 
  AuthChangeEvent 
} from '@supabase/supabase-js';

// Define your custom user profile structure
interface User {
  id: string;
  email: string;
  fullName: string;
  location?: string;
  userType: 'individual' | 'community_leader' | 'school_admin' | 'disaster_coordinator';
  contactMethod?: 'email' | 'sms';
  phoneNumber?: string;
  profilePhoto?: string;
  languages?: string[];
  profileCompleted: boolean;
  createdAt: Date;
  organizationName?: string;
  region?: string;
}

// Define the shape of the Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, location: string, userType: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Corrected useEffect to handle auth state
  useEffect(() => {
    setLoading(true);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          loadUserProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
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
          createdAt: new Date(profile.created_at),
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser(null); // Ensure user is null if profile fails to load
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, location: string, userType: string) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          location,
          user_type: userType as any,
          profile_completed: false,
        });

      if (profileError) throw profileError;

      // The onAuthStateChange listener will handle loading the profile
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    } finally {
      // Don't set loading to false here; let the listener handle it
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // User profile will be loaded by the auth state change listener
    } catch (error: any) {
      setLoading(false); // Set loading false on failure
      throw new Error(error.message || 'Invalid email or password');
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { data: _data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile-setup`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Google sign-in failed');
    }
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error);
        setLoading(false);
    }
    // The onAuthStateChange listener will handle setting user to null and loading to false
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    setLoading(true);
    try {
      const updateData: any = {};
      
      if (profileData.fullName !== undefined) updateData.full_name = profileData.fullName;
      if (profileData.location !== undefined) updateData.location = profileData.location;
      if (profileData.contactMethod !== undefined) updateData.contact_method = profileData.contactMethod;
      if (profileData.phoneNumber !== undefined) updateData.phone_number = profileData.phoneNumber;
      if (profileData.languages !== undefined) updateData.languages = profileData.languages;
      if (profileData.profileCompleted !== undefined) updateData.profile_completed = profileData.profileCompleted;
      if (profileData.organizationName !== undefined) updateData.organization_name = profileData.organizationName;
      if (profileData.region !== undefined) updateData.region = profileData.region;

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;

      // Refetch the profile to ensure local state is 100% in sync with the database
      await loadUserProfile({ id: user.id } as SupabaseUser);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message || 'Failed to send reset email');
  };
  
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};