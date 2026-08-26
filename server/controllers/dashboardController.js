const Resume = require("../models/resume");
const InterviewSession = require("../models/InterviewSession");
const getGrade = require("../utils/getGrade");

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const resume = await Resume.findOne({ userId });

        const sessions = await InterviewSession
            .find({ userId })
            .sort({ createdAt: -1 });

        const completedSessions = sessions.filter(
            session => session.endedAt
        );

        let totalScore = 0;
        let totalAnswers = 0;
        const recentInterviews = [];

        for (const session of completedSessions) {

            let sessionScore = 0;

            for (const answer of session.answers) {
                sessionScore += answer.score;
                totalScore += answer.score;
                totalAnswers++;
            }

            const questionCount = session.answers.length;

            const sessionAverage =
                questionCount === 0
                    ? 0
                    : Number((sessionScore / questionCount).toFixed(2));

            recentInterviews.push({
                _id: session._id,
                createdAt: session.createdAt,
                questionCount,
                averageScore: sessionAverage,
                grade: getGrade(sessionAverage),
            });
        }

        const averageScore =
            totalAnswers === 0
                ? 0
                : Number((totalScore / totalAnswers).toFixed(2));

        const placementReadiness = Math.round(averageScore * 10);

        const latestGrade =
            completedSessions.length === 0
                ? "N/A"
                : getGrade(averageScore);
        

        res.json({
            resume:resume?{
                uploaded: true,
                originalName: resume.originalName,
                uploadedAt: resume.uploadedAt,
                skillsCount: resume.skills.length,
            } :{
                uploaded:false,
            },
            totalInterviews: sessions.length,
            completedInterviews: completedSessions.length,
            averageScore,
            placementReadiness,
            latestGrade,
            recentInterviews: recentInterviews.slice(0, 5),
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Failed to load dashboard",
        });
    }
};

module.exports = {
    getDashboard,
};