import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCandidates, updateShortlist, getCandidateReports } from "../services/recruiterService";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import {
    Building2,
    Search,
    Filter,
    Award,
    CheckCircle2,
    Clock,
    User,
    Mail,
    FileText,
    Star,
    Sparkles,
    ChevronRight,
    X,
    TrendingUp,
    BookmarkCheck,
    Users,
    Briefcase,
    ExternalLink,
    RefreshCw,
    LogOut,
    Download,
    MessageSquare,
    Check,
    SlidersHorizontal,
    Send,
    Loader2,
    Sun,
    Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function RecruiterDashboard() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [minReadiness, setMinReadiness] = useState(0);

    // Inspect candidate modal state
    const [inspectCandidate, setInspectCandidate] = useState(null);
    const [inspectLoading, setInspectLoading] = useState(false);
    const [candidateSessions, setCandidateSessions] = useState([]);

    // Recruiter Note modal state
    const [noteModal, setNoteModal] = useState({ isOpen: false, candidate: null, notes: "", status: "Shortlisted", saving: false });

    // Lock body scroll whenever inspect modal or note modal is open
    useLockBodyScroll(Boolean(inspectCandidate || noteModal.isOpen));
    const [updatingShortlistId, setUpdatingShortlistId] = useState(null);

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        try {
            setLoading(true);
            const res = await getCandidates();
            setCandidates(res.data.candidates || []);
        } catch (err) {
            console.error("Failed to fetch candidate pool:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleShortlistChange = async (candidateId, newStatus, customNotes = "") => {
        try {
            setUpdatingShortlistId(candidateId);
            await updateShortlist({ candidateId, status: newStatus, notes: customNotes });
            setCandidates((prev) =>
                prev.map((c) => (c._id === candidateId ? { ...c, shortlistStatus: newStatus, shortlistNotes: customNotes } : c))
            );
        } catch (err) {
            console.error("Failed to update shortlist status:", err);
            alert("Could not update shortlist status.");
        } finally {
            setUpdatingShortlistId(null);
        }
    };

    const handleSaveNote = async () => {
        if (!noteModal.candidate) return;
        try {
            setNoteModal((prev) => ({ ...prev, saving: true }));
            await handleShortlistChange(noteModal.candidate._id, noteModal.status, noteModal.notes);
            setNoteModal({ isOpen: false, candidate: null, notes: "", status: "Shortlisted", saving: false });
        } catch (err) {
            setNoteModal((prev) => ({ ...prev, saving: false }));
        }
    };

    const handleInspectCandidate = async (candidate) => {
        try {
            setInspectCandidate(candidate);
            setInspectLoading(true);
            const res = await getCandidateReports(candidate._id);
            setCandidateSessions(res.data.sessions || []);
        } catch (err) {
            console.error("Failed to load candidate reports:", err);
        } finally {
            setInspectLoading(false);
        }
    };

    // Export shortlisted talent to CSV
    const exportTalentCSV = () => {
        const headers = ["Name", "Email", "Grade", "Placement Readiness", "Average Score", "Shortlist Status", "Recruiter Notes", "Skills"];
        const rows = filteredCandidates.map((c) => [
            `"${c.name}"`,
            `"${c.email}"`,
            `"${c.grade}"`,
            `"${c.placementReadiness}%"`,
            `"${c.averageScore}/10"`,
            `"${c.shortlistStatus}"`,
            `"${c.shortlistNotes.replace(/"/g, '""')}"`,
            `"${c.skills.join(", ")}"`,
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `SkillSense_Talent_Pool_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // Filter logic
    const filteredCandidates = candidates.filter((c) => {
        const matchesSearch =
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesGrade = gradeFilter === "all" || c.grade === gradeFilter;
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "none" ? c.shortlistStatus === "None" : c.shortlistStatus === statusFilter);

        const matchesReadiness = (c.placementReadiness || 0) >= minReadiness;

        return matchesSearch && matchesGrade && matchesStatus && matchesReadiness;
    });

    const shortlistedCount = candidates.filter((c) => c.shortlistStatus !== "None").length;
    const topTalentCount = candidates.filter((c) => c.placementReadiness >= 80).length;

    const gradeColors = {
        "A+": "bg-emerald-50 text-emerald-700 border-emerald-200",
        A: "bg-emerald-50 text-emerald-700 border-emerald-200",
        B: "bg-blue-50 text-blue-700 border-blue-200",
        C: "bg-amber-50 text-amber-700 border-amber-200",
        D: "bg-rose-50 text-rose-700 border-rose-200",
        "N/A": "bg-slate-100 text-slate-600 border-slate-200",
    };

    const statusBadgeColors = {
        Shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
        "Under Review": "bg-blue-50 text-blue-700 border-blue-200",
        Interviewing: "bg-purple-50 text-purple-700 border-purple-200",
        "Offer Extended": "bg-indigo-50 text-indigo-700 border-indigo-200",
        Rejected: "bg-rose-50 text-rose-700 border-rose-200",
        None: "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Recruiter Navbar */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                            <Building2 size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                                    SkillSense<span className="text-indigo-600">.Recruiter</span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    Company Portal
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                                Hiring for: <span className="text-slate-800 font-bold">{user?.companyName || user?.name || "Company"}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
                            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
                        >
                            {isDark ? <Sun size={17} className="text-amber-500" /> : <Moon size={17} className="text-slate-600" />}
                        </button>

                        <button
                            onClick={exportTalentCSV}
                            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
                        >
                            <Download size={15} />
                            <span>Export CSV</span>
                        </button>

                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs font-bold">
                            <BookmarkCheck size={16} />
                            <span>{shortlistedCount} Shortlisted</span>
                        </div>

                        <button
                            onClick={logout}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-xl transition border border-transparent hover:border-red-100"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Talent Dashboard */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                                <Sparkles size={13} />
                                Verified Technical Talent Pool
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Candidate Leaderboard & Shortlisting
                            </h1>
                            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                                Review verified technical candidates, inspect deep domain skill ratings, add private recruiter notes, and send interview invitations.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 shrink-0">
                            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                                <span className="text-xs text-slate-400 font-bold uppercase">Total Pool</span>
                                <p className="text-3xl font-extrabold text-white mt-1">{candidates.length}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                                <span className="text-xs text-emerald-400 font-bold uppercase">Placement Ready</span>
                                <p className="text-3xl font-extrabold text-emerald-400 mt-1">{topTalentCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Multi-Filters */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search candidate by name, email, or skill keywords (e.g. React, Python, AWS, Docker)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>

                        {/* Multi-Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Minimum Readiness Filter */}
                            <select
                                value={minReadiness}
                                onChange={(e) => setMinReadiness(Number(e.target.value))}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value={0}>Any Score</option>
                                <option value={70}>Min Readiness 70%+</option>
                                <option value={80}>Min Readiness 80%+</option>
                                <option value={90}>Top Tier 90%+</option>
                            </select>

                            {/* Grade Filter */}
                            <select
                                value={gradeFilter}
                                onChange={(e) => setGradeFilter(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value="all">All Grades</option>
                                <option value="A+">Grade A+ (9.0+)</option>
                                <option value="A">Grade A (8.0+)</option>
                                <option value="B">Grade B (7.0+)</option>
                                <option value="C">Grade C (6.0+)</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offer Extended">Offer Extended</option>
                                <option value="none">Not Shortlisted</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Candidate Talent Pool Table */}
                {loading ? (
                    <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center animate-spin mb-4">
                            <RefreshCw size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-700">Loading verified candidate talent pool...</p>
                    </div>
                ) : filteredCandidates.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                            <Users size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No Candidates Found</h3>
                        <p className="text-xs text-slate-500 mt-1">No candidate matched your current search filters.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Candidate Card View (< md) */}
                        <div className="md:hidden space-y-4">
                            {filteredCandidates.map((candidate) => {
                                const readiness = candidate.placementReadiness || 0;
                                return (
                                    <div
                                        key={candidate._id}
                                        className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                                                    {candidate.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-slate-900 text-sm">{candidate.name}</h3>
                                                    <p className="text-[11px] text-slate-400">{candidate.email}</p>
                                                    {candidate.headline && (
                                                        <p className="text-[10px] text-indigo-600 font-semibold mt-0.5 line-clamp-1">
                                                            {candidate.headline}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] border shrink-0 ${gradeColors[candidate.grade] || gradeColors["N/A"]}`}>
                                                {candidate.grade}
                                            </span>
                                        </div>

                                        {/* Readiness Meter */}
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                                <span>Placement Readiness</span>
                                                <span className={readiness >= 80 ? "text-emerald-600" : readiness >= 50 ? "text-blue-600" : "text-amber-600"}>
                                                    {readiness}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${readiness >= 80 ? "bg-emerald-500" : readiness >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                                                    style={{ width: `${readiness}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Skills Preview */}
                                        <div className="flex flex-wrap gap-1">
                                            {candidate.skills?.slice(0, 4).map((s, idx) => (
                                                <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-slate-200">
                                                    {s}
                                                </span>
                                            ))}
                                            {candidate.skills?.length > 4 && (
                                                <span className="text-[10px] text-slate-400 font-semibold self-center">
                                                    +{candidate.skills.length - 4} more
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                                            <select
                                                value={candidate.shortlistStatus}
                                                onChange={(e) => handleShortlistChange(candidate._id, e.target.value)}
                                                disabled={updatingShortlistId === candidate._id}
                                                className={`flex-1 text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none transition ${statusBadgeColors[candidate.shortlistStatus] || statusBadgeColors.None}`}
                                            >
                                                <option value="None">Not Shortlisted</option>
                                                <option value="Shortlisted">★ Shortlisted</option>
                                                <option value="Under Review">Under Review</option>
                                                <option value="Interviewing">Interviewing</option>
                                                <option value="Offer Extended">Offer Extended</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>

                                            <button
                                                onClick={() => setNoteModal({
                                                    isOpen: true,
                                                    candidate,
                                                    notes: candidate.shortlistNotes || "",
                                                    status: candidate.shortlistStatus !== "None" ? candidate.shortlistStatus : "Shortlisted",
                                                    saving: false,
                                                })}
                                                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition"
                                                title="Add Note"
                                            >
                                                <MessageSquare size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleInspectCandidate(candidate)}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1 shadow-xs"
                                            >
                                                <span>Inspect</span>
                                                <ExternalLink size={13} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table View (>= md) */}
                        <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                            <th className="py-4 px-6">Candidate</th>
                                            <th className="py-4 px-6">Verified Skills & Proficiency</th>
                                            <th className="py-4 px-6 text-center">Placement Readiness</th>
                                            <th className="py-4 px-6 text-center">Evaluated Grade</th>
                                            <th className="py-4 px-6 text-center">Shortlist Status</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                        {filteredCandidates.map((candidate) => {
                                            const readiness = candidate.placementReadiness || 0;

                                            return (
                                                <tr key={candidate._id} className="hover:bg-slate-50/70 transition-colors">
                                                    {/* Candidate Info */}
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                                                {candidate.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm">{candidate.name}</p>
                                                                <p className="text-[11px] text-slate-400">{candidate.email}</p>
                                                                {candidate.headline && (
                                                                    <p className="text-[10px] text-indigo-600 font-semibold truncate max-w-[200px]">
                                                                        {candidate.headline}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Skills & Domain Breakdown */}
                                                    <td className="py-4 px-6 max-w-sm">
                                                        {candidate.skillBreakdown?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {candidate.skillBreakdown.slice(0, 3).map((sb, sbIdx) => (
                                                                    <span
                                                                        key={sbIdx}
                                                                        className="bg-indigo-50/80 text-indigo-800 px-2 py-0.5 rounded-md text-[10px] font-extrabold border border-indigo-200 flex items-center gap-1"
                                                                    >
                                                                        <span>{sb.skill}</span>
                                                                        <span className="text-indigo-500 font-semibold">{sb.averageScore}/10</span>
                                                                    </span>
                                                                ))}
                                                                {candidate.skills.length > 3 && (
                                                                    <span className="text-[10px] text-slate-400 font-semibold self-center">
                                                                        +{candidate.skills.length - 3} skills
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : candidate.skills.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {candidate.skills.slice(0, 4).map((s, sIdx) => (
                                                                    <span
                                                                        key={sIdx}
                                                                        className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-slate-200"
                                                                    >
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-400 italic">No skills listed</span>
                                                        )}
                                                    </td>

                                                    {/* Placement Readiness */}
                                                    <td className="py-4 px-6 text-center">
                                                        <div className="inline-flex flex-col items-center">
                                                            <span className={`font-extrabold text-sm ${readiness >= 80 ? "text-emerald-600" : readiness >= 50 ? "text-blue-600" : "text-amber-600"}`}>
                                                                {readiness}%
                                                            </span>
                                                            <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${readiness >= 80 ? "bg-emerald-500" : readiness >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                                                                    style={{ width: `${readiness}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Grade */}
                                                    <td className="py-4 px-6 text-center">
                                                        <span className={`px-3 py-1 rounded-full font-extrabold text-xs border ${gradeColors[candidate.grade] || gradeColors["N/A"]}`}>
                                                            {candidate.grade}
                                                        </span>
                                                    </td>

                                                    {/* Shortlist Status Selector */}
                                                    <td className="py-4 px-6 text-center">
                                                        <select
                                                            value={candidate.shortlistStatus}
                                                            onChange={(e) => handleShortlistChange(candidate._id, e.target.value)}
                                                            disabled={updatingShortlistId === candidate._id}
                                                            className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition ${statusBadgeColors[candidate.shortlistStatus] || statusBadgeColors.None}`}
                                                        >
                                                            <option value="None">Not Shortlisted</option>
                                                            <option value="Shortlisted">★ Shortlisted</option>
                                                            <option value="Under Review">Under Review</option>
                                                            <option value="Interviewing">Interviewing</option>
                                                            <option value="Offer Extended">Offer Extended</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                    </td>

                                                    {/* Actions: Notes & Inspect */}
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => setNoteModal({
                                                                    isOpen: true,
                                                                    candidate,
                                                                    notes: candidate.shortlistNotes || "",
                                                                    status: candidate.shortlistStatus !== "None" ? candidate.shortlistStatus : "Shortlisted",
                                                                    saving: false,
                                                                })}
                                                                className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition"
                                                                title="Add Private Recruiter Note / Interview Alert"
                                                            >
                                                                <MessageSquare size={14} />
                                                            </button>

                                                            <button
                                                                onClick={() => handleInspectCandidate(candidate)}
                                                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition inline-flex items-center gap-1"
                                                            >
                                                                <span>Inspect</span>
                                                                <ExternalLink size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Recruiter Note & Status Alert Modal */}
            {noteModal.isOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setNoteModal({ isOpen: false, candidate: null, notes: "", status: "Shortlisted", saving: false });
                    }}
                >
                    <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-7 md:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100dvh-1.5rem)] overflow-y-auto my-auto">
                        <button
                            onClick={() => setNoteModal({ isOpen: false, candidate: null, notes: "", status: "Shortlisted", saving: false })}
                            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                            aria-label="Close note modal"
                        >
                            <X size={18} />
                        </button>

                        <div className="mb-4 sm:mb-5 pr-8">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                                Candidate Status & Recruiter Note
                            </span>
                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                                {noteModal.candidate?.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{noteModal.candidate?.email}</p>
                        </div>

                        <div className="space-y-3.5 sm:space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Update Hiring Status
                                </label>
                                <select
                                    value={noteModal.status}
                                    onChange={(e) => setNoteModal({ ...noteModal, status: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <option value="Shortlisted">★ Shortlisted</option>
                                    <option value="Interviewing">Interviewing (Sends Invite Alert)</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Offer Extended">Offer Extended</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Recruiter Note / Candidate Message
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Add feedback, interview schedule notes, or team comments (sent in candidate notification alert)..."
                                    value={noteModal.notes}
                                    onChange={(e) => setNoteModal({ ...noteModal, notes: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none leading-relaxed"
                                />
                            </div>

                            <button
                                onClick={handleSaveNote}
                                disabled={noteModal.saving}
                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 min-h-[44px]"
                            >
                                {noteModal.saving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Sending Notification...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={15} />
                                        <span>Update Status & Notify Candidate</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Inspect Candidate Full Interview Transcript Modal */}
            {inspectCandidate && (
                <div 
                    className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setInspectCandidate(null);
                    }}
                >
                    <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-7 md:p-8 max-h-[calc(100dvh-1.5rem)] sm:max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col">
                        {/* Close button */}
                        <button
                            onClick={() => setInspectCandidate(null)}
                            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-10 min-w-[36px] min-h-[36px] flex items-center justify-center"
                            aria-label="Close candidate transcript modal"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 sm:gap-3.5 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-100 pr-8 shrink-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-extrabold text-base sm:text-lg flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                                {inspectCandidate.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{inspectCandidate.name}</h3>
                                <p className="text-xs text-slate-500 truncate">{inspectCandidate.email}</p>
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5">
                                    <span className="text-xs font-bold text-indigo-600">
                                        Readiness: {inspectCandidate.placementReadiness}%
                                    </span>
                                    <span className="text-xs text-slate-300">•</span>
                                    <span className={`text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${gradeColors[inspectCandidate.grade]}`}>
                                        Grade {inspectCandidate.grade}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Transcript & Skills */}
                        <div className="overflow-y-auto space-y-4 sm:space-y-6 flex-1 pr-1 -mr-1">
                            {/* Domain Skill Ratings */}
                            {inspectCandidate.skillBreakdown?.length > 0 && (
                                <div className="p-3.5 sm:p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-2">
                                        Domain Skill Evaluation Breakdown:
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                        {inspectCandidate.skillBreakdown.map((sb, sbIdx) => (
                                            <div key={sbIdx} className="bg-white p-2.5 rounded-xl border border-indigo-200/60 flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-800 truncate">{sb.skill}</span>
                                                <span className="text-xs font-extrabold text-indigo-600 ml-2">{sb.averageScore}/10</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Interview Session Transcripts */}
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                                    <FileText size={16} className="text-indigo-600 shrink-0" />
                                    <span>Completed Interview Transcripts & AI Ratings ({candidateSessions.length})</span>
                                </h4>

                                {inspectLoading ? (
                                    <div className="p-8 text-center text-slate-500 text-xs">
                                        <RefreshCw size={20} className="animate-spin mx-auto text-indigo-600 mb-2" />
                                        Loading interview responses...
                                    </div>
                                ) : candidateSessions.length === 0 ? (
                                    <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl text-center text-slate-400 text-xs">
                                        Candidate has not completed any full mock interviews yet.
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {candidateSessions.map((session, sIdx) => (
                                            <div key={session._id} className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                                                <div className="flex flex-wrap items-center justify-between gap-1">
                                                    <span className="font-bold text-xs text-slate-800">
                                                        Session #{candidateSessions.length - sIdx} • {session.company || "General Tech"} ({session.difficulty || "Mid-Level"})
                                                    </span>
                                                    <span className="text-[10px] sm:text-[11px] text-slate-400">
                                                        {new Date(session.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="space-y-3 pt-1">
                                                    {session.answers?.map((ans, aIdx) => (
                                                        <div key={aIdx} className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/70 space-y-2">
                                                            <div className="flex items-start justify-between text-xs gap-2">
                                                                <span className="font-bold text-slate-900 leading-snug">Q{aIdx + 1}: {ans.question}</span>
                                                                <span className="font-extrabold text-blue-600 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 shrink-0">
                                                                    {ans.score} / 10
                                                                </span>
                                                            </div>

                                                            <div>
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Candidate Response:</span>
                                                                <p className="text-xs text-slate-700 whitespace-pre-wrap mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono break-words overflow-x-auto">
                                                                    {ans.answer || "No response"}
                                                                </p>
                                                            </div>

                                                            {ans.modelAnswer && (
                                                                <div className="mt-2 pt-2 border-t border-slate-100">
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Ideal Model Answer:</span>
                                                                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed break-words">
                                                                        {ans.modelAnswer}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RecruiterDashboard;
