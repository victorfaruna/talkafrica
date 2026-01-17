
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI("AIzaSyCqEQ6I8-PxuRKZ_-3h_kAuD7lE2sfpJ9o");

async function listModels() {
    console.log("Fetching available models...");
    try {
        // The SDK doesn't expose listModels directly in the main class easily in all versions, 
        // but we can try a direct fetch if the SDK fails, or check if the SDK supports it.
        // For this version of @google/generative-ai, we might need to rely on the generic request if listModels isn't explicit 
        // or just try to generate content with a fallback.

        // Actually, looking at the docs, standard way is often just knowing the model. 
        // But let's try a direct REST call if SDK is opaque, using the key.

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCqEQ6I8-PxuRKZ_-3h_kAuD7lE2sfpJ9o');
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
        } else if (data.models) {
            console.log("✅ Models available:");
            data.models.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.log("Unknown response:", data);
        }

    } catch (error) {
        console.error("Network/Script Error:", error.message);
    }
}

listModels();
