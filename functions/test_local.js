const axios = require('axios');

async function test(query, language) {
  try {
    const res = await axios.post("http://localhost:5001/tirupur-ai/us-central1/searchCompanyAI", {
      data: { query, language }
    });
    console.log(`\n======================================`);
    console.log(`Query: ${query} (${language})`);
    if (res.data.result.error) {
        console.error("Error:", res.data.result.error);
    } else {
        console.log("AI Text Response:\n", res.data.result.text);
        console.log("DB Results Found:", res.data.result.results.length);
        if (res.data.result.results.length > 0) {
             console.log("Top Result:", res.data.result.results[0].name);
        }
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}

async function run() {
  console.log("Testing Nvidia Gemma Model via Local Emulator...");
  await test("Tiruppur la nalla garment company edhu?", "TG"); // Tanglish
  await test("திருப்பூரில் சிறந்த ஸ்பின்னிங் மில் எது?", "TA"); // Pure Tamil
  await test("Tiruppur me best dying unit konsi hai?", "HI"); // Hindi
}
run();
