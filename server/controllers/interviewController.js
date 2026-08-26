const evaluateAnswer = require("../services/evaluateAnswer.js");
const generateQuestions = require("../services/generateQuestions.js");
const generateHint = require("../services/generateHint.js");
const generateReport = require("../services/generateReport.js");
const { executeCode } = require("../services/codeExecution.js");
const analyzeComplexity = require("../services/analyzeComplexity.js");
const Resume = require("../models/resume.js");
const InterviewSession = require("../models/InterviewSession.js");

// Fetch interview questions dynamically based on resume skills and custom configuration
const interviewQuestion = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            userId: req.user.id,
        });

        if (!resume) {
            return res.status(404).json({
                message: "Please upload your resume first before configuring your interview.",
                skills: [],
                questions: [],
            });
        }

        const {
            difficulty = "Mid-Level",
            company = "Top Tech / Product Companies",
            track = "Comprehensive Full-Stack",
            durationMinutes = 20,
            questionCount = 5,
        } = req.method === "POST" ? req.body : req.query;

        const questions = await generateQuestions({
            skills: resume.skills || [],
            difficulty,
            company,
            track,
            durationMinutes,
            questionCount,
        });

        return res.status(200).json({
            skills: resume.skills,
            questions,
            config: {
                difficulty,
                company,
                track,
                durationMinutes: Number(durationMinutes) || 20,
                questionCount: questions.length,
            },
        });
    } catch (err) {
        console.error("Error fetching questions:", err);
        return res.status(500).json({
            message: "Failed to generate interview questions. Please try again.",
            error: err.message,
        });
    }
};

// Start a new configured interview session
const startInterview = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            difficulty = "Mid-Level",
            company = "General Tech",
            durationMinutes = 20,
            track = "Comprehensive Full-Stack",
        } = req.body || {};

        const interviewSession = new InterviewSession({
            userId,
            difficulty,
            company,
            durationMinutes: Number(durationMinutes) || 20,
            track,
            hintsUsed: 0,
            answers: [],
        });

        await interviewSession.save();

        return res.status(201).json({
            message: "Interview session created successfully",
            sessionId: interviewSession._id,
            config: {
                difficulty: interviewSession.difficulty,
                company: interviewSession.company,
                durationMinutes: interviewSession.durationMinutes,
                track: interviewSession.track,
            },
        });
    } catch (err) {
        console.error("Error starting interview session:", err);
        return res.status(500).json({
            message: "Failed to create interview session",
            error: err.message,
        });
    }
};

// Remote Code Execution endpoint
const executeCandidateCode = async (req, res) => {
    try {
        const { code, language = "python", stdin = "", testCases = [] } = req.body;

        if (!code || typeof code !== "string") {
            return res.status(400).json({ message: "Code string is required." });
        }

        const result = await executeCode({ code, language, stdin, testCases });
        return res.status(200).json(result);
    } catch (err) {
        console.error("Code Execution Error:", err);
        return res.status(500).json({ message: "Failed to execute code: " + err.message });
    }
};

// AI Big-O Time and Space Complexity Analysis endpoint
const analyzeCandidateComplexity = async (req, res) => {
    try {
        const { code, language = "python", problem = "Algorithmic Problem" } = req.body;

        if (!code) {
            return res.status(400).json({ message: "Code string is required for complexity analysis." });
        }

        const analysis = await analyzeComplexity({ code, language, problem });
        return res.status(200).json(analysis);
    } catch (err) {
        console.error("Complexity Analysis Error:", err);
        return res.status(500).json({ message: "Failed to analyze complexity: " + err.message });
    }
};

// Request an AI Hint for a specific question
const getInterviewHint = async (req, res) => {
    try {
        const { sessionId, question, skill } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Question is required to generate a hint." });
        }

        const hint = await generateHint(question, skill || "Technical");

        if (sessionId) {
            await InterviewSession.findOneAndUpdate(
                { _id: sessionId, userId: req.user.id },
                { $inc: { hintsUsed: 1 } }
            );
        }

        return res.status(200).json({ hint });
    } catch (err) {
        console.error("Error generating hint:", err);
        return res.status(500).json({ message: "Failed to generate hint." });
    }
};

// Submit and evaluate an answer
const interviewAnswer = async (req, res) => {
    try {
        const { sessionId, skill, question, answer, timeSpentSeconds = 0, complexityAnalysis = null, codeSnippet = "" } = req.body;

        if (!sessionId || !question) {
            return res.status(400).json({
                message: "Session ID and question are required.",
            });
        }

        const session = await InterviewSession.findOne({
            _id: sessionId,
            userId: req.user.id,
        });

        if (!session) {
            return res.status(404).json({
                message: "Interview session not found.",
            });
        }

        // Evaluate answer via AI
        const evaluation = await evaluateAnswer(question, answer || codeSnippet || "", skill || "Technical");

        session.answers.push({
            question,
            answer: answer || "",
            codeSnippet: codeSnippet || "",
            skill: skill || "General",
            score: evaluation.score,
            strengths: evaluation.strengths,
            improvements: evaluation.improvements,
            modelAnswer: evaluation.modelAnswer,
            timeSpentSeconds: Number(timeSpentSeconds) || 0,
            complexityAnalysis: complexityAnalysis || null,
        });

        await session.save();

        return res.status(200).json({
            message: "Answer evaluated and recorded successfully",
            evaluation,
        });
    } catch (err) {
        console.error("Error submitting answer:", err);
        return res.status(500).json({
            message: "Failed to submit and evaluate answer",
            error: err.message,
        });
    }
};

// Conclude an interview session
const interviewEnd = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await InterviewSession.findOne({
            _id: sessionId,
            userId: req.user.id,
        });

        if (!session) {
            return res.status(404).json({
                message: "Interview session not found",
            });
        }

        session.endedAt = Date.now();
        await session.save();

        return res.status(200).json({
            message: "Interview completed successfully",
            sessionId: session._id,
        });
    } catch (err) {
        console.error("Error concluding interview:", err);
        return res.status(500).json({
            message: "Failed to end interview session",
            error: err.message,
        });
    }
};

// Get completed interview history
const interviewHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const sessions = await InterviewSession.find({
            userId,
            endedAt: { $ne: null },
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            sessions: sessions || [],
        });
    } catch (err) {
        console.error("Error fetching interview history:", err);
        return res.status(500).json({
            message: "Failed to fetch interview history",
            error: err.message,
        });
    }
};

// Generate comprehensive report for a session
const interviewReport = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const report = await generateReport(sessionId, req.user.id);
        return res.status(200).json(report);
    } catch (err) {
        console.error("Error generating report:", err);
        return res.status(500).json({
            message: err.message || "Error generating report",
        });
    }
};

// Delete interview session from history
const deleteInterviewSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const deleted = await InterviewSession.findOneAndDelete({
            _id: sessionId,
            userId: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({ message: "Interview session not found." });
        }

        return res.status(200).json({ message: "Interview session deleted successfully." });
    } catch (err) {
        console.error("Error deleting interview session:", err);
        return res.status(500).json({ message: "Failed to delete interview session." });
    }
};

module.exports = {
    interviewQuestion,
    startInterview,
    executeCandidateCode,
    analyzeCandidateComplexity,
    getInterviewHint,
    interviewAnswer,
    interviewHistory,
    interviewEnd,
    interviewReport,
    deleteInterviewSession,
};