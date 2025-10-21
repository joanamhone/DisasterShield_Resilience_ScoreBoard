import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Load user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.createdAt = new Date(parsedUser.createdAt);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);


  const signUp = async (email: string, password: string, fullName: string, location: string, userType: string) => {
    // Store credentials in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      location,
      userType: userType as any,
      profileCompleted: false,
      createdAt: new Date(),
    };

    users.push({ ...newUser, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
  };

  const signInWithGoogle = async () => {
    throw new Error('Google sign-in not available in local mode');
  };

  const signOut = async () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    const updatedUser = { ...user, ...profileData };

    // Update in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...profileData };
      localStorage.setItem('users', JSON.stringify(users));
    }

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const resetPassword = async (email: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find((u: any) => u.email === email);

    if (!userExists) {
      throw new Error('No user found with this email');
    }

    console.log('Password reset requested for:', email);
  };
  
  const value = { user, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile, resetPassword };

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
