const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// routes
const authRoutes = require("./routes/authroutes.js");
const userRoutes = require("./routes/userRoutes.js");
const resumeRoutes = require("./routes/resumeRoutes.js");
const interviewRoutes = require("./routes/interviewRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const recruiterRoutes = require("./routes/recruiterRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");

const app = express();

// middleware
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes); 
app.use("/api/interview", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "AI Interview Platform Server is operational",
        timestamp: new Date().toISOString(),
    });
});

app.get("/", (req, res) => {
    res.send("AI Interview Platform API is running.");
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error("Unhandled Application Error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});

const PORT = process.env.PORT || 8080;

// Database connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/interview_platform")
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.warn("MongoDB Connection Notice:", err.message);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Running on port ${PORT} (0.0.0.0)`);
});