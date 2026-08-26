const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const verifyToken = require("../middleware/authMiddleware.js");
const User = require("../models/user.js");

// Get current user profile details
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error("Profile Fetch Error:", err);
        return res.status(500).json({ message: "Failed to fetch profile." });
    }
});

// Update profile details (Name, Headline, Bio, CompanyName)
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const { name, headline, bio, companyName } = req.body;

        const updateData = {};
        if (name && name.trim()) updateData.name = name.trim();
        if (headline !== undefined) updateData.headline = headline.trim();
        if (bio !== undefined) updateData.bio = bio.trim();
        if (companyName !== undefined) updateData.companyName = companyName.trim();

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
        });
    } catch (err) {
        console.error("Profile Update Error:", err);
        return res.status(500).json({ message: "Failed to update profile." });
    }
});

// Change Password endpoint
router.put("/change-password", verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters long.",
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // If user registered with local password, verify current password
        if (user.authProvider === "local" && user.password) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Please provide your current password." });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password does not match." });
            }
        }

        // Hash and save new password
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        user.authProvider = "local"; // Upgrade to local password if previously social
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully.",
        });
    } catch (err) {
        console.error("Password Change Error:", err);
        return res.status(500).json({ message: "Failed to change password." });
    }
});

module.exports = router;