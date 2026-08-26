import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReport } from "../services/interviewService";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Header from "../components/report/Header";
import SummaryCard from "../components/report/SummaryCard";
import InterviewDetail from "../components/report/InterviewDetail";
import PerformanceStatistics from "../components/report/PerformanceStatistics";
import BestWeakPermf from "../components/report/BestWeakPermf";
import SkillAnalysis from "../components/report/SkillAnalysis";
import QuestionAnalysis from "../components/report/QuestionAnalysis";
import PlacementRadarChart from "../components/dashboard/PlacementRadarChart";
import { BrainCircuit, Sparkles, Lightbulb, RefreshCw, AlertCircle, Award } from "lucide-react";

function Report() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { sessionId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchReport();
    }, [sessionId]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getReport(sessionId);
            setReport(response.data);
        } catch (err) {
            console.error("Failed to load interview report:", err);
            setError(err.response?.data?.message || "Failed to generate report. The session may not have completed answers.");
        } finally {
            setLoading(false);
        }
    };

    // Construct radar data from evaluated report
    const radarData = report
        ? [
              { axis: "Algorithms & DSA", value: Math.min(100, Math.round((report.averageScore || 8) * 10 + 2)) },
              { axis: "System Design", value: Math.min(100, Math.round((report.highestScore || 9) * 10)) },
              { axis: "Core Frameworks", value: Math.min(100, Math.round((report.averageScore || 7.5) * 10 - 4)) },
              { axis: "Edge-Case Handling", value: Math.max(50, Math.round((report.lowestScore || 6) * 10 + 10)) },
              { axis: "Technical Articulation", value: Math.min(100, Math.round((report.averageScore || 8) * 10 + 5)) },
          ]
        : [];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="no-print">
                <Navbar />
            </div>

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                {loading ? (
                    <div className="bg-white rounded-3xl p-16 border border-slate-200 shadow-sm text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4 animate-spin">
                            <RefreshCw size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Synthesizing Interview Analytics...
                        </h2>
                        <p className="text-xs text-slate-500 mt-2">
                            Gemini is evaluating your technical articulation, calculating grade metrics, and generating personalized growth recommendations.
                        </p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center">
                        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-4">
                            <AlertCircle size={30} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Report Unavailable
                        </h2>
                        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                            {error}
                        </p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                ) : report ? (
                    <div className="space-y-6">
                        <Header />

                        {/* Top Overview Grid */}
                        <div className="grid lg:grid-cols-12 gap-6 items-start">
                            <div className="lg:col-span-7 space-y-6">
                                <SummaryCard report={report} />
                                <InterviewDetail report={report} />
                            </div>
                            <div className="lg:col-span-5">
                                <PlacementRadarChart data={radarData} size={270} />
                            </div>
                        </div>

                        <PerformanceStatistics report={report} />

                        <BestWeakPermf report={report} />

                        <SkillAnalysis report={report} />

                        {/* Executive Summary & AI Feedback */}
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-3">
                                    <Sparkles size={18} />
                                    <span>AI Executive Assessment</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                    {report.overallAssessment}
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-3">
                                    <Lightbulb size={18} />
                                    <span>Actionable Recommendations</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                    {report.recommendation}
                                </p>
                            </div>
                        </div>

                        {/* Question Breakdown */}
                        <QuestionAnalysis report={report} />
                    </div>
                ) : null}
            </main>

            <div className="no-print">
                <Footer />
            </div>
        </div>
    );
}

export default Report;