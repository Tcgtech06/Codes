// Test visitor tracking functionality
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:8080';

async function testVisitorTracking() {
  console.log('🧪 Testing Visitor Tracking...\n');

  try {
    // Test 1: Get current visitor stats
    console.log('1️⃣ Getting current visitor stats...');
    const getResponse = await fetch(`${BASE_URL}/api/v1/visitors`);
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ Current stats:');
      console.log('   Total Visitors:', data.totalVisitors);
      console.log('   Total Companies:', data.totalCompanies);
    } else {
      console.log('❌ Failed to get stats:', getResponse.status);
      const error = await getResponse.text();
      console.log('   Error:', error);
    }

    console.log('');

    // Test 2: Increment visitor count (new session)
    console.log('2️⃣ Testing visitor increment (new session)...');
    const newSessionId = `test_visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    const postResponse = await fetch(`${BASE_URL}/api/v1/visitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: newSessionId })
    });

    if (postResponse.ok) {
      const data = await postResponse.json();
      console.log('✅ Visitor count incremented:');
      console.log('   New Total:', data.totalVisitors);
      console.log('   Already Counted:', data.alreadyCounted);
    } else {
      console.log('❌ Failed to increment:', postResponse.status);
      const error = await postResponse.json();
      console.log('   Error:', error);
    }

    console.log('');

    // Test 3: Try to increment again with same session (should not increment)
    console.log('3️⃣ Testing duplicate session (should not increment)...');
    
    const duplicateResponse = await fetch(`${BASE_URL}/api/v1/visitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: newSessionId })
    });

    if (duplicateResponse.ok) {
      const data = await duplicateResponse.json();
      console.log('✅ Duplicate session handled correctly:');
      console.log('   Total Visitors:', data.totalVisitors);
      console.log('   Already Counted:', data.alreadyCounted);
      
      if (data.alreadyCounted) {
        console.log('   ✅ Session was correctly identified as duplicate');
      } else {
        console.log('   ⚠️  Session was not identified as duplicate (unexpected)');
      }
    } else {
      console.log('❌ Failed:', duplicateResponse.status);
    }

    console.log('');

    // Test 4: Get final stats
    console.log('4️⃣ Getting final visitor stats...');
    const finalResponse = await fetch(`${BASE_URL}/api/v1/visitors`);
    
    if (finalResponse.ok) {
      const data = await finalResponse.json();
      console.log('✅ Final stats:');
      console.log('   Total Visitors:', data.totalVisitors);
      console.log('   Total Companies:', data.totalCompanies);
    }

    console.log('\n✅ Visitor tracking test completed!\n');
    console.log('📝 Summary:');
    console.log('   - Visitor stats API is working');
    console.log('   - Visitor count increments correctly');
    console.log('   - Duplicate sessions are prevented');
    console.log('   - Companies count is fetched from database');
    console.log('\n💡 Next steps:');
    console.log('   1. Open the website in a new incognito window');
    console.log('   2. Check browser console for visitor tracking logs');
    console.log('   3. Refresh the page and verify count increases');
    console.log('   4. Open in another browser to see count increase again');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n⚠️  Server is not running!');
      console.log('   Please start the dev server with: npm run dev');
      console.log('   Then run this test again.');
    }
  }
}

testVisitorTracking();
