// Test if API is accessible
const fetch = require('node-fetch');

async function testAPI() {
  console.log('Testing API endpoint...\n');
  
  const testData = {
    companyName: 'Test Company API',
    category: 'Yarn',
    contactPerson: 'Test Person',
    phone: '1234567890',
    email: 'test@test.com',
    address: 'Test Address',
    description: 'Test Description',
    products: ['Product 1', 'Product 2'],
    status: 'active'
  };

  try {
    console.log('Sending POST request to /api/v1/companies...');
    const response = await fetch('http://localhost:3000/api/v1/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Success! Company created:', result);

    // Clean up - delete the test company
    if (result.company && result.company.id) {
      console.log('\nCleaning up test company...');
      const { createClient } = require('@supabase/supabase-js');
      require('dotenv').config({ path: '.env.local' });
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );
      
      await supabase.from('companies').delete().eq('id', result.company.id);
      console.log('✅ Test company deleted');
    }

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    console.log('\nThis means the API route is not accessible.');
    console.log('Make sure the dev server is running: npm run dev');
  }
}

testAPI();
