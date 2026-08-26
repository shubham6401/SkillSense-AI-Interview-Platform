import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import History from "../pages/History";
import Interview from "../pages/Interview";
import Login from "../pages/Login";
import Report from "../pages/Report";
import Resume from "../pages/Resume";
import Signup from "../pages/Signup";
import RecruiterDashboard from "../pages/RecruiterDashboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            {/* Public Landing Page presenting all platform features */}
            <Route path="/" element={<Landing />} />

            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />

            {/* User Profile & Security Route (Candidate & Recruiter) */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Candidate Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/history"
                element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                        <History />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/interview"
                element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                        <Interview />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/report/:sessionId"
                element={
                    <ProtectedRoute>
                        <Report />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/resume"
                element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                        <Resume />
                    </ProtectedRoute>
                }
            />

            {/* Recruiter & Company Protected Routes */}
            <Route
                path="/recruiter/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["recruiter"]}>
                        <RecruiterDashboard />
                    </ProtectedRoute>
                }
            />

            {/* 404 Fallback Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;