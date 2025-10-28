-- Create missing increment functions
CREATE OR REPLACE FUNCTION increment_alerts_sent(user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO progress_tracking (user_id, alerts_sent, created_at, updated_at)
  VALUES (user_id, 1, NOW(), NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET 
    alerts_sent = progress_tracking.alerts_sent + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_drills_led(user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO progress_tracking (user_id, drills_led, created_at, updated_at)
  VALUES (user_id, 1, NOW(), NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET 
    drills_led = progress_tracking.drills_led + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Community members already exist in database