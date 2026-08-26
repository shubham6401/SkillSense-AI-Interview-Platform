const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User (Candidate or Recruiter)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role = "candidate", companyName = "" } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: role === "recruiter" ? "recruiter" : "candidate",
            companyName: companyName.trim(),
            authProvider: "local",
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                companyName: newUser.companyName,
            },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            message: "Account registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                companyName: newUser.companyName,
            },
        });

    } catch (err) {
        console.error("Register Error:", err);
        return res.status(500).json({
            message: err.message || "Registration failed",
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        let existingUser = await User.findOne({ email: normalizedEmail });

        // Auto-provision demo accounts on fresh database instances
        if (!existingUser) {
            const DEMO_ACCOUNTS = {
                "shubham.architect@gmail.com": {
                    name: "Shubham Gupta",
                    role: "candidate",
                    headline: "Senior Full-Stack Architect • Distributed Systems & React",
                    companyName: "",
                },
                "sarah.google@google.com": {
                    name: "Sarah Jenkins",
                    role: "recruiter",
                    headline: "Staff Technical Recruiter at Google",
                    companyName: "Google",
                },
                "david.stripe@stripe.com": {
                    name: "David Miller",
                    role: "recruiter",
                    headline: "Engineering Talent Acquisition Lead at Stripe",
                    companyName: "Stripe",
                },
                "shubham.candidate@gmail.com": {
                    name: "Shubham Gupta",
                    role: "candidate",
                    headline: "Full-Stack Software Engineer • Algorithms & React",
                    companyName: "",
                },
                "recruiter.talent@google.com": {
                    name: "Sarah Jenkins",
                    role: "recruiter",
                    headline: "Technical Talent Acquisition Lead at Google",
                    companyName: "Google",
                },
            };

            if (DEMO_ACCOUNTS[normalizedEmail]) {
                const demoInfo = DEMO_ACCOUNTS[normalizedEmail];
                const hashedPassword = await bcrypt.hash(password || "Password123!", 10);
                existingUser = await User.create({
                    name: demoInfo.name,
                    email: normalizedEmail,
                    password: hashedPassword,
                    role: demoInfo.role,
                    headline: demoInfo.headline,
                    companyName: demoInfo.companyName,
                    authProvider: "local",
                });

                // Seed candidate skills
                if (demoInfo.role === "candidate") {
                    const Resume = require("../models/resume.js");
                    await Resume.findOneAndUpdate(
                        { userId: existingUser._id },
                        {
                            userId: existingUser._id,
                            skills: ["JavaScript", "React", "Node.js", "System Design", "Python", "MongoDB", "Data Structures", "Algorithms"],
                            resumeText: "Experienced Software Engineer with strong proficiency in React, Node.js, Distributed Systems, and Algorithmic Problem Solving.",
                        },
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                    );
                }
            }
        }

        if (!existingUser) {
            return res.status(401).json({
                message: "No account found with this email.",
            });
        }

        if (existingUser.authProvider !== "local" && !existingUser.password) {
            return res.status(400).json({
                message: `This account was created with ${existingUser.authProvider}. Please sign in with ${existingUser.authProvider}.`,
            });
        }

        const isMatchPassword = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isMatchPassword) {
            return res.status(401).json({
                message: "Incorrect password. Please try again.",
            });
        }

        // Generate JWT Token with role
        const token = jwt.sign(
            {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role || "candidate",
                companyName: existingUser.companyName || "",
            },
            process.env.JWT_SECRET || "fallback_secret",
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            message: "Login Successfully",
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role || "candidate",
                companyName: existingUser.companyName || "",
            },
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({
            message: err.message || "Login failed",
        });
    }
};

// Social Sign-In (Google / GitHub)
const socialLogin = async (req, res) => {
    try {
        const { email, name, provider = "google", role = "candidate", avatar = "" } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required for social sign-in." });
        }

        const cleanEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: cleanEmail });

        if (!user) {
            // Create user
            user = await User.create({
                name: name ? name.trim() : cleanEmail.split("@")[0],
                email: cleanEmail,
                role: role === "recruiter" ? "recruiter" : "candidate",
                avatar: avatar || "",
                authProvider: provider === "github" ? "github" : "google",
                password: await bcrypt.hash(Math.random().toString(36), 10), // Random placeholder password
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "candidate",
                companyName: user.companyName || "",
            },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: `Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)} successfully`,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "candidate",
                companyName: user.companyName || "",
                avatar: user.avatar,
            },
        });

    } catch (err) {
        console.error("Social Auth Error:", err);
        return res.status(500).json({
            message: "Social authentication failed.",
            error: err.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    socialLogin,
};