
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI("AIzaSyCqEQ6I8-PxuRKZ_-3h_kAuD7lE2sfpJ9o");

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    try {
        const result = await model.generateContent("Hello AI");
        const response = await result.response;
        console.log(`✅ SUCCESS: ${modelName} is working!`);
        return true;
    } catch (error) {
        console.error(`❌ FAILURE: ${modelName} failed. Error: ${error.message}`);
        return false;
    }
}

async function run() {
    await testModel("gemini-1.5-flash-001");
    await testModel("gemini-1.5-pro-001");
    await testModel("models/gemini-2.5-flash-lite"); // From the list we saw
}

run();
