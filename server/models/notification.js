const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderName: {
        type: String,
        default: "Recruiter",
    },
    companyName: {
        type: String,
        default: "Hiring Company",
    },
    type: {
        type: String,
        enum: ["SHORTLISTED", "UNDER_REVIEW", "INTERVIEW_INVITE", "OFFER_EXTENDED", "STATUS_UPDATE"],
        default: "SHORTLISTED",
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Shortlisted",
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
});

// Compound index for querying a candidate's unread notifications rapidly
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
