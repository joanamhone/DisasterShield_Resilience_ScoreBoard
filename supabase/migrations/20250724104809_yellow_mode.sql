/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `location` (text, nullable)
      - `user_type` (enum: individual, community_leader, school_admin, disaster_coordinator)
      - `contact_method` (enum: email, sms, nullable)
      - `phone_number` (text, nullable)
      - `profile_photo` (text, nullable)
      - `languages` (text array, nullable)
      - `profile_completed` (boolean, default false)
      - `organization_name` (text, nullable)
      - `region` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read/update their own data
*/

-- Create enum types
CREATE TYPE user_type AS ENUM ('individual', 'community_leader', 'school_admin', 'disaster_coordinator');
CREATE TYPE contact_method AS ENUM ('email', 'sms');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  location text,
  user_type user_type NOT NULL DEFAULT 'individual',
  contact_method contact_method,
  phone_number text,
  profile_photo text,
  languages text[],
  profile_completed boolean DEFAULT false,
  organization_name text,
  region text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();