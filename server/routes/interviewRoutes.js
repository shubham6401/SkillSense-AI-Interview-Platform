const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/interviewController.js");

router.get("/questions", verifyToken, interviewQuestion);
router.post("/questions", verifyToken, interviewQuestion);
router.post("/start", verifyToken, startInterview);
router.post("/execute-code", verifyToken, executeCandidateCode);
router.post("/analyze-complexity", verifyToken, analyzeCandidateComplexity);
router.post("/hint", verifyToken, getInterviewHint);
router.post("/answer", verifyToken, interviewAnswer);
router.get("/history", verifyToken, interviewHistory);
router.post("/end/:sessionId", verifyToken, interviewEnd);
router.get("/report/:sessionId", verifyToken, interviewReport);
router.delete("/session/:sessionId", verifyToken, deleteInterviewSession);

module.exports = router;