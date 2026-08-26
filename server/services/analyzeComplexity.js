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

/**
 * Analyze candidate code for Big-O Time and Space Complexity using Gemini AI
 */
async function analyzeComplexity({ code, language = "python", problem = "Technical Problem" }) {
    if (!code || code.trim().length === 0) {
        return {
            timeComplexity: "O(1)",
            timeDerivation: "No algorithm code submitted.",
            spaceComplexity: "O(1)",
            spaceDerivation: "No auxiliary memory allocated.",
            bottlenecks: ["Empty implementation."],
            optimalComplexity: "O(N) Time, O(1) Space",
            cleanCodeRating: 0,
            summary: "Please write an algorithmic implementation to perform Big-O analysis.",
        };
    }

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not configured");
        }

        const prompt = `You are a Principal Staff Engineer and Algorithms Expert conducting a technical interview at Google.
Analyze the following ${language} algorithm written for the problem: "${problem}".

Source Code:
\`\`\`${language}
${code}
\`\`\`

Perform an in-depth Big-O Complexity and Algorithm Quality Analysis.
Return ONLY valid JSON matching this exact structure:
{
  "timeComplexity": "O(N log N)",
  "timeDerivation": "Detailed step-by-step mathematical derivation of time complexity",
  "spaceComplexity": "O(N)",
  "spaceDerivation": "Auxiliary space breakdown (call stack, data structures)",
  "bottlenecks": [
    "Identified algorithmic bottlenecks or quadratic loops",
    "Memory allocation concerns"
  ],
  "optimalComplexity": "O(N) Time, O(1) Space",
  "cleanCodeRating": 9.0,
  "summary": "Concise 2-sentence executive summary of code quality and scalability"
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                maxOutputTokens: 600,
                temperature: 0.2,
            }
        });

        const rawText = response.text || "";
        const cleaned = cleanJsonText(rawText);
        const parsed = JSON.parse(cleaned);

        return {
            timeComplexity: parsed.timeComplexity || "O(N)",
            timeDerivation: parsed.timeDerivation || "Linear scan across input elements.",
            spaceComplexity: parsed.spaceComplexity || "O(1)",
            spaceDerivation: parsed.spaceDerivation || "Constant auxiliary memory.",
            bottlenecks: Array.isArray(parsed.bottlenecks) ? parsed.bottlenecks : ["None detected."],
            optimalComplexity: parsed.optimalComplexity || "O(N) Time, O(1) Space",
            cleanCodeRating: typeof parsed.cleanCodeRating === "number" ? parsed.cleanCodeRating : 8.5,
            summary: parsed.summary || "Algorithm is functionally sound and demonstrates clean asymptotic efficiency.",
        };
    } catch (err) {
        console.warn("AI Complexity Analysis fallback:", err.message);

        // Fallback heuristic estimation
        const hasNestedLoops = /for.*for|while.*while|for.*while/s.test(code);
        const hasSort = /\.sort|sorted|Arrays\.sort|std::sort/.test(code);

        return {
            timeComplexity: hasNestedLoops ? "O(N²)" : hasSort ? "O(N log N)" : "O(N)",
            timeDerivation: hasNestedLoops
                ? "Nested iterations detected across the input dataset."
                : hasSort
                ? "Sorting step dominates the asymptotic execution time."
                : "Single sequential pass over data.",
            spaceComplexity: /new Map|new Set|dict|list|\{\}|\[\]/.test(code) ? "O(N)" : "O(1)",
            spaceDerivation: "Auxiliary hash/array allocation for tracking visited state.",
            bottlenecks: hasNestedLoops ? ["Quadratic nested loops might cause TLE on large constraints (N > 10^5)."] : ["Ensure edge cases (empty inputs, duplicates) are covered."],
            optimalComplexity: "O(N) Time, O(1) Space",
            cleanCodeRating: 8.0,
            summary: "Algorithm implementation is clear with solid foundational complexity.",
        };
    }
}

module.exports = analyzeComplexity;
