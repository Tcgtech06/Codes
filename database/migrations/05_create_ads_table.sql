-- Create Ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'hero' or 'strip'
  page TEXT NOT NULL, -- 'home' or 'catalogue'
  image_url TEXT NOT NULL,
  redirection_url TEXT,
  whatsapp_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public to view active ads
CREATE POLICY "Public can view active ads" ON ads
  FOR SELECT USING (is_active = true);

-- Create policy to allow admins to manage ads
CREATE POLICY "Admins can manage ads" ON ads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
