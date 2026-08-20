const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testSarvam() {
    console.log("Downloading sample audio file for Sarvam STT test...");
    
    // Download a sample Tamil audio file or any generic audio file
    const audioUrl = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"; // Just a beep to test if API accepts it
    
    try {
        const audioRes = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(audioRes.data, 'binary');
        
        console.log("Audio downloaded. Sending to Sarvam AI...");

        const form = new FormData();
        form.append('file', buffer, { filename: 'audio.ogg', contentType: 'audio/ogg' });
        form.append('model', 'saaras:v3');
        form.append('language_code', 'ta-IN');

        const sarvamResponse = await axios.post("https://api.sarvam.ai/speech-to-text", form, {
            headers: {
                ...form.getHeaders(),
                "api-subscription-key": "sk_e0ozdx05_mfJwd1qPfeCcjOsqNY61esRV"
            }
        });

        console.log("✅ SARVAM API RESPONSE:");
        console.log(sarvamResponse.data);
    } catch (e) {
        if (e.response) {
            console.error("❌ SARVAM API FAILED:", e.response.status, e.response.data);
        } else {
            console.error("❌ ERROR:", e.message);
        }
    }
}

testSarvam();
