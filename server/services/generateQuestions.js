require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const questionBank = require("../utils/questionBank");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

function cleanJsonText(text) {
    if (!text) return "";
    let cleaned = text.trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        return jsonMatch[0];
    }
    cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();
    return cleaned;
}

/**
 * Rapid dynamic question generator optimized for < 1.5s latency
 */
async function generateQuestions(options = {}) {
    const {
        skills = [],
        difficulty = "Mid-Level",
        company = "Tech Company",
        track = "Comprehensive Full-Stack",
        durationMinutes = 20,
        questionCount = 5,
    } = typeof options === "object" && !Array.isArray(options) ? options : { skills: options };

    const candidateSkills = skills && skills.length > 0
        ? skills.slice(0, 8)
        : ["JavaScript", "Problem Solving", "Web Dev", "Databases"];

    // Default question counts: 10m -> 5Q, 20m -> 8Q, 30m -> 10Q, 45m -> 12Q
    let targetCount = Number(questionCount) || 5;
    if (!questionCount) {
        if (durationMinutes <= 10) targetCount = 5;
        else if (durationMinutes <= 20) targetCount = 8;
        else if (durationMinutes <= 30) targetCount = 10;
        else targetCount = 12;
    }
    targetCount = Math.min(12, Math.max(3, targetCount));

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const prompt = `Generate exactly ${targetCount} concise, high-impact technical mock interview questions for a ${difficulty} candidate applying to ${company}.
Skills: ${candidateSkills.join(", ")}
Track: ${track}

Return ONLY valid JSON array with keys "skill" and "question":
[
  {"skill": "React", "question": "Explain reconciliation in React and when to use useMemo."}
]`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                maxOutputTokens: 750,
                temperature: 0.6,
            }
        });

        const rawText = response.text || "";
        const cleanedText = cleanJsonText(rawText);
        const parsed = JSON.parse(cleanedText);

        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.slice(0, targetCount).map((item) => ({
                skill: item.skill || "Technical",
                question: item.question.trim(),
            }));
        }
    } catch (err) {
        console.warn("Rapid Question generation fallback:", err.message);
    }

    // Fallback: Use static questionBank
    let fallbackQuestions = [];
    for (const skill of candidateSkills) {
        for (const key in questionBank) {
            if (skill.toLowerCase() === key.toLowerCase()) {
                fallbackQuestions.push(
                    ...questionBank[key].map((question) => ({
                        skill: key,
                        question: `${question} (${company} Context)`,
                    }))
                );
                break;
            }
        }
    }

    if (fallbackQuestions.length < targetCount) {
        const generic = [
            { skill: candidateSkills[0] || "Architecture", question: `How would you architect a scalable service with ${candidateSkills[0] || "modern software"} at ${company}?` },
            { skill: "Problem Solving", question: "Walk through a high-severity production bug or concurrency bottleneck you resolved." },
            { skill: "System Design", question: `Explain how you would design a rate-limiter and caching strategy for high-traffic endpoints at ${company}.` },
            { skill: "Database Optimization", question: "What are database indexing best practices and how do you resolve slow query execution plans?" },
            { skill: "Clean Code & Testing", question: "How do you structure unit and integration tests to ensure reliable deployments?" },
        ];
        fallbackQuestions.push(...generic);
    }

    const unique = Array.from(new Map(fallbackQuestions.map((q) => [q.question, q])).values());
    return unique.slice(0, targetCount);
}

module.exports = generateQuestions;
