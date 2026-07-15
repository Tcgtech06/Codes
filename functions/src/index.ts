import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2";
import { onCall } from "firebase-functions/v2/https";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

admin.initializeApp();
const db = admin.firestore();
setGlobalOptions({ maxInstances: 10, region: "us-central1" });

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
});

const FALLBACK_MODELS = [
    "googleai/gemini-flash-latest",
    "googleai/gemini-flash-lite-latest",
    "googleai/gemini-pro-latest"
];

// Define the exact schema the Frontend expects for the Result Container
const CompanySchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  verified: z.boolean(),
  ad: z.boolean(),
  offer: z.string().optional(),
  match: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  products: z.array(z.string())
}));

// Helper function to search companies using AI
async function getCompaniesFromQuery(query: string) {
    const snapshot = await db.collection("companies").limit(100).get();
    const dbRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const contextData = JSON.stringify(dbRecords);

    let resultData = null;
    let success = false;

    for (const model of FALLBACK_MODELS) {
        try {
            const response = await ai.generate({
                model: model,
                prompt: `You are the AI assistant for 'Tiruppur AI'. 
                The user is asking: "${query}".
                
                Here is the raw database of companies from our Excel upload:
                ${contextData}
                
                Find the most relevant companies from the database that match the user's request. 
                Format the output strictly as a JSON array matching the provided schema. 
                - If fields are missing in the DB, set reasonable defaults.
                - For 'products', extract the category or products from the raw data.
                - For 'match', provide a percentage string like '95%'.
                - If you cannot find any data, return an empty array.`,
                output: { schema: CompanySchema }
            });

            resultData = response.output;
            success = true;
            break;
        } catch (error: any) {
            console.warn(`[Genkit] Model ${model} failed or rate-limited:`, error.message);
        }
    }

    if (!success) {
        throw new Error("AI servers are currently very busy. Please try again in a few seconds.");
    }
    
    return resultData;
}

// Genkit Flow exposed as a Firebase Callable Function
export const searchCompanyAI = onCall(async (request) => {
    const query = request.data?.query;
    
    if (!query) {
        return { error: "Please provide a query." };
    }

    try {
        const resultData = await getCompaniesFromQuery(query);
        return { 
            text: `I found ${resultData?.length || 0} matching companies for your request.`,
            results: resultData 
        };
    } catch (e: any) {
        console.error("Function error:", e);
        return { error: "Failed to search database: " + e.message };
    }
});

// Sarvam AI Voice Search Endpoint
export const processVoiceSearch = onCall(async (request) => {
    const audioBase64 = request.data?.audioBase64;
    
    if (!audioBase64) {
        return { error: "Please provide an audio recording." };
    }

    try {
        // 1. Send Audio to Sarvam STT
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const payload = Buffer.concat([
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="audio.m4a"\r\nContent-Type: audio/m4a\r\n\r\n`),
            Buffer.from(audioBase64, 'base64'),
            Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\nsaaras:v1\r\n--${boundary}--`)
        ]);

        // Using native fetch in Node 18+
        const sarvamResponse = await fetch("https://api.sarvam.ai/speech-to-text", {
            method: "POST",
            headers: {
                "api-subscription-key": "sk_e0ozdx05_mfJwd1qPfeCcjOsqNY61esRV",
                "Content-Type": `multipart/form-data; boundary=${boundary}`,
            },
            body: payload
        });

        if (!sarvamResponse.ok) {
            throw new Error(`Sarvam STT failed: ${sarvamResponse.statusText}`);
        }

        const sttData = await sarvamResponse.json();
        const textQuery = sttData.transcript || "";
        
        if (!textQuery) {
            return { error: "Could not understand the audio. Please try again." };
        }

        console.log("Sarvam Extracted Text:", textQuery);

        // 2. Search database using the extracted text (via our shared helper)
        const resultData = await getCompaniesFromQuery(textQuery);
        
        return { 
            text: `(Heard: "${textQuery}") - I found ${resultData?.length || 0} matching companies.`,
            results: resultData 
        };

    } catch (e: any) {
        console.error("processVoiceSearch error:", e);
        return { error: "Voice search failed: " + e.message };
    }
});
