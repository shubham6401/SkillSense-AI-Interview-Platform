const express = require("express");
const router = express.Router();
const fs = require("fs");
const pdfParse = require("pdf-parse");

const upload = require("../middleware/uploads.js");
const verifyToken = require("../middleware/authMiddleware.js");
const skillsDictionary = require("../utils/skills.js");
const Resume = require("../models/resume.js");

// Get currently uploaded resume and skills
router.get("/current", verifyToken, async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user.id });
        if (!resume) {
            return res.status(200).json({ uploaded: false, skills: [] });
        }
        return res.status(200).json({
            uploaded: true,
            originalName: resume.originalName,
            skills: resume.skills || [],
            uploadedAt: resume.uploadedAt,
        });
    } catch (err) {
        console.error("Error fetching current resume:", err);
        return res.status(500).json({ message: "Failed to fetch resume status." });
    }
});

// Upload or replace resume (upsert)
router.post("/resume", verifyToken, upload.single("resume"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Please provide a valid PDF file." });
    }

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        const extractedText = pdfData.text || "";

        // Extract skills matching dictionary
        const foundSkills = skillsDictionary.filter((skill) => {
            const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
            return regex.test(extractedText);
        });

        // Ensure at least some default core skills if the PDF text is completely non-standard
        const finalSkills = foundSkills.length > 0
            ? foundSkills
            : ["Problem Solving", "Web Development", "JavaScript"];

        // Upsert resume document for the user
        const resume = await Resume.findOneAndUpdate(
            { userId: req.user.id },
            {
                originalName: req.file.originalname,
                userId: req.user.id,
                resumeText: extractedText,
                skills: finalSkills,
                uploadedAt: new Date(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
            message: "Resume processed successfully.",
            skills: resume.skills,
            originalName: resume.originalName,
        });
    } catch (err) {
        console.error("Error uploading resume:", err);
        return res.status(500).json({
            message: "Failed to process resume: " + err.message,
        });
    } finally {
        // Clean up temporary uploaded file from disk to avoid storage bloat
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupErr) {
                console.warn("Could not delete temp upload file:", cleanupErr.message);
            }
        }
    }
});

// Update skills manually (add/remove custom tags with upsert)
router.put("/skills", verifyToken, async (req, res) => {
    try {
        const { skills } = req.body;
        if (!Array.isArray(skills)) {
            return res.status(400).json({ message: "Skills must be an array of strings." });
        }

        const sanitizedSkills = [...new Set(skills.map((s) => String(s).trim()).filter(Boolean))];

        const resume = await Resume.findOneAndUpdate(
            { userId: req.user.id },
            {
                $set: {
                    skills: sanitizedSkills,
                    originalName: "Profile Calibrated Skills",
                    uploadedAt: new Date(),
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
            message: "Skills updated successfully.",
            skills: resume.skills,
        });
    } catch (err) {
        console.error("Error updating skills:", err);
        return res.status(500).json({ message: "Failed to update skills." });
    }
});

module.exports = router;