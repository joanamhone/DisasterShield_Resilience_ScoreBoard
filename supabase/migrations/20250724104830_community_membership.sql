/*
  # Community Membership System

  1. New Tables
    - `community_groups` - Store community information
    - `community_join_requests` - Store pending join requests
    - `community_members` - Store approved community members

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create risk level enum
CREATE TYPE risk_level_enum AS ENUM ('low', 'medium', 'high');

-- Create community_groups table
CREATE TABLE IF NOT EXISTS community_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  leader_id uuid NULL,
  location text NOT NULL,
  district text NULL,
  traditional_authority text NULL,
  village text NULL,
  total_members integer NULL DEFAULT 0,
  average_readiness_score numeric NULL DEFAULT 0,
  demographics jsonb NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NULL DEFAULT now(),
  updated_at timestamptz NULL DEFAULT now(),
  CONSTRAINT community_groups_pkey PRIMARY KEY (id),
  CONSTRAINT community_groups_leader_id_fkey FOREIGN KEY (leader_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Create community_members table
CREATE TABLE IF NOT EXISTS community_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid NULL,
  user_id uuid NULL,
  name text NOT NULL,
  phone_number text NULL,
  address text NULL,
  readiness_score numeric NULL DEFAULT 0,
  risk_level risk_level_enum NULL DEFAULT 'low'::risk_level_enum,
  last_contact timestamptz NULL,
  is_vulnerable boolean NULL DEFAULT false,
  notes text NULL,
  created_at timestamptz NULL DEFAULT now(),
  updated_at timestamptz NULL DEFAULT now(),
  CONSTRAINT community_members_pkey PRIMARY KEY (id),
  CONSTRAINT community_members_community_id_fkey FOREIGN KEY (community_id) REFERENCES community_groups (id) ON DELETE CASCADE,
  CONSTRAINT community_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Create community join requests table
CREATE TABLE IF NOT EXISTS community_join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  community_id uuid REFERENCES community_groups(id) ON DELETE CASCADE,
  phone_number text NOT NULL,
  email text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, community_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_groups_leader_id ON community_groups USING btree (leader_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members USING btree (community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members USING btree (user_id);

-- Enable RLS
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_join_requests ENABLE ROW LEVEL SECURITY;

-- Community groups policies
CREATE POLICY "Anyone can read community groups"
  ON community_groups FOR SELECT TO authenticated USING (true);

CREATE POLICY "Community leaders can update their groups"
  ON community_groups FOR UPDATE TO authenticated 
  USING (leader_id = auth.uid());

-- Community members policies
CREATE POLICY "Community members can read their own membership"
  ON community_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Community leaders can read their community members"
  ON community_members FOR SELECT TO authenticated
  USING (community_id IN (SELECT id FROM community_groups WHERE leader_id = auth.uid()));

CREATE POLICY "Community leaders can manage members"
  ON community_members FOR ALL TO authenticated
  USING (community_id IN (SELECT id FROM community_groups WHERE leader_id = auth.uid()));

-- Join requests policies
CREATE POLICY "Users can read their own join requests"
  ON community_join_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Community leaders can read requests for their communities"
  ON community_join_requests FOR SELECT TO authenticated
  USING (community_id IN (SELECT id FROM community_groups WHERE leader_id = auth.uid()));

CREATE POLICY "Users can create join requests"
  ON community_join_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Community leaders can update requests for their communities"
  ON community_join_requests FOR UPDATE TO authenticated
  USING (community_id IN (SELECT id FROM community_groups WHERE leader_id = auth.uid()));

-- Add updated_at triggers
CREATE TRIGGER update_community_groups_updated_at
  BEFORE UPDATE ON community_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_members_updated_at
  BEFORE UPDATE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_join_requests_updated_at
  BEFORE UPDATE ON community_join_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample communities for Harare, Zimbabwe
INSERT INTO community_groups (name, location, district, traditional_authority, village, total_members, average_readiness_score) VALUES
  ('Mbare Community', 'Harare', 'Harare', 'Mbare', 'Mbare Township', 245, 68),
  ('Highfield Community', 'Harare', 'Harare', 'Highfield', 'Highfield Township', 312, 72),
  ('Chitungwiza Community', 'Harare', 'Chitungwiza', 'Chitungwiza', 'Chitungwiza Town', 428, 65),
  ('Epworth Community', 'Harare', 'Harare', 'Epworth', 'Epworth Settlement', 189, 58),
  ('Glen View Community', 'Harare', 'Harare', 'Glen View', 'Glen View Township', 156, 74);