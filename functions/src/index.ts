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
const CompanySchema = z.object({
  text: z.string().describe("A SHORT, conversational Tanglish response. Give a 1-sentence summary, then a short, highly contextual follow-up question based on their search (e.g., 'Neenga keta knitted garments ivanga thaan. Ungaluku Dyeing or manufacturer list venuma?'). Do NOT greet repeatedly."),
  results: z.array(z.object({
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
  }))
});

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
                prompt: `You are the AI assistant for 'Tiruppur AI', a platform connecting people with companies in Tiruppur. 
                The user is asking: "${query}".
                
                Here is the raw database of companies:
                ${contextData}
                
                Guidelines:
                1. If the user says a casual greeting (like "hi ena panra"), reply casually in Tanglish. DO NOT say "Vanakam" or "Hello" repeatedly in every message. Only greet if the user explicitly greets you first.
                2. If they search for something, find the matching companies and return them in the 'results' array.
                3. In the 'text' field, keep the response SHORT and SWEET. (e.g., "Neenga ketta knitting companies ivanga thaan.").
                4. VERY IMPORTANT: ALWAYS end your 'text' response with a highly contextual, short follow-up question. Think of the natural next step in the Tiruppur textile supply chain! (e.g., If they search 'Garments', ask "Ungaluku Dyeing or manufacturer list venuma?").
                
                Format the output strictly matching the provided JSON schema.`,
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
export const searchCompanyAI = onCall({ cors: true }, async (request) => {
    const query = request.data?.query;
    
    if (!query) {
        return { error: "Please provide a query." };
    }

    try {
        const responseData = await getCompaniesFromQuery(query) as any;
        return { 
            text: responseData?.text || `I found ${responseData?.results?.length || 0} matching companies for your request.`,
            results: responseData?.results || [] 
        };
    } catch (e: any) {
        console.error("Function error:", e);
        return { error: "Failed to search database: " + e.message };
    }
});

// Sarvam AI Voice Search Endpoint
export const processVoiceSearch = onCall({ cors: true }, async (request) => {
    const audioBase64 = request.data?.audioBase64;
    
    if (!audioBase64) {
        return { error: "Please provide an audio recording." };
    }

    try {
        // 1. Send Audio to Sarvam STT
        const audioBuffer = Buffer.from(audioBase64, 'base64');
        const blob = new Blob([audioBuffer], { type: 'audio/wav' });
        
        const formData = new FormData();
        formData.append("file", blob, "audio.wav");
        formData.append("model", "saaras:v3");
        // Sarvam STT needs language_code. ta-IN is Tamil
        formData.append("language_code", "ta-IN"); 

        const sarvamResponse = await fetch("https://api.sarvam.ai/speech-to-text", {
            method: "POST",
            headers: {
                "api-subscription-key": "sk_e0ozdx05_mfJwd1qPfeCcjOsqNY61esRV"
                // Do NOT set Content-Type manually when using FormData in fetch, it will auto-set the boundary
            },
            body: formData as any
        });

        if (!sarvamResponse.ok) {
            const errText = await sarvamResponse.text();
            throw new Error(`Sarvam STT failed: ${sarvamResponse.statusText} - ${errText}`);
        }

        const sttData = await sarvamResponse.json();
        const textQuery = sttData.transcript || "";
        
        if (!textQuery) {
            return { error: "Could not understand the audio. Please try again." };
        }

        console.log("Sarvam Extracted Text:", textQuery);

        // 2. Search database using the extracted text (via our shared helper)
        const responseData = await getCompaniesFromQuery(textQuery) as any;
        
        return { 
            text: responseData?.text || `(Heard: "${textQuery}") - I found ${responseData?.results?.length || 0} matching companies.`,
            results: responseData?.results || [] 
        };

    } catch (e: any) {
        console.error("processVoiceSearch error:", e);
        return { error: "Voice search failed: " + e.message };
    }
});
