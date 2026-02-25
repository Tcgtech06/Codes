-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('update', 'create', 'delete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read notifications
CREATE POLICY "Allow authenticated users to read notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to insert notifications
CREATE POLICY "Allow service role to insert notifications"
  ON notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy to allow authenticated users to delete notifications
CREATE POLICY "Allow authenticated users to delete notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (true);
