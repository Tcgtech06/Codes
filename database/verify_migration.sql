-- Verify companies table columns
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'companies' 
  AND column_name IN ('priority', 'is_active', 'created_by', 'updated_by')
ORDER BY column_name;

-- Verify companies table indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'companies' 
  AND indexname IN ('idx_companies_priority', 'idx_companies_active');

-- Verify admin_users table exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admin_users'
ORDER BY ordinal_position;

-- Check sample data from companies (first 3 rows)
SELECT id, company_name, priority, is_active 
FROM companies 
ORDER BY priority 
LIMIT 3;

-- Verify form_submissions table (if you ran that migration too)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'form_submissions'
ORDER BY ordinal_position;

-- Check RLS policies on companies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'companies';

-- Check RLS policies on admin_users
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'admin_users';
