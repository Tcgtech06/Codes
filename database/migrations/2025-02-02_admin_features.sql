-- =====================================================
-- Admin Features Database Schema
-- =====================================================

-- 1. Companies Table (with priority management)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  category TEXT NOT NULL,
  description TEXT,
  products TEXT,
  certifications TEXT,
  gst_number TEXT,
  priority INTEGER DEFAULT 999,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 2. Collaborate Submissions Table
CREATE TABLE IF NOT EXISTS collaborate_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- 3. Admin Users Table (for role management)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_companies_category ON companies(category);
CREATE INDEX IF NOT EXISTS idx_companies_priority ON companies(priority);
CREATE INDEX IF NOT EXISTS idx_companies_active ON companies(is_active);
CREATE INDEX IF NOT EXISTS idx_collaborate_status ON collaborate_submissions(status);
CREATE INDEX IF NOT EXISTS idx_collaborate_created ON collaborate_submissions(created_at DESC);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborate_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Companies Table Policies
-- =====================================================

-- Public can view active companies
CREATE POLICY "Public can view active companies"
ON companies FOR SELECT
USING (is_active = true);

-- Admins can view all companies
CREATE POLICY "Admins can view all companies"
ON companies FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Admins can insert companies
CREATE POLICY "Admins can insert companies"
ON companies FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Admins can update companies
CREATE POLICY "Admins can update companies"
ON companies FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Admins can delete companies
CREATE POLICY "Admins can delete companies"
ON companies FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- =====================================================
-- Collaborate Submissions Policies
-- =====================================================

-- Anyone can insert collaborate submissions
CREATE POLICY "Anyone can submit collaboration request"
ON collaborate_submissions FOR INSERT
WITH CHECK (true);

-- Public can view approved submissions
CREATE POLICY "Public can view approved submissions"
ON collaborate_submissions FOR SELECT
USING (status = 'approved');

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
ON collaborate_submissions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Admins can update submissions (approve/reject)
CREATE POLICY "Admins can update submissions"
ON collaborate_submissions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Admins can delete submissions
CREATE POLICY "Admins can delete submissions"
ON collaborate_submissions FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- =====================================================
-- Admin Users Policies
-- =====================================================

-- Only admins can view admin users
CREATE POLICY "Admins can view admin users"
ON admin_users FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Only super admins can manage admin users
CREATE POLICY "Super admins can manage admin users"
ON admin_users FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid() AND role = 'super_admin'
  )
);

-- =====================================================
-- Functions
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update company priority
CREATE OR REPLACE FUNCTION update_company_priority(
  company_id UUID,
  new_priority INTEGER
)
RETURNS VOID AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can update priorities';
  END IF;
  
  UPDATE companies
  SET priority = new_priority, updated_at = NOW()
  WHERE id = company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve/reject collaboration
CREATE OR REPLACE FUNCTION update_collaboration_status(
  submission_id UUID,
  new_status TEXT,
  notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can update submission status';
  END IF;
  
  UPDATE collaborate_submissions
  SET 
    status = new_status,
    admin_notes = notes,
    reviewed_by = auth.uid(),
    reviewed_at = NOW(),
    updated_at = NOW()
  WHERE id = submission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Triggers
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaborate_updated_at
BEFORE UPDATE ON collaborate_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Insert sample admin user (replace with your actual user ID from Supabase)
-- INSERT INTO admin_users (id, email, role)
-- VALUES ('your-user-id-here', 'admin@knitinfo.com', 'super_admin')
-- ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Grant Permissions
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
