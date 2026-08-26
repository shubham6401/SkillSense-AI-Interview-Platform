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

async function generateReportFeedback(answers = []) {
    try {
        if (!process.env.GEMINI_API_KEY || answers.length === 0) {
            throw new Error("Cannot generate AI feedback: missing API key or no answers");
        }

        const simplifiedAnswers = answers.map((a) => ({
            question: a.question,
            skill: a.skill,
            score: a.score,
            strengths: a.strengths,
            improvements: a.improvements,
        }));

        const prompt = `
Analyze the candidate's complete performance across these mock interview questions:
${JSON.stringify(simplifiedAnswers, null, 2)}

Provide:
1. "overallAssessment": A cohesive 2-4 sentence executive summary highlighting candidate's technical breadth, articulation, and problem-solving level.
2. "recommendation": A high-impact 2-3 sentence recommendation detailing specific next steps, concepts to master, and mock interview practice areas.

Return ONLY valid JSON in this format:
{
    "overallAssessment": "...",
    "recommendation": "..."
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const rawText = response.text || "";
        const cleaned = cleanJsonText(rawText);
        const result = JSON.parse(cleaned);

        return {
            overallAssessment: result.overallAssessment || "Solid performance across technical domains with opportunities to deepen knowledge in advanced topics.",
            recommendation: result.recommendation || "Focus on practicing clear architectural explanations and providing concrete code examples during technical discussions.",
        };
    } catch (err) {
        console.warn("AI Report Feedback generation error:", err.message);

        const avg = answers.length > 0
            ? answers.reduce((acc, a) => acc + (a.score || 0), 0) / answers.length
            : 0;

        let overallAssessment = "You demonstrated fundamental awareness of the technical topics with clear communication.";
        let recommendation = "Review core principles, practice explaining system design trade-offs, and conduct regular mock interviews.";

        if (avg >= 8) {
            overallAssessment = "Excellent technical understanding and articulation across all assessed topics. High candidate readiness for technical placement rounds.";
            recommendation = "Continue refining edge cases and system design scalability questions to excel in senior-level interviews.";
        } else if (avg < 5) {
            overallAssessment = "Foundational technical knowledge present, but answers lacked specific architectural details and standard technical terminology.";
            recommendation = "Revisit core documentation for your main programming languages and practice structured answers using the STAR method.";
        }

        return {
            overallAssessment,
            recommendation,
        };
    }
}

module.exports = generateReportFeedback;