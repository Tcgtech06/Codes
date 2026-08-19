import axios from 'axios';

// Nvidia NIM API configuration
const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_API_KEY = "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";

/**
 * Prototype function to call Nvidia's API for Gemma models
 * @param {string} prompt - The user prompt
 * @param {boolean} stream - Whether to stream the response
 */
export async function generateWithNvidiaGemma(prompt: string, stream = false) {
  const headers = {
    "Authorization": `Bearer ${NVIDIA_API_KEY}`,
    "Accept": stream ? "text/event-stream" : "application/json"
  };

  const payload = {
    "messages": [
      {
        "role": "user",
        "content": [
          { "type": "text", "text": prompt }
        ]
      }
    ],
    // The model string provided by the user (Note: Usually google/gemma-2-27b-it)
    "model": "google/gemma-4-31b-it", 
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

    if (stream) {
      response.data.on('data', (chunk: any) => {
        console.log(chunk.toString());
      });
      return response.data;
    } else {
      console.log(JSON.stringify(response.data));
      return response.data;
    }
  } catch (error: any) {
    if (error.response) {
      console.error(`HTTP Error ${error.response.status}`);
      console.error(error.response.data);
      throw new Error(`Nvidia API Error: ${error.response.status}`);
    } else {
      console.error(error);
      throw error;
    }
  }
}
