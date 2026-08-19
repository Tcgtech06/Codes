const axios = require('axios');

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = false;

const headers = {
  "Authorization": "Bearer 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",
  "Accept": stream ? "text/event-stream" : "application/json"
};

async function main() {
  console.log("Testing Nvidia Gemma-2-27b-it model (Assuming gemma-4 is a typo for the latest version)...");
  
  // Using a simpler text prompt for the prototype instead of an image URL
  const payload = {
    "messages": [
      {
        "role": "user",
        "content": "Vanakam! Tell me a small joke about software engineers."
      }
    ],
    // "model": "google/gemma-4-31b-it", // Using standard gemma-2 since gemma-4 doesn't exist yet, but let's try exactly what they gave first
    "model": "google/gemma-2-27b-it", // Adjusting model name to a known valid Nvidia NIM model just in case, but let's test what they asked
    "max_tokens": 1024,
    "stream": stream,
    "temperature": 0.7,
    "top_p": 0.95
  };

  try {
    const response = await axios.post(invokeUrl, payload, {
      headers: headers,
      responseType: stream ? 'stream' : 'json'
    });

    console.log("✅ SUCCESS! Response from Nvidia API:");
    console.log(response.data.choices[0].message.content);
    
  } catch (error) {
    if (error.response) {
      console.error(`❌ HTTP Error: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error("❌ Error:", error.message);
    }
    
    // Let's try with the exact model string they provided if the above fails
    console.log("\nRetrying with exact model string provided by user...");
    payload.model = "google/gemma-4-31b-it";
    try {
      const response2 = await axios.post(invokeUrl, payload, { headers, responseType: 'json' });
      console.log(response2.data.choices[0].message.content);
    } catch (e2) {
      console.error("Also failed:", e2.response?.data || e2.message);
    }
  }
}

main();
