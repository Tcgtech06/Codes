-- Update visitor_sessions table to support upsert on session_id

-- Drop the existing unique constraint if it exists
ALTER TABLE visitor_sessions DROP CONSTRAINT IF EXISTS visitor_sessions_session_id_key;

-- Add unique constraint back (needed for upsert)
ALTER TABLE visitor_sessions ADD CONSTRAINT visitor_sessions_session_id_key UNIQUE (session_id);

-- Update the table to allow updating visited_at on conflict
-- This is already handled by the UNIQUE constraint above

-- Add a trigger to automatically update visited_at on upsert
CREATE OR REPLACE FUNCTION update_visitor_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.visited_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_visitor_session ON visitor_sessions;

CREATE TRIGGER trigger_update_visitor_session
BEFORE INSERT OR UPDATE ON visitor_sessions
FOR EACH ROW
EXECUTE FUNCTION update_visitor_session_timestamp();

-- Comment
COMMENT ON TRIGGER trigger_update_visitor_session ON visitor_sessions IS 'Automatically updates visited_at timestamp on insert or update';
