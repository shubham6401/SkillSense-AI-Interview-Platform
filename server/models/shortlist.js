const mongoose = require("mongoose");

const shortlistSchema = new mongoose.Schema({
    recruiterId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    candidateId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["Shortlisted", "Under Review", "Interviewing", "Offer Extended", "Rejected"],
        default: "Shortlisted",
    },
    notes: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

// Ensure a recruiter has only one shortlist record per candidate
shortlistSchema.index({ recruiterId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model("Shortlist", shortlistSchema);
