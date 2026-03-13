// Script to check and fix products column in Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndFixProductsColumn() {
  console.log('🔍 Checking products column in companies table...\n');

  try {
    // Step 1: Check current schema
    console.log('Step 1: Checking current data...');
    const { data: companies, error: fetchError } = await supabase
      .from('companies')
      .select('id, company_name, products')
      .limit(5);

    if (fetchError) {
      console.error('❌ Error fetching companies:', fetchError);
      return;
    }

    console.log('✅ Found', companies?.length || 0, 'companies');
    console.log('Sample company:', companies?.[0]);
    console.log('Products value:', companies?.[0]?.products);
    console.log('Products type:', typeof companies?.[0]?.products);
    console.log('Is array?:', Array.isArray(companies?.[0]?.products));
    console.log('');

    // Step 2: Try to insert a test company with products
    console.log('Step 2: Testing products insert...');
    const testProducts = ['Test Product 1', 'Test Product 2', 'Test Product 3'];
    
    const { data: testCompany, error: insertError } = await supabase
      .from('companies')
      .insert([{
        company_name: 'TEST_COMPANY_DELETE_ME',
        category: 'Yarn',
        products: testProducts,
        status: 'active',
        contact_person: 'Test',
        phone: '1234567890',
        email: 'test@test.com',
        address: 'Test Address',
        description: 'Test Description' // Added required field
      }])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error inserting test company:', insertError);
      console.log('\n⚠️  Products column might not support arrays!');
      console.log('You need to run this SQL in Supabase dashboard:');
      console.log(`
ALTER TABLE companies 
ALTER COLUMN products TYPE text[] 
USING CASE 
    WHEN products IS NULL THEN '{}'::text[]
    ELSE ARRAY[products::text]
END;

ALTER TABLE companies 
ALTER COLUMN products SET DEFAULT '{}';
      `);
      return;
    }

    console.log('✅ Test company inserted successfully!');
    console.log('Test company products:', testCompany.products);
    console.log('');

    // Step 3: Verify the test company
    console.log('Step 3: Verifying test company...');
    const { data: verifyCompany, error: verifyError } = await supabase
      .from('companies')
      .select('*')
      .eq('company_name', 'TEST_COMPANY_DELETE_ME')
      .single();

    if (verifyError) {
      console.error('❌ Error verifying:', verifyError);
      return;
    }

    console.log('✅ Verified! Products:', verifyCompany.products);
    console.log('Products is array?:', Array.isArray(verifyCompany.products));
    console.log('Products length:', verifyCompany.products?.length);
    console.log('');

    // Step 4: Clean up test company
    console.log('Step 4: Cleaning up test company...');
    const { error: deleteError } = await supabase
      .from('companies')
      .delete()
      .eq('company_name', 'TEST_COMPANY_DELETE_ME');

    if (deleteError) {
      console.error('❌ Error deleting test company:', deleteError);
      console.log('⚠️  Please manually delete the test company from Supabase dashboard');
    } else {
      console.log('✅ Test company deleted');
    }

    console.log('\n✅ Products column is working correctly!');
    console.log('The issue might be in the Excel upload process.');
    console.log('Check the admin dashboard console when uploading Excel files.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the check
checkAndFixProductsColumn();
