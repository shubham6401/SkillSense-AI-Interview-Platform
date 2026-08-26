require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

function cleanJsonText(text) {
    if (!text) return "";
    let cleaned = text.trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return jsonMatch[0];
    }
    cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();
    return cleaned;
}

async function evaluateAnswer(question, answer, skill = "Technical") {
    // If empty answer, fast return
    if (!answer || answer.trim().length === 0) {
        return {
            score: 0,
            strengths: [],
            improvements: ["No answer was submitted for this question."],
            modelAnswer: "An ideal response covers core conceptual definitions, practical trade-offs, and implementation details.",
        };
    }

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not configured");
        }

        const prompt = `Evaluate candidate response for a ${skill} interview question.
Q: "${question}"
A: "${answer}"

Return ONLY JSON:
{
  "score": 8.0,
  "strengths": ["Clear definition", "Mentioned performance"],
  "improvements": ["Elaborate on edge cases"],
  "modelAnswer": "A comprehensive answer covers..."
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                maxOutputTokens: 350,
                temperature: 0.3,
            }
        });

        const rawText = response.text || "";
        const cleaned = cleanJsonText(rawText);
        const result = JSON.parse(cleaned);

        return {
            score: typeof result.score === "number" ? Math.min(10, Math.max(0, result.score)) : 6.5,
            strengths: Array.isArray(result.strengths) ? result.strengths.slice(0, 2) : ["Demonstrated familiarity with the topic."],
            improvements: Array.isArray(result.improvements) ? result.improvements.slice(0, 2) : ["Add more technical depth."],
            modelAnswer: result.modelAnswer || "A complete response covers core principles, syntax, and performance considerations."
        };
    } catch (err) {
        console.warn("Rapid Evaluation fallback:", err.message);
        const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
        let score = wordCount > 25 ? 7.5 : wordCount > 10 ? 5.5 : 3.0;

        return {
            score,
            strengths: wordCount > 10 ? ["Addressed the question context."] : ["Submitted a brief response."],
            improvements: ["Elaborate further with specific examples and architecture trade-offs."],
            modelAnswer: "An ideal answer covers the theoretical mechanism, edge cases, and best practices."
        };
    }
}

module.exports = evaluateAnswer;
