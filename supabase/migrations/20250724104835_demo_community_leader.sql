/*
  # Demo Community Leader Setup
  
  This migration sets up a demo community leader for testing the join functionality.
  In a real app, this would be done through the admin interface.
*/

-- Update one of the communities to have a leader_id
-- This will be updated when a real community leader user signs up
UPDATE community_groups 
SET leader_id = (
  SELECT id FROM users 
  WHERE user_type = 'community_leader' 
  LIMIT 1
)
WHERE name = 'Mbare Community';