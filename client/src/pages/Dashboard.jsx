import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import DashboardHero from "../components/dashboard/DashboardHero";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import ResumeCard from "../components/dashboard/ResumeCard";
import DashboardQuickAction from "../components/dashboard/DashboardQuickAction";
import DashboardRecentInterview from "../components/dashboard/DashboardRecentInterview";
import RecruiterActivityCard from "../components/dashboard/RecruiterActivityCard";

import { getDashboard } from "../services/dashboardService";
import { RefreshCw, AlertCircle } from "lucide-react";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getDashboard();
            setDashboard(response.data);
        } catch (err) {
            console.error("Dashboard error:", err);
            setError(err.response?.data?.message || "Failed to load dashboard metrics.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-white px-8 py-10 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center max-w-sm w-full text-center">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-spin mb-4">
                            <RefreshCw size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">
                            Loading SkillSense Dashboard
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Gathering your metrics and placement readiness score...
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center max-w-md w-full">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">
                            Dashboard Loading Error
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {error}
                        </p>
                        <button
                            onClick={loadDashboard}
                            className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                {/* Hero Section */}
                <DashboardHero user={user} dashboard={dashboard} />

                {/* Recruiter Activity & Shortlists Widget */}
                <RecruiterActivityCard />

                {/* Performance Overview Stats */}
                <DashboardOverview dashboard={dashboard} />

                {/* Resume Status Card */}
                <ResumeCard resume={dashboard?.resume} />

                {/* Quick Actions Navigation */}
                <DashboardQuickAction />

                {/* Recent Interviews List */}
                <DashboardRecentInterview dashboard={dashboard} />
            </main>

            <Footer />
        </div>
    );
}

export default Dashboard;