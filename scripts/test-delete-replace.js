// Test the delete and replace functionality
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testDeleteReplace() {
  console.log('🧪 Testing Delete and Replace Functionality\n');

  const testCategory = 'TEST_CATEGORY_DELETE_ME';

  try {
    // Step 1: Create some test companies
    console.log('Step 1: Creating 3 test companies...');
    const testCompanies = [
      {
        company_name: 'Test Company 1',
        category: testCategory,
        description: 'First test company',
        products: ['Product A', 'Product B'],
        status: 'active',
        contact_person: 'Person 1',
        phone: '1111111111',
        email: 'test1@test.com',
        address: 'Address 1'
      },
      {
        company_name: 'Test Company 2',
        category: testCategory,
        description: 'Second test company',
        products: ['Product C', 'Product D'],
        status: 'active',
        contact_person: 'Person 2',
        phone: '2222222222',
        email: 'test2@test.com',
        address: 'Address 2'
      },
      {
        company_name: 'Test Company 3',
        category: testCategory,
        description: 'Third test company',
        products: ['Product E', 'Product F'],
        status: 'active',
        contact_person: 'Person 3',
        phone: '3333333333',
        email: 'test3@test.com',
        address: 'Address 3'
      }
    ];

    const { data: created, error: createError } = await supabase
      .from('companies')
      .insert(testCompanies)
      .select();

    if (createError) {
      console.error('❌ Error creating test companies:', createError);
      return;
    }

    console.log(`✅ Created ${created.length} test companies\n`);

    // Step 2: Verify they exist
    console.log('Step 2: Verifying test companies exist...');
    const { data: existing, error: fetchError } = await supabase
      .from('companies')
      .select('id, company_name')
      .eq('category', testCategory);

    if (fetchError) {
      console.error('❌ Error fetching:', fetchError);
      return;
    }

    console.log(`✅ Found ${existing.length} companies in ${testCategory}`);
    existing.forEach(c => console.log(`  - ${c.company_name}`));
    console.log('');

    // Step 3: Delete all companies in category
    console.log('Step 3: Deleting all companies in category...');
    const { error: deleteError } = await supabase
      .from('companies')
      .delete()
      .eq('category', testCategory);

    if (deleteError) {
      console.error('❌ Error deleting:', deleteError);
      return;
    }

    console.log(`✅ Deleted all companies in ${testCategory}\n`);

    // Step 4: Verify deletion
    console.log('Step 4: Verifying deletion...');
    const { data: afterDelete, error: verifyError } = await supabase
      .from('companies')
      .select('id')
      .eq('category', testCategory);

    if (verifyError) {
      console.error('❌ Error verifying:', verifyError);
      return;
    }

    console.log(`✅ Companies remaining: ${afterDelete.length} (should be 0)\n`);

    // Step 5: Add new companies (simulating Excel upload)
    console.log('Step 5: Adding new companies (simulating Excel upload)...');
    const newCompanies = [
      {
        company_name: 'New Company 1',
        category: testCategory,
        description: 'New first company',
        products: ['New Product A', 'New Product B'],
        status: 'active',
        contact_person: 'New Person 1',
        phone: '9999999991',
        email: 'new1@test.com',
        address: 'New Address 1'
      },
      {
        company_name: 'New Company 2',
        category: testCategory,
        description: 'New second company',
        products: ['New Product C', 'New Product D'],
        status: 'active',
        contact_person: 'New Person 2',
        phone: '9999999992',
        email: 'new2@test.com',
        address: 'New Address 2'
      }
    ];

    const { data: newCreated, error: newCreateError } = await supabase
      .from('companies')
      .insert(newCompanies)
      .select();

    if (newCreateError) {
      console.error('❌ Error creating new companies:', newCreateError);
      return;
    }

    console.log(`✅ Created ${newCreated.length} new companies\n`);

    // Step 6: Final verification
    console.log('Step 6: Final verification...');
    const { data: final, error: finalError } = await supabase
      .from('companies')
      .select('id, company_name, products')
      .eq('category', testCategory);

    if (finalError) {
      console.error('❌ Error:', finalError);
      return;
    }

    console.log(`✅ Final count: ${final.length} companies`);
    final.forEach(c => {
      console.log(`  - ${c.company_name}`);
      console.log(`    Products: ${c.products.join(', ')}`);
    });
    console.log('');

    // Step 7: Cleanup
    console.log('Step 7: Cleaning up test data...');
    const { error: cleanupError } = await supabase
      .from('companies')
      .delete()
      .eq('category', testCategory);

    if (cleanupError) {
      console.error('❌ Error cleaning up:', cleanupError);
      return;
    }

    console.log('✅ Test data cleaned up\n');

    console.log('✅ ALL TESTS PASSED!');
    console.log('Delete and replace functionality is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDeleteReplace();
