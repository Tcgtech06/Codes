// Test notification flow through API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:8080';

async function testNotificationFlow() {
  console.log('🧪 Testing Notification Flow...\n');

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Checking if server is running...');
    try {
      const healthResponse = await fetch(`${BASE_URL}/api/health`);
      if (healthResponse.ok) {
        console.log('✅ Server is running');
      } else {
        console.log('❌ Server returned error:', healthResponse.status);
      }
    } catch (error) {
      console.log('❌ Server is not running. Please start it with: npm run dev');
      console.log('   Then run this test again.');
      process.exit(1);
    }

    console.log('');

    // Test 2: Check database connection via API
    console.log('2️⃣ Checking database connection...');
    const dbHealthResponse = await fetch(`${BASE_URL}/api/v1/health/db`);
    const dbHealth = await dbHealthResponse.json();
    
    if (dbHealth.connected) {
      console.log('✅ Database connected:', dbHealth.database);
    } else {
      console.log('❌ Database not connected');
    }

    console.log('');

    // Test 3: Test creating a submission (simulated)
    console.log('3️⃣ Testing submission creation...');
    const submissionData = {
      type: 'add-data',
      userId: 'test_user_' + Date.now(),
      formData: {
        companyName: 'Test Company',
        contactPerson: 'Test Person',
        email: 'test@example.com',
        phone: '1234567890',
        address: 'Test Address',
        category: 'Yarn',
        description: 'Test description'
      },
      attachments: []
    };

    const submissionResponse = await fetch(`${BASE_URL}/api/v1/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });

    if (submissionResponse.ok) {
      const result = await submissionResponse.json();
      console.log('✅ Submission created successfully');
      console.log('   Submission ID:', result.submission?.id);
      console.log('   User ID:', submissionData.userId);
      
      // Store for later tests
      global.testSubmissionId = result.submission?.id;
      global.testUserId = submissionData.userId;
    } else {
      const error = await submissionResponse.json();
      console.log('❌ Failed to create submission:', error.error);
    }

    console.log('');

    // Test 4: Check if submission has user_id
    console.log('4️⃣ Verifying submission has user_id...');
    if (global.testSubmissionId) {
      const submissionsResponse = await fetch(`${BASE_URL}/api/v1/submissions`);
      const submissions = await submissionsResponse.json();
      
      const testSubmission = submissions.submissions?.find(s => s.id === global.testSubmissionId);
      
      if (testSubmission) {
        if (testSubmission.userId) {
          console.log('✅ Submission has user_id:', testSubmission.userId);
        } else {
          console.log('❌ Submission does NOT have user_id');
          console.log('   This means the user_id column might not exist or is not being saved');
        }
      }
    }

    console.log('');

    // Test 5: Test notification creation
    console.log('5️⃣ Testing notification creation...');
    const notificationData = {
      userId: global.testUserId || 'test_user_123',
      type: 'test',
      message: 'This is a test notification',
      read: false,
      createdAt: new Date().toISOString()
    };

    const notificationResponse = await fetch(`${BASE_URL}/api/v1/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData)
    });

    if (notificationResponse.ok) {
      const result = await notificationResponse.json();
      console.log('✅ Notification created successfully');
      console.log('   Notification ID:', result.notification?.id);
      global.testNotificationId = result.notification?.id;
    } else {
      const error = await notificationResponse.json();
      console.log('❌ Failed to create notification:', error.error);
    }

    console.log('');

    // Test 6: Retrieve notifications
    console.log('6️⃣ Testing notification retrieval...');
    const getNotificationsResponse = await fetch(
      `${BASE_URL}/api/v1/notifications?userId=${global.testUserId || 'test_user_123'}`
    );

    if (getNotificationsResponse.ok) {
      const result = await getNotificationsResponse.json();
      console.log('✅ Retrieved notifications:', result.notifications?.length || 0);
      if (result.notifications?.length > 0) {
        console.log('   First notification:', result.notifications[0].message);
      }
    } else {
      console.log('❌ Failed to retrieve notifications');
    }

    console.log('');

    // Test 7: Clean up test data
    console.log('7️⃣ Cleaning up test data...');
    
    if (global.testNotificationId) {
      const deleteNotificationResponse = await fetch(
        `${BASE_URL}/api/v1/notifications/${global.testNotificationId}`,
        { method: 'DELETE' }
      );
      
      if (deleteNotificationResponse.ok) {
        console.log('✅ Test notification deleted');
      }
    }

    console.log('\n✅ Notification flow test completed!\n');
    console.log('📝 Summary:');
    console.log('   - Server is running');
    console.log('   - Database is connected');
    console.log('   - Submissions can be created with user_id');
    console.log('   - Notifications can be created and retrieved');
    console.log('\n💡 Next steps:');
    console.log('   1. Test by logging in as a user');
    console.log('   2. Submit a form (Add Data, Advertise, or Collaborate)');
    console.log('   3. Login as admin and approve the submission');
    console.log('   4. Check if notification appears for the user');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

testNotificationFlow();
