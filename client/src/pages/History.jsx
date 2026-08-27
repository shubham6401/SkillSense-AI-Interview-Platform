import { getHistory, deleteInterviewSession } from "../services/interviewService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    FileText,
    CheckCircle2,
    Clock,
    ArrowRight,
    Search,
    Trash2,
    Mic,
    Award,
    RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const response = await getHistory();
            setHistory(response.data.sessions || []);
        } catch (err) {
            console.error("Error loading interview history:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, sessionId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this interview record?")) {
            return;
        }

        try {
            setDeletingId(sessionId);
            await deleteInterviewSession(sessionId);
            setHistory((prev) => prev.filter((s) => s._id !== sessionId));
        } catch (err) {
            console.error("Failed to delete session:", err);
            alert("Could not delete the interview session. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredHistory = history.filter((item) => {
        const dateStr = new Date(item.createdAt).toLocaleDateString().toLowerCase();
        const questionMatches = item.answers?.some((a) =>
            a.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.skill?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return dateStr.includes(searchTerm.toLowerCase()) || questionMatches;
    });

    const calculateAverageScore = (answers = []) => {
        if (!answers || answers.length === 0) return 0;
        const sum = answers.reduce((acc, a) => acc + (a.score || 0), 0);
        return Number((sum / answers.length).toFixed(1));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Interview History
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Review previous mock interview performances, scores, and full analytics reports.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/interview")}
                        className="self-start sm:self-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                    >
                        <Mic size={15} />
                        New Interview
                    </button>
                </div>

                {/* Search Bar */}
                {history.length > 0 && (
                    <div className="mb-6 relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Search by skill, question, or date..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                        />
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center animate-spin mb-3">
                            <RefreshCw size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-600">
                            Loading your interview sessions...
                        </p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
                            <FileText size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">
                            No Interview History Found
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Complete your first mock interview to track your performance trajectory and generate analytics.
                        </p>
                        <button
                            onClick={() => navigate("/interview")}
                            className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                        >
                            Start First Mock Interview →
                        </button>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center">
                        <p className="text-xs text-slate-500">
                            No interview records matched "{searchTerm}".
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredHistory.map((item, index) => {
                            const avgScore = calculateAverageScore(item.answers);
                            const isDeleting = deletingId === item._id;

                            return (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                                                    #{filteredHistory.length - index}
                                                </span>
                                                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                                    AI Mock Interview Session
                                                </h3>
                                                {item.endedAt ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                        <CheckCircle2 size={11} />
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                                                        <Clock size={11} />
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={13} className="text-slate-400" />
                                                    <span className="text-[11px] sm:text-xs">
                                                        {new Date(item.createdAt).toLocaleString("en-US", {
                                                            dateStyle: "medium",
                                                            timeStyle: "short",
                                                        })}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <FileText size={13} className="text-slate-400" />
                                                    <span className="text-[11px] sm:text-xs">{item.answers?.length || 0} Questions Evaluated</span>
                                                </div>

                                                <div className="flex items-center gap-1.5 font-semibold text-blue-600">
                                                    <Award size={13} />
                                                    <span className="text-[11px] sm:text-xs">Avg: {avgScore} / 10</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                                            <button
                                                onClick={(e) => handleDelete(e, item._id)}
                                                disabled={isDeleting}
                                                title="Delete interview record"
                                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100 min-w-[38px] min-h-[38px] flex items-center justify-center"
                                            >
                                                {isDeleting ? (
                                                    <RefreshCw size={16} className="animate-spin text-red-500" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => navigate(`/report/${item._id}`)}
                                                className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 min-h-[38px]"
                                            >
                                                <span>View Report</span>
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default History;