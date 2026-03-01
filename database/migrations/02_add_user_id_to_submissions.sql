-- Add user_id column to form_submissions table
-- This allows tracking which user submitted each form

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'form_submissions' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE form_submissions ADD COLUMN user_id TEXT;
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_user_id ON form_submissions(user_id);

-- Comment for documentation
COMMENT ON COLUMN form_submissions.user_id IS 'ID of the user who submitted the form (from Clerk authentication)';
