-- Create visitor tracking tables

-- Table to store overall visitor statistics
CREATE TABLE IF NOT EXISTS visitor_stats (
  id TEXT PRIMARY KEY,
  total_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize with starting count (adjust this number as needed)
INSERT INTO visitor_stats (id, total_count)
VALUES ('total_visitors', 1247)
ON CONFLICT (id) DO NOTHING;

-- Table to track individual visitor sessions (to prevent double counting)
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON visitor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_visited_at ON visitor_sessions(visited_at DESC);

-- Function to increment visitor count atomically
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE visitor_stats
  SET total_count = total_count + 1,
      updated_at = NOW()
  WHERE id = 'total_visitors'
  RETURNING total_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Cleanup old sessions (older than 30 days) - run this periodically
CREATE OR REPLACE FUNCTION cleanup_old_visitor_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM visitor_sessions
  WHERE visited_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Disable RLS for simplicity (enable later if needed)
ALTER TABLE visitor_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions DISABLE ROW LEVEL SECURITY;

-- Comments for documentation
COMMENT ON TABLE visitor_stats IS 'Stores overall visitor statistics';
COMMENT ON TABLE visitor_sessions IS 'Tracks individual visitor sessions to prevent double counting';
COMMENT ON FUNCTION increment_visitor_count() IS 'Atomically increments the total visitor count';
COMMENT ON FUNCTION cleanup_old_visitor_sessions() IS 'Removes visitor sessions older than 30 days';
