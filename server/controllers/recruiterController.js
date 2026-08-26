const User = require("../models/user.js");
const Resume = require("../models/resume.js");
const InterviewSession = require("../models/InterviewSession.js");
const Shortlist = require("../models/shortlist.js");
const Notification = require("../models/notification.js");
const getGrade = require("../utils/getGrade.js");

// Get all candidates with detailed domain analytics, skills, and shortlist status
const getCandidates = async (req, res) => {
    try {
        const recruiterId = req.user.id;

        // Fetch all candidate users
        const candidates = await User.find({ role: "candidate" }).select("-password").sort({ createdAt: -1 });

        // Fetch all resumes
        const resumes = await Resume.find({});
        const resumeMap = new Map(resumes.map((r) => [r.userId.toString(), r]));

        // Fetch all completed interview sessions
        const sessions = await InterviewSession.find({ endedAt: { $ne: null } });

        // Group sessions by candidate userId
        const sessionsByUser = new Map();
        for (const s of sessions) {
            const uid = s.userId.toString();
            if (!sessionsByUser.has(uid)) {
                sessionsByUser.set(uid, []);
            }
            sessionsByUser.get(uid).push(s);
        }

        // Fetch this recruiter's shortlists
        const shortlists = await Shortlist.find({ recruiterId });
        const shortlistMap = new Map(shortlists.map((sl) => [sl.candidateId.toString(), sl]));

        const talentPool = candidates.map((candidate) => {
            const uid = candidate._id.toString();
            const resume = resumeMap.get(uid);
            const userSessions = sessionsByUser.get(uid) || [];
            const shortlistInfo = shortlistMap.get(uid);

            let totalScore = 0;
            let totalAnswers = 0;
            let highestScore = 0;

            // Compute domain skill performance breakdown
            const skillScoreMap = {};

            for (const s of userSessions) {
                for (const a of s.answers) {
                    const score = Number(a.score) || 0;
                    totalScore += score;
                    totalAnswers++;
                    if (score > highestScore) highestScore = score;

                    const sk = a.skill || "General";
                    if (!skillScoreMap[sk]) {
                        skillScoreMap[sk] = { total: 0, count: 0 };
                    }
                    skillScoreMap[sk].total += score;
                    skillScoreMap[sk].count++;
                }
            }

            const skillBreakdown = Object.keys(skillScoreMap).map((skillName) => ({
                skill: skillName,
                averageScore: Number((skillScoreMap[skillName].total / skillScoreMap[skillName].count).toFixed(1)),
                questionsCount: skillScoreMap[skillName].count,
            }));

            const averageScore = totalAnswers > 0 ? Number((totalScore / totalAnswers).toFixed(2)) : 0;
            const placementReadiness = Math.min(100, Math.round(averageScore * 10));
            const grade = totalAnswers > 0 ? getGrade(averageScore) : "N/A";

            return {
                _id: candidate._id,
                name: candidate.name,
                email: candidate.email,
                headline: candidate.headline || "",
                bio: candidate.bio || "",
                joinedAt: candidate.createdAt,
                skills: resume?.skills || [],
                hasResume: Boolean(resume),
                resumeName: resume?.originalName || "",
                completedInterviewsCount: userSessions.length,
                averageScore,
                highestScore,
                placementReadiness,
                grade,
                skillBreakdown,
                shortlistStatus: shortlistInfo?.status || "None",
                shortlistNotes: shortlistInfo?.notes || "",
                shortlistedAt: shortlistInfo?.updatedAt || null,
            };
        });

        // Sort talent pool primarily by placement readiness descending
        talentPool.sort((a, b) => b.placementReadiness - a.placementReadiness);

        return res.status(200).json({
            candidates: talentPool,
            totalCandidates: talentPool.length,
            shortlistedCount: shortlists.length,
        });
    } catch (err) {
        console.error("Recruiter Candidates Error:", err);
        return res.status(500).json({
            message: "Failed to fetch candidate talent pool",
            error: err.message,
        });
    }
};

// Update candidate shortlist status and trigger candidate in-app notification
const updateShortlist = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const { candidateId, status = "Shortlisted", notes = "" } = req.body;

        if (!candidateId) {
            return res.status(400).json({ message: "Candidate ID is required." });
        }

        const recruiter = await User.findById(recruiterId);
        const candidate = await User.findById(candidateId);

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found." });
        }

        const company = recruiter?.companyName || "Hiring Company";
        const recruiterName = recruiter?.name || "Lead Recruiter";

        if (status === "None") {
            // Remove from shortlist
            await Shortlist.findOneAndDelete({ recruiterId, candidateId });
            return res.status(200).json({
                message: "Candidate removed from shortlist.",
                status: "None",
            });
        }

        const updated = await Shortlist.findOneAndUpdate(
            { recruiterId, candidateId },
            { status, notes },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Generate Candidate In-App Notification
        let notifType = "SHORTLISTED";
        let notifTitle = `🎉 You have been Shortlisted by ${company}!`;
        let notifMessage = `${recruiterName} from ${company} reviewed your interview performance and has added you to their Shortlist.`;

        if (status === "Interviewing") {
            notifType = "INTERVIEW_INVITE";
            notifTitle = `📅 Interview Invitation from ${company}`;
            notifMessage = `${company} wants to invite you to an official interview round based on your placement score!`;
        } else if (status === "Offer Extended") {
            notifType = "OFFER_EXTENDED";
            notifTitle = `🏆 Offer Extended from ${company}!`;
            notifMessage = `Congratulations! ${company} has marked your status as Offer Extended.`;
        } else if (status === "Under Review") {
            notifType = "UNDER_REVIEW";
            notifTitle = `👀 Profile Under Review at ${company}`;
            notifMessage = `${company} is currently evaluating your verified mock interview results.`;
        }

        if (notes && notes.trim()) {
            notifMessage += ` Recruiter Note: "${notes.trim()}"`;
        }

        await Notification.create({
            recipientId: candidateId,
            senderId: recruiterId,
            senderName: recruiterName,
            companyName: company,
            type: notifType,
            title: notifTitle,
            message: notifMessage,
            status,
            isRead: false,
        });

        return res.status(200).json({
            message: `Candidate marked as ${status}. Notification sent to candidate.`,
            status: updated.status,
            shortlist: updated,
        });
    } catch (err) {
        console.error("Shortlist Update Error:", err);
        return res.status(500).json({
            message: "Failed to update shortlist status.",
            error: err.message,
        });
    }
};

// Get all interview reports for a specific candidate with detailed answer breakdowns
const getCandidateReports = async (req, res) => {
    try {
        const { candidateId } = req.params;

        const candidate = await User.findById(candidateId).select("name email headline bio companyName");
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found." });
        }

        const resume = await Resume.findOne({ userId: candidateId });
        const sessions = await InterviewSession.find({
            userId: candidateId,
            endedAt: { $ne: null },
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            candidate,
            resume: resume
                ? {
                      originalName: resume.originalName,
                      skills: resume.skills,
                      uploadedAt: resume.uploadedAt,
                  }
                : null,
            sessions,
        });
    } catch (err) {
        console.error("Candidate Reports Error:", err);
        return res.status(500).json({
            message: "Failed to fetch candidate interview reports.",
            error: err.message,
        });
    }
};

module.exports = {
    getCandidates,
    updateShortlist,
    getCandidateReports,
};
