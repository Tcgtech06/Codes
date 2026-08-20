const axios = require('axios');

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_API_KEY = "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";

async function makeRequest(i) {
  const payload = {
    "messages": [
      { "role": "user", "content": `Say a short greeting for user ${i}` }
    ],
    "model": "google/gemma-4-31b-it", 
    "max_tokens": 50
  };

  try {
    const startTime = Date.now();
    const response = await axios.post(invokeUrl, payload, {
      headers: { "Authorization": `Bearer ${NVIDIA_API_KEY}` }
    });
    console.log(`✅ Req ${i}: SUCCESS in ${Date.now() - startTime}ms`);
    return { success: true };
  } catch (error) {
    console.log(`❌ Req ${i}: FAILED with status ${error.response ? error.response.status : error.message}`);
    if (error.response && error.response.status === 429) {
        console.log(`   -> ⚠️ RATE LIMIT HIT (429)`);
    }
    return { success: false, status: error.response ? error.response.status : 'Network Error' };
  }
}

async function runLoadTest() {
  console.log("🚀 Starting Nvidia API Burst Load Test...");
  console.log("Simulating 30 concurrent users hitting the API at the exact same time...\n");
  
  const promises = [];
  for (let i = 1; i <= 30; i++) {
    promises.push(makeRequest(i));
  }
  
  const results = await Promise.all(promises);
  
  const successes = results.filter(r => r.success).length;
  const failures = results.filter(r => !r.success).length;
  
  console.log("\n📊 TEST RESULTS:");
  console.log(`Total Requests: 30`);
  console.log(`✅ Successful: ${successes}`);
  console.log(`❌ Failed (Rate Limited): ${failures}`);
}

runLoadTest();
