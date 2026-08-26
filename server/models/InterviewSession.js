const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    difficulty: {
        type: String,
        enum: ["Fresher", "Mid-Level", "Senior"],
        default: "Mid-Level",
    },
    company: {
        type: String,
        default: "General Tech",
    },
    durationMinutes: {
        type: Number,
        default: 20,
    },
    track: {
        type: String,
        default: "Comprehensive Full-Stack",
    },
    hintsUsed: {
        type: Number,
        default: 0,
    },
    answers: [
        {
            question: { type: String, required: true },
            answer: { type: String, default: "" },
            codeSnippet: { type: String, default: "" },
            score: { type: Number, default: 0 },
            skill: { type: String, default: "General" },
            strengths: [String],
            improvements: [String],
            modelAnswer: { type: String, default: "" },
            timeSpentSeconds: { type: Number, default: 0 },
            complexityAnalysis: {
                timeComplexity: String,
                spaceComplexity: String,
                bottlenecks: [String],
                cleanCodeRating: Number,
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    endedAt: {
        type: Date,
        index: true,
    },
});

// Compound index for querying a user's recent sessions
interviewSessionSchema.index({ userId: 1, createdAt: -1 });
interviewSessionSchema.index({ userId: 1, endedAt: 1 });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);