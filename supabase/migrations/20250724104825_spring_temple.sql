/*
  # Create emergency alerts table

  1. New Tables
    - `emergency_alerts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `message` (text)
      - `severity` (enum: low, medium, high, critical)
      - `type` (enum: weather, fire, flood, earthquake, general)
      - `target_audience` (enum: all, community, school, region)
      - `created_by` (uuid, foreign key to users)
      - `location` (text, nullable)
      - `expires_at` (timestamp, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `emergency_alerts` table
    - Add policies for different user roles
*/

-- Create enum types
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE alert_type AS ENUM ('weather', 'fire', 'flood', 'earthquake', 'general');
CREATE TYPE target_audience AS ENUM ('all', 'community', 'school', 'region');

-- Create emergency alerts table
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  severity alert_severity NOT NULL,
  type alert_type NOT NULL,
  target_audience target_audience NOT NULL DEFAULT 'all',
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can read active alerts"
  ON emergency_alerts
  FOR SELECT
  TO authenticated
  USING (expires_at IS NULL OR expires_at > now());

CREATE POLICY "Authorized users can create alerts"
  ON emergency_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type IN ('community_leader', 'school_admin', 'disaster_coordinator')
    )
  );

CREATE POLICY "Alert creators can update their alerts"
  ON emergency_alerts
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Alert creators can delete their alerts"
  ON emergency_alerts
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS emergency_alerts_created_by_idx ON emergency_alerts(created_by);
CREATE INDEX IF NOT EXISTS emergency_alerts_created_at_idx ON emergency_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS emergency_alerts_expires_at_idx ON emergency_alerts(expires_at);
CREATE INDEX IF NOT EXISTS emergency_alerts_severity_idx ON emergency_alerts(severity);
CREATE INDEX IF NOT EXISTS emergency_alerts_type_idx ON emergency_alerts(type);


