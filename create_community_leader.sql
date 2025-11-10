-- Create a community leader user directly in database
-- Run this in your Supabase SQL editor

-- Insert a new user (replace with your desired details)
INSERT INTO users (
  id,
  email,
  full_name,
  user_type,
  location,
  phone_number,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'leader@example.com',
  'Community Leader',
  'community_leader',
  'Blantyre',
  '+265123456789',
  now(),
  now()
);

-- Assign them as leader of a community
UPDATE community_groups 
SET leader_id = (SELECT id FROM users WHERE email = 'leader@example.com' LIMIT 1)
WHERE name = 'Blantyre Community Development Group';

-- Check the result
SELECT u.email, u.full_name, u.user_type, cg.name as community_name
FROM users u
LEFT JOIN community_groups cg ON cg.leader_id = u.id
WHERE u.email = 'leader@example.com';