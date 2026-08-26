require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/**
 * Generate a subtle interview hint/clue to guide the candidate without spoiling the answer.
 */
async function generateHint(question, skill = "Technical") {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not configured");
        }

        const prompt = `
You are a friendly technical interviewer.
A candidate is stuck on the following question:
"${question}" (Category: ${skill})

Provide a short, encouraging, 1 to 2 sentence hint or thought-provoking guiding question to nudge them in the right direction WITHOUT giving away the complete direct answer.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text?.trim() || "Think about the core data structure or lifecycle method involved and what trade-offs exist.";
    } catch (err) {
        console.warn("Hint generation error:", err.message);
        return "Focus on breaking the problem into core components: inputs, lifecycle transitions, and performance bottlenecks.";
    }
}

module.exports = generateHint;
