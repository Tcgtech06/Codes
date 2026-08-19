const axios = require('axios');

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_API_KEY = "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";

async function testLanguage(language, promptText) {
  const payload = {
    "messages": [
      {
        "role": "system",
        "content": `You are a helpful assistant. Reply strictly in ${language}. Keep the answer to exactly 1 sentence.`
      },
      {
        "role": "user",
        "content": promptText
      }
    ],
    "model": "google/gemma-4-31b-it", // Testing exactly the model name they gave
    "max_tokens": 1024,
    "temperature": 0.7
  };

  try {
    const response = await axios.post(invokeUrl, payload, {
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Accept": "application/json"
      }
    });
    console.log(`\n[${language} Test]`);
    console.log(`Prompt: ${promptText}`);
    console.log(`Response: ${response.data.choices[0].message.content}`);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`\n[${language} Test]`);
      console.log(`Model 'google/gemma-4-31b-it' 404 error. Retrying with 'google/gemma-2-27b-it'...`);
      payload.model = "google/gemma-2-27b-it";
      const response2 = await axios.post(invokeUrl, payload, {
        headers: { "Authorization": `Bearer ${NVIDIA_API_KEY}` }
      });
      console.log(`Prompt: ${promptText}`);
      console.log(`Response: ${response2.data.choices[0].message.content}`);
    } else {
        console.error("Error:", error.message);
    }
  }
}

async function runTests() {
  console.log("Starting Live Terminal Test with Nvidia NIM API (Gemma)...\n");
  
  // 1. Tanglish
  await testLanguage("Tanglish (Tamil with English alphabet)", "Tiruppur la best garment factory edhu?");
  
  // 2. Pure Tamil
  await testLanguage("Tamil (தமிழ்)", "திருப்பூரில் சிறந்த ஸ்பின்னிங் மில் எது?");
  
  // 3. Hindi
  await testLanguage("Hindi (हिंदी)", "Tiruppur me best dying unit konsi hai?");
}

runTests();
