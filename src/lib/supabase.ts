import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === 'https://your-project-id.supabase.co' ||
  supabaseAnonKey === 'your-anon-key-here'
) {
  console.warn('Supabase environment variables not configured. Using mock mode.');
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        // Call the callback immediately with no session to initialize the auth state
        setTimeout(() => callback('INITIAL_SESSION', null), 0);
        return {
          data: { subscription: { unsubscribe: () => {} } },
        };
      },
      signUp: () => Promise.reject(new Error('Supabase not configured')),
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
      signInWithOAuth: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.reject(new Error('Supabase not configured')),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      insert: () => Promise.resolve({ error: null }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export { supabase };

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          location: string | null;
          user_type: 'individual' | 'community_leader' | 'school_admin' | 'disaster_coordinator';
          contact_method: 'email' | 'sms' | null;
          phone_number: string | null;
          profile_photo: string | null;
          languages: string[] | null;
          profile_completed: boolean;
          organization_name: string | null;
          region: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          location?: string | null;
          user_type: 'individual' | 'community_leader' | 'school_admin' | 'disaster_coordinator';
          contact_method?: 'email' | 'sms' | null;
          phone_number?: string | null;
          profile_photo?: string | null;
          languages?: string[] | null;
          profile_completed?: boolean;
          organization_name?: string | null;
          region?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          location?: string | null;
          user_type?: 'individual' | 'community_leader' | 'school_admin' | 'disaster_coordinator';
          contact_method?: 'email' | 'sms' | null;
          phone_number?: string | null;
          profile_photo?: string | null;
          languages?: string[] | null;
          profile_completed?: boolean;
          organization_name?: string | null;
          region?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          user_id: string;
          type: 'general' | 'seasonal';
          score: number;
          answers: number[];
          location: string | null;
          season: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'general' | 'seasonal';
          score: number;
          answers: number[];
          location?: string | null;
          season?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'general' | 'seasonal';
          score?: number;
          answers?: number[];
          location?: string | null;
          season?: string | null;
          created_at?: string;
        };
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          relationship: string;
          phone: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          relationship: string;
          phone: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          relationship?: string;
          phone?: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      emergency_alerts: {
        Row: {
          id: string;
          title: string;
          message: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          type: 'weather' | 'fire' | 'flood' | 'earthquake' | 'general';
          target_audience: 'all' | 'community' | 'school' | 'region';
          created_by: string;
          location: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          type: 'weather' | 'fire' | 'flood' | 'earthquake' | 'general';
          target_audience: 'all' | 'community' | 'school' | 'region';
          created_by: string;
          location?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          type?: 'weather' | 'fire' | 'flood' | 'earthquake' | 'general';
          target_audience?: 'all' | 'community' | 'school' | 'region';
          created_by?: string;
          location?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_type: 'individual' | 'community_leader' | 'school_admin' | 'disaster_coordinator';
      contact_method: 'email' | 'sms';
      alert_severity: 'low' | 'medium' | 'high' | 'critical';
      alert_type: 'weather' | 'fire' | 'flood' | 'earthquake' | 'general';
      target_audience: 'all' | 'community' | 'school' | 'region';
    };
  };
}
