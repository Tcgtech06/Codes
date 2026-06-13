// Test script to verify database schema
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseSchema() {
  console.log('🔍 Testing Database Schema...\n');

  try {
    // Test 1: Check form_submissions table structure
    console.log('1️⃣ Checking form_submissions table...');
    const { data: submissions, error: submissionsError } = await supabase
      .from('form_submissions')
      .select('*')
      .limit(1);

    if (submissionsError) {
      console.error('❌ Error querying form_submissions:', submissionsError.message);
    } else {
      console.log('✅ form_submissions table exists');
      if (submissions && submissions.length > 0) {
        const columns = Object.keys(submissions[0]);
        console.log('   Columns:', columns.join(', '));
        if (columns.includes('user_id')) {
          console.log('   ✅ user_id column exists!');
        } else {
          console.log('   ❌ user_id column NOT FOUND!');
        }
      } else {
        console.log('   ℹ️  Table is empty, checking with insert test...');
        
        // Try to insert a test record to see if user_id column exists
        const testData = {
          type: 'add-data',
          user_id: 'test_user_123',
          form_data: { test: true },
          attachments: [],
          status: 'pending'
        };
        
        const { error: insertError } = await supabase
          .from('form_submissions')
          .insert([testData])
          .select();
        
        if (insertError) {
          if (insertError.message.includes('user_id')) {
            console.log('   ❌ user_id column does NOT exist');
            console.log('   Error:', insertError.message);
          } else {
            console.log('   ⚠️  Insert error:', insertError.message);
          }
        } else {
          console.log('   ✅ user_id column exists and accepts data!');
          // Clean up test data
          await supabase
            .from('form_submissions')
            .delete()
            .eq('user_id', 'test_user_123');
          console.log('   🧹 Test data cleaned up');
        }
      }
    }

    console.log('');

    // Test 2: Check notifications table structure
    console.log('2️⃣ Checking notifications table...');
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .limit(1);

    if (notificationsError) {
      console.error('❌ Error querying notifications:', notificationsError.message);
    } else {
      console.log('✅ notifications table exists');
      if (notifications && notifications.length > 0) {
        const columns = Object.keys(notifications[0]);
        console.log('   Columns:', columns.join(', '));
      } else {
        console.log('   ℹ️  Table is empty');
      }
    }

    console.log('');

    // Test 3: Check database connection
    console.log('3️⃣ Testing database connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('form_submissions')
      .select('count')
      .limit(1);

    if (healthError) {
      console.error('❌ Database connection failed:', healthError.message);
    } else {
      console.log('✅ Database connection successful');
    }

    console.log('');

    // Test 4: Count existing data
    console.log('4️⃣ Counting existing data...');
    
    const { count: submissionsCount } = await supabase
      .from('form_submissions')
      .select('*', { count: 'exact', head: true });
    
    const { count: notificationsCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true });

    console.log(`   📊 form_submissions: ${submissionsCount || 0} records`);
    console.log(`   📊 notifications: ${notificationsCount || 0} records`);

    console.log('\n✅ Database schema test completed!\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

testDatabaseSchema();
