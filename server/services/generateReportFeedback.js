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
            answerSnippet: (a.answer || "").slice(0, 150),
            strengths: a.strengths,
            improvements: a.improvements,
        }));

        const prompt = `You are a Principal Staff Engineer evaluating a technical candidate interview at Google.
Analyze the candidate's complete performance across these questions:
${JSON.stringify(simplifiedAnswers, null, 2)}

Provide a comprehensive feedback report.
Return ONLY valid JSON matching this exact structure:
{
    "overallAssessment": "Cohesive 2-4 sentence executive summary highlighting candidate's technical depth, problem-solving, and communication.",
    "recommendation": "High-impact 2-3 sentence recommendation detailing specific next steps and mastery topics.",
    "keyStrengths": [
        "Concrete technical strength demonstrated in answers",
        "Another strong architectural or problem-solving capability"
    ],
    "criticalWeaknesses": [
        "Specific concept or gap where candidate lacked depth",
        "Actionable technical weakness to address"
    ]
}
`;

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
        const result = JSON.parse(cleaned);

        return {
            overallAssessment: result.overallAssessment || "Solid performance across technical domains with opportunities to deepen knowledge in advanced topics.",
            recommendation: result.recommendation || "Focus on practicing clear architectural explanations and providing concrete code examples during technical discussions.",
            keyStrengths: Array.isArray(result.keyStrengths) && result.keyStrengths.length > 0 ? result.keyStrengths : [
                "Good technical communication and structure in explanations.",
                "Demonstrated solid foundational awareness of core frameworks.",
            ],
            criticalWeaknesses: Array.isArray(result.criticalWeaknesses) && result.criticalWeaknesses.length > 0 ? result.criticalWeaknesses : [
                "Incorporate more edge-case handling and system failure scenarios.",
                "Deepen explanations of underlying runtime mechanisms.",
            ],
        };
    } catch (err) {
        console.warn("AI Report Feedback generation fallback:", err.message);

        // Aggregate strengths and improvements from answer records
        const aggregatedStrengths = [];
        const aggregatedWeaknesses = [];

        for (const a of answers) {
            if (Array.isArray(a.strengths)) {
                aggregatedStrengths.push(...a.strengths);
            }
            if (Array.isArray(a.improvements)) {
                aggregatedWeaknesses.push(...a.improvements);
            }
        }

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
            keyStrengths: aggregatedStrengths.length > 0
                ? [...new Set(aggregatedStrengths)].slice(0, 4)
                : ["Clear structural response format", "Solid foundational syntax and framework familiarity"],
            criticalWeaknesses: aggregatedWeaknesses.length > 0
                ? [...new Set(aggregatedWeaknesses)].slice(0, 4)
                : ["Address distributed edge cases and failure handling", "Incorporate mathematical Big-O analysis in algorithmic answers"],
        };
    }
}

module.exports = generateReportFeedback;