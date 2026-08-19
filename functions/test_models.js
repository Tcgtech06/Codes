const { genkit } = require("genkit");
const { googleAI } = require("@genkit-ai/google-genai");
const groq = require("genkitx-groq").default;
const dotenv = require("dotenv");

// Load envs
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const ai = genkit({
  plugins: [googleAI(), groq({ apiKey: process.env.GROQ_API_KEY })],
});

const models = [
    "groq/llama-3.3-70b-versatile",
    "groq/llama-3.1-8b-instant",
    "googleai/gemini-1.5-flash",
    "googleai/gemini-1.5-pro"
];

async function testModels() {
    for (const model of models) {
        try {
            console.log(`\nTesting ${model}...`);
            const response = await ai.generate({
                model: model,
                prompt: "Hello, reply with exactly the word OK"
            });
            console.log(`✅ SUCCESS: ${model} is active and working. Response: ${response.text}`);
        } catch (e) {
            if (e.message.includes("429") || e.message.includes("quota") || e.message.includes("rate")) {
                console.log(`❌ EXHAUSTED: ${model} free limit reached or rate limited: ${e.message}`);
            } else {
                console.log(`❌ ERROR: ${model} encountered an error: ${e.message}`);
            }
        }
    }
}

testModels();
