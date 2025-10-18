-- Add notification logs table for tracking alert deliveries
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES community_members(id) ON DELETE CASCADE,
  alert_id uuid REFERENCES alerts(id) ON DELETE CASCADE,
  delivery_method text NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  error_message text,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add notification preferences to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences text[] DEFAULT ARRAY['email'];

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notification_logs_recipient_id ON notification_logs(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_alert_id ON notification_logs(alert_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_sent_at ON notification_logs(sent_at);

-- Enable Row Level Security
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notification_logs table
CREATE POLICY "Users can view their own notification logs" ON notification_logs
  FOR SELECT TO authenticated
  USING (
    recipient_id IN (
      SELECT id FROM community_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Alert senders can view notification logs for their alerts" ON notification_logs
  FOR SELECT TO authenticated
  USING (
    alert_id IN (
      SELECT id FROM alerts WHERE sender_id = auth.uid()
    )
  );

CREATE POLICY "System can insert notification logs" ON notification_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);