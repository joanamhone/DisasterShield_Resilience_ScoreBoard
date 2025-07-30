import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { 
  User as SupabaseUser, 
  Session, 
  AuthChangeEvent 
} from '@supabase/supabase-js';

// --- Interfaces ---
export interface User {
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
  householdSize?: number;
  vulnerableMembersDescription?: string;
  numberOfPets?: number;
}

export interface AuthContextType {
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

      if (error && error.code !== 'PGRST116') throw error;

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
          householdSize: profile.household_size,
          vulnerableMembersDescription: profile.vulnerable_members_description,
          numberOfPets: profile.number_of_pets,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, location: string, userType: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from signup');
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      location,
      user_type: userType as any,
    });
    if (profileError) throw profileError;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
  };

  const signOut = async () => {
    // **THE FIX: Immediately clear the local user state on sign out**
    // This prevents the old user's data from lingering in the UI.
    setUser(null); 
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    const { error } = await supabase.from('users').update({
      full_name: profileData.fullName,
      location: profileData.location,
      phone_number: profileData.phoneNumber,
      household_size: profileData.householdSize,
      vulnerable_members_description: profileData.vulnerableMembersDescription,
      number_of_pets: profileData.numberOfPets,
      profile_completed: profileData.profileCompleted,
    }).eq('id', user.id);
    if (error) throw error;
    await loadUserProfile({ id: user.id } as SupabaseUser);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };
  
  const value = { user, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile, resetPassword };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
