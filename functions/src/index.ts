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

// Genkit Flow exposed as a Firebase Callable Function
export const searchCompanyAI = onCall(async (request) => {
    const query = request.data?.query;
    
    if (!query) {
        return { error: "Please provide a query." };
    }

    try {
        // Step 1: Retrieval (RAG) - Fetch companies from Firestore Database
        // For now, we fetch a batch of companies to filter via AI. 
        // (In production with 10k+ rows, we would use Firebase Vector Search here)
        const snapshot = await db.collection("companies").limit(100).get();
        const dbRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const contextData = JSON.stringify(dbRecords);

        let resultData = null;
        let success = false;

        // Smart Fallback Loop: If one model hits rate limit, it automatically tries the next one.
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
                break; // Success! Exit the loop.
            } catch (error: any) {
                console.warn(`[Genkit] Model ${model} failed or rate-limited:`, error.message);
            }
        }

        if (!success) {
            console.error("[Genkit] ALL models failed or exhausted.");
            return { error: "AI servers are currently very busy. Please try again in a few seconds." };
        }

        // Return both the AI text response and the structured array of companies
        return { 
            text: `I found ${resultData?.length || 0} matching companies for your request.`,
            results: resultData 
        };
    } catch (e: any) {
        console.error("Function error:", e);
        return { error: "Failed to search database: " + e.message };
    }
});
