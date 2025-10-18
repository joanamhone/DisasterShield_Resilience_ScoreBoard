/*
  # Create Core Tables for Disaster Shield Application

  1. New Tables
    - `users` - User profiles and authentication data
    - `community_groups` - Community organizations
    - `community_members` - Members within communities
    - `alerts` - Emergency alerts and notifications
    - `drills` - Emergency drill schedules
    - `progress_tracking` - User progress and achievements
    - `community_progress` - Community-level progress metrics
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Leaders can manage their communities
    - Users can view alerts and drills
  
  3. Performance
    - Add indexes on frequently queried columns
*/

-- Create enums first
DO $$ BEGIN
  CREATE TYPE user_type_enum AS ENUM ('individual', 'community_leader', 'school_admin', 'disaster_coordinator');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE contact_method_enum AS ENUM ('email', 'sms');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE risk_level_enum AS ENUM ('low', 'medium', 'high');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE alert_type_enum AS ENUM ('weather', 'flood', 'fire', 'earthquake', 'general');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE severity_enum AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE target_audience_enum AS ENUM ('all', 'community', 'region', 'specific_group');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE drill_type_enum AS ENUM ('fire', 'earthquake', 'flood', 'evacuation', 'general');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE drill_status_enum AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE progress_type_enum AS ENUM ('personal', 'community_leader');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  location text,
  user_type user_type_enum NOT NULL DEFAULT 'individual',
  contact_method contact_method_enum DEFAULT 'email',
  phone_number text,
  profile_photo text,
  languages text[],
  profile_completed boolean DEFAULT false,
  organization_name text,
  region text,
  household_size integer,
  vulnerable_members_description text,
  number_of_pets integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create community_groups table
CREATE TABLE IF NOT EXISTS community_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  leader_id uuid REFERENCES users(id) ON DELETE SET NULL,
  location text NOT NULL,
  district text,
  traditional_authority text,
  village text,
  total_members integer DEFAULT 0,
  average_readiness_score numeric DEFAULT 0,
  demographics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create community_members table
CREATE TABLE IF NOT EXISTS community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone_number text,
  address text,
  readiness_score numeric DEFAULT 0,
  risk_level risk_level_enum DEFAULT 'low',
  last_contact timestamptz,
  is_vulnerable boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE SET NULL,
  alert_type alert_type_enum NOT NULL,
  severity severity_enum NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  target_audience target_audience_enum NOT NULL DEFAULT 'all',
  target_community_id uuid REFERENCES community_groups(id) ON DELETE SET NULL,
  recipients_count integer DEFAULT 0,
  delivery_method text[] DEFAULT ARRAY['email'],
  sent_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create drills table
CREATE TABLE IF NOT EXISTS drills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  community_id uuid REFERENCES community_groups(id) ON DELETE CASCADE,
  drill_type drill_type_enum NOT NULL,
  title text NOT NULL,
  description text,
  scheduled_date timestamptz NOT NULL,
  duration_minutes integer,
  location text,
  participants_count integer DEFAULT 0,
  status drill_status_enum DEFAULT 'scheduled',
  notification_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create progress_tracking table
CREATE TABLE IF NOT EXISTS progress_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  progress_type progress_type_enum NOT NULL DEFAULT 'personal',
  courses_completed integer DEFAULT 0,
  certifications_earned integer DEFAULT 0,
  drills_led integer DEFAULT 0,
  assessments_conducted integer DEFAULT 0,
  workshops_held integer DEFAULT 0,
  alerts_sent integer DEFAULT 0,
  engagement_score numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Create community_progress table
CREATE TABLE IF NOT EXISTS community_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid UNIQUE REFERENCES community_groups(id) ON DELETE CASCADE,
  readiness_score numeric DEFAULT 0,
  drills_completed integer DEFAULT 0,
  workshops_held integer DEFAULT 0,
  alerts_sent integer DEFAULT 0,
  members_trained integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON users
  FOR DELETE TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for community_groups table
CREATE POLICY "Anyone can view community groups" ON community_groups
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Leaders can update their communities" ON community_groups
  FOR UPDATE TO authenticated
  USING (leader_id = auth.uid())
  WITH CHECK (leader_id = auth.uid());

CREATE POLICY "Community leaders can create groups" ON community_groups
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE user_type = 'community_leader'));

-- RLS Policies for community_members table
CREATE POLICY "Members can view their community members" ON community_members
  FOR SELECT TO authenticated
  USING (
    community_id IN (SELECT id FROM community_groups WHERE leader_id = auth.uid())
    OR user_id = auth.uid()
  );

CREATE POLICY "Leaders can manage community members" ON community_members
  FOR ALL TO authenticated
  USING (community_id IN (SELECT id FROM community_groups WHERE leader_id = auth.uid()))
  WITH CHECK (community_id IN (SELECT id FROM community_groups WHERE leader_id = auth.uid()));

-- RLS Policies for alerts table
CREATE POLICY "Users can view alerts" ON alerts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Leaders and coordinators can create alerts" ON alerts
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users 
      WHERE user_type IN ('community_leader', 'disaster_coordinator')
    )
  );

-- RLS Policies for drills table
CREATE POLICY "Users can view drills" ON drills
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Organizers can manage their drills" ON drills
  FOR ALL TO authenticated
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());

-- RLS Policies for progress_tracking table
CREATE POLICY "Users can view own progress" ON progress_tracking
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON progress_tracking
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own progress" ON progress_tracking
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for community_progress table
CREATE POLICY "Anyone can view community progress" ON community_progress
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Leaders can manage community progress" ON community_progress
  FOR ALL TO authenticated
  USING (community_id IN (SELECT id FROM community_groups WHERE leader_id = auth.uid()))
  WITH CHECK (community_id IN (SELECT id FROM community_groups WHERE leader_id = auth.uid()));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_community_groups_leader_id ON community_groups(leader_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_sender_id ON alerts(sender_id);
CREATE INDEX IF NOT EXISTS idx_alerts_target_community_id ON alerts(target_community_id);
CREATE INDEX IF NOT EXISTS idx_drills_organizer_id ON drills(organizer_id);
CREATE INDEX IF NOT EXISTS idx_drills_community_id ON drills(community_id);
CREATE INDEX IF NOT EXISTS idx_drills_scheduled_date ON drills(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_user_id ON progress_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_community_progress_community_id ON community_progress(community_id);



