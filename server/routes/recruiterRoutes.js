const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware.js");
const {
    getCandidates,
    updateShortlist,
    getCandidateReports,
} = require("../controllers/recruiterController.js");

// Recruiter role validation middleware
const verifyRecruiter = (req, res, next) => {
    if (req.user && req.user.role === "recruiter") {
        return next();
    }
    return res.status(403).json({
        message: "Access restricted to verified Company & Recruiter accounts.",
    });
};

router.get("/candidates", verifyToken, verifyRecruiter, getCandidates);
router.post("/shortlist", verifyToken, verifyRecruiter, updateShortlist);
router.get("/candidate/:candidateId/reports", verifyToken, verifyRecruiter, getCandidateReports);

module.exports = router;
