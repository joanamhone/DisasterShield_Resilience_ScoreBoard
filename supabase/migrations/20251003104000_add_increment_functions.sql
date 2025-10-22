-- Create increment functions for progress tracking

-- Function to increment drills led
CREATE OR REPLACE FUNCTION increment_drills_led(user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO progress_tracking (user_id, progress_type, drills_led, updated_at)
  VALUES (user_id, 'community_leader', 1, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    drills_led = progress_tracking.drills_led + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Function to increment workshops held
CREATE OR REPLACE FUNCTION increment_workshops_held(user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO progress_tracking (user_id, progress_type, workshops_held, updated_at)
  VALUES (user_id, 'community_leader', 1, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    workshops_held = progress_tracking.workshops_held + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Function to increment assessments conducted
CREATE OR REPLACE FUNCTION increment_assessments_conducted(user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO progress_tracking (user_id, progress_type, assessments_conducted, updated_at)
  VALUES (user_id, 'community_leader', 1, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    assessments_conducted = progress_tracking.assessments_conducted + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Function to increment community drills completed
CREATE OR REPLACE FUNCTION increment_community_drills(community_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO community_progress (community_id, drills_completed, updated_at)
  VALUES (community_id, 1, now())
  ON CONFLICT (community_id) 
  DO UPDATE SET 
    drills_completed = community_progress.drills_completed + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Function to increment community workshops
CREATE OR REPLACE FUNCTION increment_community_workshops(community_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO community_progress (community_id, workshops_held, updated_at)
  VALUES (community_id, 1, now())
  ON CONFLICT (community_id) 
  DO UPDATE SET 
    workshops_held = community_progress.workshops_held + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Function to increment alerts sent (fix the existing one)
CREATE OR REPLACE FUNCTION increment_alerts_sent(user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO progress_tracking (user_id, progress_type, alerts_sent, updated_at)
  VALUES (user_id, 'community_leader', 1, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    alerts_sent = progress_tracking.alerts_sent + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;