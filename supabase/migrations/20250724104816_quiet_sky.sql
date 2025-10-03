/*
  # Create assessments table

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (enum: general, seasonal)
      - `score` (integer)
      - `answers` (integer array)
      - `location` (text, nullable)
      - `season` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `assessments` table
    - Add policy for users to read/write their own assessments
*/

-- Create enum type
CREATE TYPE assessment_type AS ENUM ('general', 'seasonal');

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type assessment_type NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  answers integer[] NOT NULL,
  location text,
  season text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own assessments"
  ON assessments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create index for better performance
CREATE INDEX IF NOT EXISTS assessments_user_id_idx ON assessments(user_id);
CREATE INDEX IF NOT EXISTS assessments_created_at_idx ON assessments(created_at DESC);