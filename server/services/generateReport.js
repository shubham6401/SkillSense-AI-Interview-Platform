const InterviewSession = require("../models/InterviewSession.js");
const generateReportFeedback = require("../services/generateReportFeedback.js");
const getGrade = require("../utils/getGrade.js");

async function generateReport(sessionId, userId) {
    try {
        const session = await InterviewSession.findOne({
            _id: sessionId,
            userId,
        });

        if (!session) {
            throw new Error("Interview session does not exist");
        }

        const answers = session.answers || [];

        if (answers.length === 0) {
            throw new Error("No answered questions found in this interview session.");
        }

        let totalScore = 0;
        let highestScore = -Infinity;
        let lowestScore = Infinity;
        let bestQuestion = "";
        let weakestQuestion = "";

        let excellentAnswers = 0;
        let goodAnswers = 0;
        let poorAnswers = 0;

        // Compute domain skill performance map
        const skillScoreMap = {};

        for (const item of answers) {
            const score = Number(item.score) || 0;
            totalScore += score;

            // Track per-skill analytics
            const sk = item.skill || "General";
            if (!skillScoreMap[sk]) {
                skillScoreMap[sk] = { total: 0, count: 0 };
            }
            skillScoreMap[sk].total += score;
            skillScoreMap[sk].count++;

            // Best question
            if (score > highestScore) {
                highestScore = score;
                bestQuestion = item.question;
            }

            // Weakest question
            if (score < lowestScore) {
                lowestScore = score;
                weakestQuestion = item.question;
            }

            // Answer quality brackets
            if (score >= 8) {
                excellentAnswers++;
            } else if (score >= 5) {
                goodAnswers++;
            } else {
                poorAnswers++;
            }
        }

        const skillBreakdown = Object.keys(skillScoreMap).map((skillName) => {
            const avg = Number((skillScoreMap[skillName].total / skillScoreMap[skillName].count).toFixed(1));
            return {
                skill: skillName,
                averageScore: avg,
                questionsCount: skillScoreMap[skillName].count,
                grade: getGrade(avg),
                rating: avg >= 8 ? "Strong" : avg >= 6 ? "Moderate" : "Needs Practice",
            };
        });

        const totalQuestions = answers.length;
        const averageScore = Number((totalScore / totalQuestions).toFixed(2));
        const grade = getGrade(averageScore);
        const placementReadiness = Math.min(100, Math.max(0, Math.round(averageScore * 10)));

        // Duration calculation
        const endTime = session.endedAt ? new Date(session.endedAt).getTime() : Date.now();
        const startTime = session.createdAt ? new Date(session.createdAt).getTime() : Date.now();
        const durationMs = Math.max(0, endTime - startTime);
        const totalMinutes = Math.floor(durationMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const duration = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes || 1} min`;

        const { overallAssessment, recommendation, keyStrengths, criticalWeaknesses } = await generateReportFeedback(answers);

        const interviewDate = session.createdAt
            ? new Date(session.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
            : new Date().toLocaleString();

        const completedAt = session.endedAt
            ? new Date(session.endedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
            : "Just Now";

        return {
            sessionId: session._id,
            interviewDate,
            completedAt,
            interviewStatus: session.endedAt ? "Completed" : "In Progress",

            // Configuration context
            difficulty: session.difficulty || "Mid-Level",
            company: session.company || "General Tech",
            track: session.track || "Comprehensive Full-Stack",
            durationMinutes: session.durationMinutes || 20,
            hintsUsed: session.hintsUsed || 0,

            totalQuestions,
            duration,

            averageScore,
            highestScore: highestScore === -Infinity ? 0 : highestScore,
            lowestScore: lowestScore === Infinity ? 0 : lowestScore,

            bestQuestion: bestQuestion || "N/A",
            bestScore: highestScore === -Infinity ? 0 : highestScore,

            weakestQuestion: weakestQuestion || "N/A",
            weakestScore: lowestScore === Infinity ? 0 : lowestScore,

            excellentAnswers,
            goodAnswers,
            poorAnswers,

            keyStrengths: keyStrengths || [],
            criticalWeaknesses: criticalWeaknesses || [],
            skillBreakdown,

            grade,
            placementReadiness,

            overallAssessment,
            recommendation,

            answers: session.answers,
        };
    } catch (err) {
        console.error("Error in generateReport service:", err);
        throw err;
    }
}

module.exports = generateReport;
