import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { 
  User as SupabaseUser, 
  Session, 
  AuthChangeEvent 
} from '@supabase/supabase-js';

// 1. UPDATE THE USER INTERFACE
// Add the new fields to match your updated database table.
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
  // New, more detailed fields
  householdSize?: number;
  vulnerableMembersDescription?: string;
  numberOfPets?: number;
}

// Update the shape of the Auth Context to reflect the new User type
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
        // 2. UPDATE THE PROFILE MAPPING
        // Map the new database columns to your User object.
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
          // New field mappings
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
    // This function remains the same, as new fields are not required at sign-up
    // They will be added later on the profile page.
    // ... (rest of the function is unchanged)
  };

  const signIn = async (email: string, password: string) => {
    // ... (unchanged)
  };

  const signInWithGoogle = async () => {
    // ... (unchanged)
  };

  const signOut = async () => {
    // ... (unchanged)
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    setLoading(true);
    try {
      // 3. UPDATE THE DATABASE PAYLOAD
      // Add the new fields to the object sent to Supabase.
      const updateData: any = {};
      
      if (profileData.fullName !== undefined) updateData.full_name = profileData.fullName;
      if (profileData.location !== undefined) updateData.location = profileData.location;
      // ... other existing fields
      
      // New fields for the update payload
      if (profileData.householdSize !== undefined) updateData.household_size = profileData.householdSize;
      if (profileData.vulnerableMembersDescription !== undefined) updateData.vulnerable_members_description = profileData.vulnerableMembersDescription;
      if (profileData.numberOfPets !== undefined) updateData.number_of_pets = profileData.numberOfPets;

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;

      // Refetch the profile to ensure local state is in sync
      await loadUserProfile({ id: user.id } as SupabaseUser);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    // ... (unchanged)
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
