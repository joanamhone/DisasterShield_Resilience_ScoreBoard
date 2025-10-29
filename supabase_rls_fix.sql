-- Fix RLS policies for community_members table
-- Run this in your Supabase SQL editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can join communities" ON community_members;
DROP POLICY IF EXISTS "Users can view community members" ON community_members;
DROP POLICY IF EXISTS "Users can update own membership" ON community_members;

-- Create new policies that allow the join community functionality
CREATE POLICY "Users can join communities" ON community_members
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view community members" ON community_members
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update own membership" ON community_members
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Also ensure community_groups table has proper policies
CREATE POLICY IF NOT EXISTS "Anyone can view communities" ON community_groups
FOR SELECT TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Leaders can update their communities" ON community_groups
FOR UPDATE TO authenticated
USING (auth.uid() = leader_id)
WITH CHECK (auth.uid() = leader_id);