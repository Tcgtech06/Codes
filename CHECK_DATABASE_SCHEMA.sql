-- Run this in Supabase SQL Editor to check the products column type

-- Check the companies table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'companies' 
AND column_name = 'products';

-- Check if products column exists and its type
SELECT 
    table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'companies';

-- If products column doesn't exist or is wrong type, run this:
-- ALTER TABLE companies ADD COLUMN IF NOT EXISTS products text[] DEFAULT '{}';

-- Or if it exists but is wrong type:
-- ALTER TABLE companies ALTER COLUMN products TYPE text[] USING products::text[];
-- ALTER TABLE companies ALTER COLUMN products SET DEFAULT '{}';
