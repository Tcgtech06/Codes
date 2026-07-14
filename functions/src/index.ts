import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2";
import { onCall } from "firebase-functions/v2/https";
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

admin.initializeApp();
setGlobalOptions({ maxInstances: 10, region: "us-central1" });

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
});

// Genkit Flow exposed as a Firebase Callable Function
export const searchCompanyAI = onCall(async (request) => {
    const query = request.data?.query;
    
    if (!query) {
        return { error: "Please provide a query." };
    }

    try {
        // Step 1: Call Gemini using Genkit
        // (In the next step, we will add Firestore Database searching here - RAG)
        const response = await ai.generate({
            model: "google-genai/gemini-1.5-flash",
            prompt: `You are the official AI assistant for 'Tiruppur AI', a B2B platform connecting buyers with garment manufacturers in Tiruppur. 
            The user is asking: "${query}".
            Answer professionally. Let them know you are ready to help them find manufacturers.`,
        });

        return { text: response.text };
    } catch (error: any) {
        console.error("Genkit Error:", error);
        return { error: error.message || "Failed to generate AI response." };
    }
});
