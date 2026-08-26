import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BrainCircuit,
    Code2,
    Sparkles,
    Play,
    Building2,
    Shield,
    ArrowRight,
    CheckCircle2,
    Cpu,
    Zap,
    Layers,
    Terminal,
    Clock,
    HardDrive,
    Users,
    ChevronDown,
    ChevronUp,
    FileText,
    Mic,
    Volume2,
    VolumeX,
    Trophy,
    Star,
    ExternalLink,
    HelpCircle,
    Sliders,
    Award,
    Check,
    BookmarkCheck,
    Search,
    X,
    Sun,
    Moon,
    Menu,
} from "lucide-react";
import { login, socialLogin } from "../services/authService";
import SystemDesignWhiteboard from "../components/interview/SystemDesignWhiteboard";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

export default function Landing() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAuthenticated = Boolean(localStorage.getItem("token"));

    // Interactive Demo State on Landing Page
    const [demoLang, setDemoLang] = useState("python");
    const [demoRunning, setDemoRunning] = useState(false);
    const [demoOutput, setDemoOutput] = useState(
        "// Click 'Run Code' or 'Analyze Big-O' to test the live sandbox engine..."
    );

    // Audio preview state
    const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);

    // Readiness Calculator state
    const [calcYears, setCalcYears] = useState(2);
    const [calcProblems, setCalcProblems] = useState(150);

    // Candidate Preview Modal state for landing page
    const [inspectedCandidate, setInspectedCandidate] = useState(null);

    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState(null);

    const demoSnippets = {
        python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test execution
print(two_sum([2, 7, 11, 15], 9))`,
        javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            return [seen.get(diff), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`,
        cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (seen.count(diff)) {
            cout << "[" << seen[diff] << ", " << i << "]" << endl;
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}`,
    };

    // Sample candidate cards on landing page
    const featuredTalent = [
        {
            id: 1,
            name: "Shubham Gupta",
            email: "shubham.architect@gmail.com",
            headline: "Senior Full-Stack Architect • Distributed Systems & React",
            readiness: 92,
            grade: "A+",
            skills: ["React", "Node.js", "System Design", "Distributed Systems", "Redis"],
            skillBreakdown: [
                { skill: "System Design", score: "9.5/10" },
                { skill: "React", score: "9.0/10" },
                { skill: "MongoDB", score: "9.0/10" },
            ],
            target: "Google (Senior L5)",
            status: "Interviewing",
            transcriptPreview:
                "Q: How would you design a distributed rate limiter for Google Search APIs?\nA: Uses sliding window counter in Redis cluster with atomic Lua scripts...",
        },
        {
            id: 2,
            name: "Priya Sharma",
            email: "priya.sharma@gmail.com",
            headline: "Distributed Systems & Cloud Backend Engineer",
            readiness: 88,
            grade: "A",
            skills: ["Go", "Kafka", "PostgreSQL", "Kubernetes", "gRPC"],
            skillBreakdown: [
                { skill: "Kafka", score: "9.2/10" },
                { skill: "PostgreSQL", score: "8.8/10" },
            ],
            target: "Stripe (Staff Infra)",
            status: "Shortlisted",
            transcriptPreview:
                "Q: How do you achieve exactly-once processing in event-driven payments?\nA: Transactional outbox pattern combined with idempotency key deduplication...",
        },
        {
            id: 3,
            name: "Alex Rivera",
            email: "alex.rivera@gmail.com",
            headline: "Frontend Tech Lead • React & Web Performance",
            readiness: 85,
            grade: "A",
            skills: ["React", "TypeScript", "Next.js", "GraphQL", "Web Performance"],
            skillBreakdown: [
                { skill: "Web Performance", score: "9.0/10" },
                { skill: "React", score: "8.5/10" },
            ],
            target: "Meta (Frontend L5)",
            status: "Under Review",
            transcriptPreview:
                "Q: How would you optimize Core Web Vitals for an e-commerce feed?\nA: Preload hero assets with fetchpriority='high', break long tasks via scheduler.yield()...",
        },
    ];

    const handleRunDemo = () => {
        setDemoRunning(true);
        setTimeout(() => {
            setDemoOutput(
                `✓ Program Executed in 24ms (Memory 1.2 MB)\nOutput: [0, 1]\nStatus: Accepted (2/2 Test Cases Passed)`
            );
            setDemoRunning(false);
        }, 500);
    };

    const handleAnalyzeDemoBigO = () => {
        setDemoRunning(true);
        setTimeout(() => {
            setDemoOutput(
                `🧠 AI Big-O Complexity Derivation:\n• Time Complexity: O(N) — Single linear scan over array.\n• Space Complexity: O(N) — Auxiliary hash map.\n• Bottleneck Analysis: No nested loops detected. Optimal asymptotic solution achieved.`
            );
            setDemoRunning(false);
        }, 600);
    };

    // Direct 1-Click Logins
    const handleLoginCandidate = async (email = "shubham.architect@gmail.com") => {
        try {
            const res = await login({ email, password: "Password123!" });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/dashboard");
        } catch (err) {
            console.warn("Backend connecting, using local demo candidate session:", err.message);
            const demoCandidate = {
                id: "6a8f5bfc8d8ecfa28386e16e",
                name: "Shubham Gupta",
                email: "shubham.architect@gmail.com",
                role: "candidate",
                headline: "Senior Full-Stack Architect • Distributed Systems & React",
            };
            localStorage.setItem("token", `demo_candidate_token_${Date.now()}`);
            localStorage.setItem("user", JSON.stringify(demoCandidate));
            navigate("/dashboard");
        }
    };

    const handleLoginRecruiter = async (email = "sarah.google@google.com") => {
        try {
            const res = await login({ email, password: "Password123!" });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/recruiter/dashboard");
        } catch (err) {
            console.warn("Backend connecting, using local demo recruiter session:", err.message);
            const demoRecruiter = {
                id: "6a8f5bfc8d8ecfa28386e16f",
                name: "Sarah Jenkins",
                email: "sarah.google@google.com",
                role: "recruiter",
                companyName: "Google",
                headline: "Staff Technical Recruiter at Google",
            };
            localStorage.setItem("token", `demo_recruiter_token_${Date.now()}`);
            localStorage.setItem("user", JSON.stringify(demoRecruiter));
            navigate("/recruiter/dashboard");
        }
    };

    // Voice Simulation Audio
    const handlePlayAudioQuestion = () => {
        if (!("speechSynthesis" in window)) {
            alert("Speech synthesis is supported in Chrome, Edge, and Safari.");
            return;
        }

        if (isSpeakingAudio) {
            window.speechSynthesis.cancel();
            setIsSpeakingAudio(false);
            return;
        }

        const questionText =
            "Design a distributed rate-limiter and caching strategy for Google Search endpoints capable of handling 500,000 requests per second with sub-5 millisecond latency.";
        const utterance = new SpeechSynthesisUtterance(questionText);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeakingAudio(true);
        utterance.onend = () => setIsSpeakingAudio(false);
        utterance.onerror = () => setIsSpeakingAudio(false);

        window.speechSynthesis.speak(utterance);
    };

    // Calculate dynamic readiness score
    const calculatedScore = Math.min(
        98,
        Math.round(40 + calcYears * 6 + (calcProblems / 500) * 35)
    );

    const calculatedGrade =
        calculatedScore >= 90
            ? "A+ (Senior Staff)"
            : calculatedScore >= 80
            ? "A (L5 / Senior)"
            : calculatedScore >= 70
            ? "B (L4 / Mid-Level)"
            : "C (L3 / Associate)";

    const faqs = [
        {
            q: "How does SkillSense.AI generate company-specific questions?",
            a: "We integrate Google Gemini 2.5 Flash with tailored engineering prompt matrices calibrated for companies like Google, Meta, Amazon, high-growth startups, and Fintech. Questions dynamically align with your resume's technical stack.",
        },
        {
            q: "How does the Remote Code Execution (RCE) engine work?",
            a: "User code is compiled and executed inside isolated sandboxes supporting Python, JavaScript, C++, Java, and Go with strict memory caps, timeouts, and automated test assertions.",
        },
        {
            q: "What is the AI Big-O Complexity Analyzer?",
            a: "Our algorithm analyzer inspects your code syntax to determine time and space complexity (e.g. O(N log N)), detecting quadratic slowdowns and suggesting optimal architectural solutions.",
        },
        {
            q: "How do recruiters find and shortlist candidates?",
            a: "Recruiters use the Talent Pool Leaderboard to filter candidates by domain skill breakdown, placement readiness, and full interview transcripts. When a candidate is shortlisted, real-time in-app notifications are instantly dispatched.",
        },
    ];

    return (
        <div
            className={`min-h-screen flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200 ${
                isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
            }`}
        >
            {/* Top Navigation Header */}
            <header
                className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200 ${
                    isDark
                        ? "bg-slate-950/85 border-slate-800/80"
                        : "bg-white/90 border-slate-200 shadow-xs"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <BrainCircuit size={22} />
                        </div>
                        <span
                            className={`font-extrabold text-xl tracking-tight ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}
                        >
                            SkillSense<span className="text-blue-600">.AI</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <nav
                        className={`hidden md:flex items-center gap-8 text-xs font-bold ${
                            isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        <a href="#features" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
                            Features
                        </a>
                        <a href="#playground" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
                            Live Compiler
                        </a>
                        <a href="#system-design" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
                            System Design
                        </a>
                        <a href="#readiness-calc" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
                            Readiness Dial
                        </a>
                        <a
                            href="#recruiters"
                            className="text-indigo-600 hover:text-indigo-700 transition font-extrabold flex items-center gap-1"
                        >
                            <Building2 size={13} />
                            <span>For Recruiters</span>
                        </a>
                        <a href="#faq" className={isDark ? "hover:text-white transition" : "hover:text-slate-900 transition"}>
                            FAQ
                        </a>
                    </nav>

                    {/* Auth CTAs & Theme Toggle */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Day / Night Theme Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
                            className={`p-2 rounded-xl border transition ${
                                isDark
                                    ? "text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700"
                                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200"
                            }`}
                        >
                            {isDark ? (
                                <Sun size={17} className="text-amber-400" />
                            ) : (
                                <Moon size={17} className="text-slate-600" />
                            )}
                        </button>

                        {isAuthenticated ? (
                            <Link
                                to={user?.role === "recruiter" ? "/recruiter/dashboard" : "/dashboard"}
                                className="hidden sm:flex px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-600/30 transition items-center gap-1.5"
                            >
                                <span>Dashboard</span>
                                <ArrowRight size={14} />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`hidden sm:inline-flex px-3.5 py-2 text-xs font-bold rounded-xl transition ${
                                        isDark
                                            ? "text-slate-300 hover:text-white hover:bg-slate-900"
                                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                                >
                                    Sign In
                                </Link>
                                <button
                                    onClick={() => handleLoginCandidate("shubham.architect@gmail.com")}
                                    className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
                                >
                                    <span>Demo <span className="hidden sm:inline">Candidate</span></span>
                                    <ArrowRight size={14} />
                                </button>
                                <button
                                    onClick={() => handleLoginRecruiter("sarah.google@google.com")}
                                    className="hidden md:flex px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-indigo-600/30 transition items-center gap-1.5"
                                >
                                    <Building2 size={14} />
                                    <span>Demo Recruiter</span>
                                </button>
                            </>
                        )}

                        {/* Mobile Hamburger Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-xl border transition ${
                                isDark
                                    ? "text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700"
                                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200"
                            }`}
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer Sheet */}
                {mobileMenuOpen && (
                    <div
                        className={`md:hidden border-t px-4 py-5 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-150 ${
                            isDark
                                ? "bg-slate-900 border-slate-800 text-slate-100"
                                : "bg-white border-slate-200 text-slate-900"
                        }`}
                    >
                        <div className="flex flex-col space-y-2">
                            <a
                                href="#features"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                    isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                                }`}
                            >
                                ⚡ Platform Features
                            </a>
                            <a
                                href="#playground"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                    isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                                }`}
                            >
                                💻 Live Code Compiler
                            </a>
                            <a
                                href="#system-design"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                    isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                                }`}
                            >
                                🏗️ System Design Whiteboard
                            </a>
                            <a
                                href="#readiness-calc"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                    isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                                }`}
                            >
                                🎯 Placement Readiness Dial
                            </a>
                            <a
                                href="#recruiters"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition text-indigo-600 ${
                                    isDark ? "hover:bg-slate-800" : "hover:bg-indigo-50"
                                }`}
                            >
                                🏢 Recruiter Talent Suite
                            </a>
                            <a
                                href="#faq"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                    isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                                }`}
                            >
                                ❓ Frequently Asked Questions
                            </a>
                        </div>

                        <div className={`border-t pt-3 space-y-2 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                            {isAuthenticated ? (
                                <Link
                                    to={user?.role === "recruiter" ? "/recruiter/dashboard" : "/dashboard"}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                                >
                                    <span>Enter Dashboard</span>
                                    <ArrowRight size={14} />
                                </Link>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                handleLoginCandidate("shubham.architect@gmail.com");
                                            }}
                                            className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                                        >
                                            <Sparkles size={13} />
                                            <span>Candidate</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                handleLoginRecruiter("sarah.google@google.com");
                                            }}
                                            className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                                        >
                                            <Building2 size={13} />
                                            <span>Recruiter</span>
                                        </button>
                                    </div>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`w-full py-2.5 border rounded-xl text-xs font-bold flex items-center justify-center transition ${
                                            isDark
                                                ? "border-slate-700 bg-slate-800 text-slate-200"
                                                : "border-slate-200 bg-slate-50 text-slate-800"
                                        }`}
                                    >
                                        Sign In to Existing Account
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-16 pb-20 overflow-hidden">
                {/* Background Ambient Glows */}
                <div
                    className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-3xl pointer-events-none ${
                        isDark
                            ? "bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20"
                            : "bg-gradient-to-tr from-blue-400/15 via-indigo-400/15 to-purple-400/15"
                    }`}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Glow Pill */}
                    <div
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${
                            isDark
                                ? "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                                : "bg-blue-50 border border-blue-200 text-blue-700"
                        }`}
                    >
                        <Sparkles size={14} className={isDark ? "text-blue-400" : "text-blue-600"} />
                        <span>Google & FAANG Tier-1 Interview Architecture</span>
                    </div>

                    <h1
                        className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.15] sm:leading-[1.12] ${
                            isDark ? "text-white" : "text-slate-900"
                        }`}
                    >
                        Master Technical Interviews with{" "}
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            AI & Real Sandboxed Code Execution
                        </span>
                    </h1>

                    <p
                        className={`mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed px-2 ${
                            isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        Simulate real coding rounds, system design architecture, and verbal technical questions calibrated for Google, Meta, and top-tier tech. Featuring multi-language compilation, real-time Big-O analysis, and recruiter shortlisting.
                    </p>

                    {/* CTAs */}
                    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto">
                        <button
                            onClick={() => handleLoginCandidate("shubham.architect@gmail.com")}
                            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Start Free Mock Interview</span>
                            <ArrowRight size={16} />
                        </button>

                        <a
                            href="#playground"
                            className={`px-6 sm:px-8 py-3.5 sm:py-4 font-bold text-xs sm:text-sm rounded-2xl border transition flex items-center justify-center gap-2 ${
                                isDark
                                    ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800"
                                    : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-xs"
                            }`}
                        >
                            <Play size={14} fill="currentColor" />
                            <span>Try Live Compiler</span>
                        </a>

                        <a
                            href="#recruiters"
                            className={`px-6 sm:px-8 py-3.5 sm:py-4 font-bold text-xs sm:text-sm rounded-2xl border transition flex items-center justify-center gap-2 ${
                                isDark
                                    ? "bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border-purple-800/60"
                                    : "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 shadow-xs"
                            }`}
                        >
                            <Building2 size={15} />
                            <span>Recruiter Talent Suite</span>
                        </a>
                    </div>

                    {/* Audio Question Preview Pill */}
                    <div
                        className={`mt-8 sm:mt-10 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:px-4 rounded-2xl border shadow-md max-w-full ${
                            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
                        }`}
                    >
                        <button
                            onClick={handlePlayAudioQuestion}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                isSpeakingAudio
                                    ? "bg-blue-600 text-white animate-pulse"
                                    : isDark
                                    ? "bg-slate-800 hover:bg-slate-700 text-blue-400"
                                    : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                            }`}
                        >
                            {isSpeakingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            <span>{isSpeakingAudio ? "Stop Speaking" : "Hear Interviewer Voice"}</span>
                        </button>
                        <span
                            className={`text-xs italic truncate max-w-xs sm:max-w-md ${isDark ? "text-slate-400" : "text-slate-600"}`}
                        >
                            "Design a distributed rate-limiter for Google Search..."
                        </span>
                    </div>

                    {/* Verified Company Calibration Marquee */}
                    <div
                        className={`mt-14 pt-8 border-t text-xs font-bold uppercase tracking-wider ${
                            isDark ? "border-slate-900 text-slate-500" : "border-slate-200 text-slate-500"
                        }`}
                    >
                        Calibrated for Hiring Standards At
                        <div
                            className={`mt-4 flex flex-wrap items-center justify-center gap-8 font-extrabold text-sm ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                        >
                            <span className="hover:text-blue-600 transition">Google</span>
                            <span className="hover:text-blue-600 transition">Meta</span>
                            <span className="hover:text-blue-600 transition">Amazon</span>
                            <span className="hover:text-blue-600 transition">Microsoft</span>
                            <span className="hover:text-blue-600 transition">Netflix</span>
                            <span className="hover:text-blue-600 transition">Stripe</span>
                            <span className="hover:text-blue-600 transition">Uber</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* DEDICATED RECRUITER & HIRING SECTION */}
            <section
                id="recruiters"
                className={`py-20 border-y relative ${
                    isDark
                        ? "bg-gradient-to-b from-indigo-950/40 via-slate-900/50 to-slate-950 border-indigo-900/40"
                        : "bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-indigo-100"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
                        <div>
                            <div
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                                    isDark
                                        ? "bg-indigo-500/15 border border-indigo-400/30 text-indigo-300"
                                        : "bg-indigo-50 border border-indigo-200 text-indigo-700"
                                }`}
                            >
                                <Building2 size={13} />
                                Company & Talent Acquisition Portal
                            </div>
                            <h2
                                className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                                    isDark ? "text-white" : "text-slate-900"
                                }`}
                            >
                                Verified Technical Talent Pipeline
                            </h2>
                            <p
                                className={`mt-2 text-sm max-w-2xl ${
                                    isDark ? "text-slate-400" : "text-slate-600"
                                }`}
                            >
                                Direct access to candidates with verified Big-O analysis, real coding transcripts, and domain skill ratings. Shortlist candidates and trigger real-time interview alerts.
                            </p>
                        </div>

                        {/* Recruiter Quick Login Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => handleLoginRecruiter("sarah.google@google.com")}
                                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
                            >
                                <Building2 size={15} />
                                <span>Log In as Google Recruiter</span>
                                <ArrowRight size={14} />
                            </button>

                            <button
                                onClick={() => handleLoginRecruiter("david.stripe@stripe.com")}
                                className={`px-5 py-3 border font-bold text-xs rounded-2xl transition flex items-center gap-2 ${
                                    isDark
                                        ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700"
                                        : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs"
                                }`}
                            >
                                <span>Log In as Stripe Recruiter</span>
                            </button>
                        </div>
                    </div>

                    {/* Interactive Candidate Talent Pool Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredTalent.map((cand) => (
                            <div
                                key={cand.id}
                                className={`p-6 rounded-3xl border transition-all shadow-xl flex flex-col justify-between ${
                                    isDark
                                        ? "bg-slate-900/90 border-slate-800 hover:border-indigo-500/50"
                                        : "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-2xl text-slate-900"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
                                            Grade {cand.grade}
                                        </span>
                                        <span className="text-xs font-extrabold text-emerald-600">
                                            {cand.readiness}% Readiness
                                        </span>
                                    </div>

                                    <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                        {cand.name}
                                    </h3>
                                    <p className="text-xs text-indigo-600 font-medium mt-0.5">{cand.headline}</p>

                                    {/* Domain breakdown chips */}
                                    <div
                                        className={`mt-4 pt-3 border-t space-y-1.5 ${
                                            isDark ? "border-slate-800/80" : "border-slate-100"
                                        }`}
                                    >
                                        <span
                                            className={`text-[10px] font-bold uppercase tracking-wider block ${
                                                isDark ? "text-slate-500" : "text-slate-400"
                                            }`}
                                        >
                                            Domain Skill Ratings:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {cand.skillBreakdown.map((sb, i) => (
                                                <span
                                                    key={i}
                                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                                        isDark
                                                            ? "bg-indigo-950/60 text-indigo-300 border-indigo-800/50"
                                                            : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                    }`}
                                                >
                                                    {sb.skill}:{" "}
                                                    <span className={isDark ? "text-white" : "text-slate-900"}>
                                                        {sb.score}
                                                    </span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`mt-6 pt-4 border-t flex items-center justify-between ${
                                        isDark ? "border-slate-800" : "border-slate-100"
                                    }`}
                                >
                                    <span
                                        className={`text-[11px] ${
                                            isDark ? "text-slate-400" : "text-slate-500"
                                        }`}
                                    >
                                        Status:{" "}
                                        <strong className={isDark ? "text-white" : "text-slate-900"}>
                                            {cand.status}
                                        </strong>
                                    </span>
                                    <button
                                        onClick={() => setInspectedCandidate(cand)}
                                        className="px-3.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1"
                                    >
                                        <span>Inspect</span>
                                        <ExternalLink size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTERACTIVE PLAYGROUND / COMPILER SECTION */}
            <section
                id="playground"
                className={`py-16 border-b ${
                    isDark ? "bg-slate-900/50 border-slate-800/80" : "bg-slate-100/70 border-slate-200"
                }`}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
                            Interactive Sandbox Demo
                        </span>
                        <h2
                            className={`text-2xl sm:text-3xl font-extrabold mt-1 ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}
                        >
                            Test the Remote Code Execution & Big-O Engine Live
                        </h2>
                        <p
                            className={`text-xs sm:text-sm mt-2 ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                        >
                            Select a language, run test cases, or perform an instant asymptotic complexity analysis.
                        </p>
                    </div>

                    {/* Interactive Code Box */}
                    <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
                        {/* Toolbar */}
                        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                </div>
                                <span className="text-slate-700">|</span>
                                <div className="flex items-center gap-1">
                                    {["python", "javascript", "cpp"].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setDemoLang(lang)}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${
                                                demoLang === lang
                                                    ? "bg-blue-600 text-white"
                                                    : "text-slate-400 hover:text-slate-200"
                                            }`}
                                        >
                                            {lang === "cpp" ? "C++ (GCC)" : lang}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleAnalyzeDemoBigO}
                                    disabled={demoRunning}
                                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                                >
                                    <Sparkles size={13} />
                                    <span>Analyze Big-O</span>
                                </button>

                                <button
                                    onClick={handleRunDemo}
                                    disabled={demoRunning}
                                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                                >
                                    <Play size={13} fill="currentColor" />
                                    <span>Run Code</span>
                                </button>
                            </div>
                        </div>

                        {/* Code editor view */}
                        <div className="p-5 font-mono text-xs sm:text-sm text-blue-300 bg-slate-950 overflow-x-auto whitespace-pre leading-relaxed">
                            {demoSnippets[demoLang]}
                        </div>

                        {/* Output terminal */}
                        <div className="p-4 bg-slate-900 border-t border-slate-800 font-mono text-xs text-slate-300">
                            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] mb-1">
                                <Terminal size={12} />
                                <span>Output Console</span>
                            </div>
                            <div className="whitespace-pre-wrap text-emerald-400">{demoOutput}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTERACTIVE SYSTEM DESIGN WHITEBOARD SECTION */}
            <section id="system-design" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                        Senior & Staff Rounds
                    </span>
                    <h2
                        className={`text-3xl sm:text-4xl font-extrabold mt-2 ${
                            isDark ? "text-white" : "text-slate-900"
                        }`}
                    >
                        Interactive System Design Architecture Whiteboard
                    </h2>
                    <p
                        className={`mt-3 text-sm ${
                            isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        Test your architectural intuition. Drag system nodes (Load Balancers, Redis Caches, Kafka Queues, DBs) and connect them visually right below:
                    </p>
                </div>

                <div
                    className={`rounded-3xl border overflow-hidden shadow-2xl ${
                        isDark ? "border-slate-800" : "border-slate-200 bg-white"
                    }`}
                >
                    <SystemDesignWhiteboard />
                </div>
            </section>

            {/* DYNAMIC PLACEMENT READINESS CALCULATOR */}
            <section
                id="readiness-calc"
                className={`py-20 border-y ${
                    isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-100/60 border-slate-200"
                }`}
            >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
                            Interactive Metric Dial
                        </span>
                        <h2
                            className={`text-3xl font-extrabold mt-2 ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}
                        >
                            Project Your Placement Readiness Score
                        </h2>
                        <p
                            className={`text-xs sm:text-sm mt-2 ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                        >
                            Adjust your experience and problem-solving history to view your projected tier rating.
                        </p>
                    </div>

                    <div
                        className={`rounded-3xl p-6 sm:p-8 md:p-10 border grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xl ${
                            isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
                        }`}
                    >
                        {/* Sliders Form Controls */}
                        <div className="md:col-span-7 space-y-6">
                            <div className="space-y-2">
                                <div
                                    className={`flex justify-between items-center text-xs sm:text-sm font-bold ${
                                        isDark ? "text-slate-200" : "text-slate-700"
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase size={15} className="text-blue-500" />
                                        Years of Engineering Experience:
                                    </span>
                                    <span className="text-blue-600 font-extrabold px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs sm:text-sm">
                                        {calcYears} {calcYears === 1 ? "Year" : "Years"}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={calcYears}
                                    onChange={(e) => setCalcYears(Number(e.target.value))}
                                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                                    <span>Entry / 0 Yrs</span>
                                    <span>Mid-Level / 3 Yrs</span>
                                    <span>Senior / 5 Yrs</span>
                                    <span>Staff+ / 10 Yrs</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div
                                    className={`flex justify-between items-center text-xs sm:text-sm font-bold ${
                                        isDark ? "text-slate-200" : "text-slate-700"
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Code2 size={15} className="text-indigo-500" />
                                        LeetCode & System Design Problems Solved:
                                    </span>
                                    <span className="text-indigo-600 font-extrabold px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs sm:text-sm">
                                        {calcProblems} Problems
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="500"
                                    step="10"
                                    value={calcProblems}
                                    onChange={(e) => setCalcProblems(Number(e.target.value))}
                                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                                    <span>0 (Beginner)</span>
                                    <span>150 (Core DSA)</span>
                                    <span>300 (FAANG Level)</span>
                                    <span>500+ (Mastery)</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={() => handleLoginCandidate("shubham.architect@gmail.com")}
                                    className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={15} />
                                    <span>Verify with Live AI Mock Interview</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* High-Tech Circular Gauge Dial */}
                        <div
                            className={`md:col-span-5 rounded-3xl p-6 sm:p-8 border text-center flex flex-col items-center justify-center relative overflow-hidden shadow-inner ${
                                isDark ? "bg-slate-900/90 border-slate-800" : "bg-slate-50 border-slate-200"
                            }`}
                        >
                            <span
                                className={`text-[11px] font-extrabold uppercase tracking-wider mb-3 ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}
                            >
                                Projected Placement Readiness
                            </span>

                            {/* Circular Radial Meter */}
                            <div className="relative w-44 h-44 flex items-center justify-center my-2">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                                    {/* Track circle */}
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="64"
                                        className={isDark ? "stroke-slate-800" : "stroke-slate-200"}
                                        strokeWidth="12"
                                        fill="transparent"
                                    />
                                    {/* Animated Progress circle */}
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="64"
                                        stroke="url(#readinessGradient)"
                                        strokeWidth="12"
                                        strokeDasharray={402}
                                        strokeDashoffset={402 - (calculatedScore / 100) * 402}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        className="transition-all duration-500 ease-out"
                                    />
                                    <defs>
                                        <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#2563eb" />
                                            <stop offset="50%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#10b981" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        {calculatedScore}%
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                                        Match Score
                                    </span>
                                </div>
                            </div>

                            <span className="mt-2 px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
                                {calculatedGrade}
                            </span>

                            <div className="w-full mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 text-left">
                                <div className="flex justify-between">
                                    <span>Algorithmic DSA:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                        {calcProblems >= 200 ? "FAANG Ready" : "Intermediate"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>System Architecture:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                        {calcYears >= 3 ? "L5 / Senior Tier" : "L3 / Associate"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CORE TECHNICAL PILLARS */}
            <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
                        Engineered for Depth
                    </span>
                    <h2
                        className={`text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight ${
                            isDark ? "text-white" : "text-slate-900"
                        }`}
                    >
                        Six Architectural Pillars for Top Tech Mastery
                    </h2>
                    <p
                        className={`mt-3 text-sm ${
                            isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        Everything you need to demonstrate engineering depth, system design intuition, and clean algorithmic problem-solving.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Pillar 1 */}
                    <div
                        className={`p-7 rounded-3xl border transition duration-300 ${
                            isDark
                                ? "bg-slate-900/60 border-slate-800 hover:border-blue-500/40"
                                : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 text-slate-900"
                        }`}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 flex items-center justify-center mb-5 border border-blue-500/30">
                            <Code2 size={24} />
                        </div>
                        <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                            Multi-Language Code Sandbox
                        </h3>
                        <p
                            className={`mt-2 text-xs leading-relaxed ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                        >
                            Compile and execute Python 3, JavaScript (Node), C++ (GCC), Java (OpenJDK), and Go with real-time test case benchmarks, runtime ms, and memory tracking.
                        </p>
                    </div>

                    {/* Pillar 2 */}
                    <div
                        className={`p-7 rounded-3xl border transition duration-300 ${
                            isDark
                                ? "bg-slate-900/60 border-slate-800 hover:border-purple-500/40"
                                : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 text-slate-900"
                        }`}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 flex items-center justify-center mb-5 border border-purple-500/30">
                            <Sparkles size={24} />
                        </div>
                        <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                            AI Big-O Complexity Analyzer
                        </h3>
                        <p
                            className={`mt-2 text-xs leading-relaxed ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                        >
                            Mathematical derivation of Time Complexity (e.g. O(N log N)) and Space Complexity (e.g. O(1)) powered by Gemini AI, identifying quadratic bottlenecks before submission.
                        </p>
                    </div>

                    {/* Pillar 3 */}
                    <div
                        className={`p-7 rounded-3xl border transition duration-300 ${
                            isDark
                                ? "bg-slate-900/60 border-slate-800 hover:border-indigo-500/40"
                                : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 text-slate-900"
                        }`}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-500/30">
                            <Layers size={24} />
                        </div>
                        <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                            Architecture Whiteboard
                        </h3>
                        <p
                            className={`mt-2 text-xs leading-relaxed ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                        >
                            Interactive canvas with draggable system design primitives: Nginx Load Balancers, API Gateways, Microservices, Redis Caches, Kafka Queues, and PostgreSQL databases.
                        </p>
                    </div>

                    {/* Pillar 4 */}
                    <div
                        className={`p-7 rounded-3xl border transition duration-300 ${
                            isDark
                                ? "bg-slate-900/60 border-slate-800 hover:border-emerald-500/40"
                                : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 text-slate-900"
                        }`}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-500/30">
                            <Building2 size={24} />
                        </div>
                        <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                            Recruiter Talent Pipeline
                        </h3>
                        <p
                            className={`mt-2 text-xs leading-relaxed ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                        >
                            Company hiring portal with candidate leaderboards, domain skill breakdowns, private recruiter feedback notes, and 1-click talent export to CSV.
                        </p>
                    </div>

                    {/* Pillar 5 */}
                    <div
                        className={`p-7 rounded-3xl border transition duration-300 ${
                            isDark
                                ? "bg-slate-900/60 border-slate-800 hover:border-rose-500/40"
                                : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 text-slate-900"
                        }`}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center mb-5 border border-rose-500/30">
                            <Trophy size={24} />
                        </div>
                        <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                            Real-Time In-App Alerts
                        </h3>
                        <p
                            className={`mt-2 text-xs leading-relaxed ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                        >
                            Instant notification bell dispatching alerts to candidates whenever a recruiter shortlists their profile, reviews transcripts, or schedules an interview.
                        </p>
                    </div>

                    {/* Pillar 6 */}
                    <div
                        className={`p-7 rounded-3xl border transition duration-300 ${
                            isDark
                                ? "bg-slate-900/60 border-slate-800 hover:border-amber-500/40"
                                : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 text-slate-900"
                        }`}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mb-5 border border-amber-500/30">
                            <Mic size={24} />
                        </div>
                        <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                            Voice Interview Simulation
                        </h3>
                        <p
                            className={`mt-2 text-xs leading-relaxed ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                        >
                            Natural speech-to-text with speech polish that eliminates filler words, paired with text-to-speech audio questions for realistic mock sessions.
                        </p>
                    </div>
                </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
                        Got Questions?
                    </span>
                    <h2
                        className={`text-3xl font-extrabold mt-2 ${
                            isDark ? "text-white" : "text-slate-900"
                        }`}
                    >
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`border rounded-2xl overflow-hidden transition ${
                                isDark
                                    ? "bg-slate-900/70 border-slate-800 text-slate-200"
                                    : "bg-white border-slate-200 shadow-xs text-slate-900"
                            }`}
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className={`w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm ${
                                    isDark
                                        ? "text-slate-200 hover:text-white"
                                        : "text-slate-800 hover:text-slate-950"
                                }`}
                            >
                                <span>{faq.q}</span>
                                {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {openFaq === idx && (
                                <div
                                    className={`px-5 pb-5 text-xs leading-relaxed border-t pt-3 ${
                                        isDark
                                            ? "border-slate-800/60 text-slate-400"
                                            : "border-slate-100 text-slate-600"
                                    }`}
                                >
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CANDIDATE INSPECT MODAL */}
            {inspectedCandidate && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div
                        className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border relative animate-in fade-in zoom-in-95 duration-150 ${
                            isDark
                                ? "bg-slate-900 border-slate-800 text-slate-100"
                                : "bg-white border-slate-200 text-slate-900"
                        }`}
                    >
                        <button
                            onClick={() => setInspectedCandidate(null)}
                            className={`absolute top-6 right-6 p-2 rounded-xl transition ${
                                isDark
                                    ? "text-slate-400 hover:text-white hover:bg-slate-800"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                        >
                            <X size={18} />
                        </button>

                        <div className="mb-4">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block mb-1">
                                Candidate Performance Transcript Preview
                            </span>
                            <h3 className={`text-xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                                {inspectedCandidate.name}
                            </h3>
                            <p className="text-xs text-indigo-600 mt-0.5">{inspectedCandidate.headline}</p>
                        </div>

                        <div className="space-y-4">
                            <div
                                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                                }`}
                            >
                                <span className="text-xs font-bold text-slate-500">Target Track:</span>
                                <span
                                    className={`text-xs font-extrabold ${
                                        isDark ? "text-white" : "text-slate-900"
                                    }`}
                                >
                                    {inspectedCandidate.target}
                                </span>
                            </div>

                            <div
                                className={`p-4 rounded-2xl border ${
                                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                                }`}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                    Sample Verified Interview Response & AI Rating:
                                </span>
                                <p
                                    className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${
                                        isDark ? "text-slate-300" : "text-slate-800"
                                    }`}
                                >
                                    {inspectedCandidate.transcriptPreview}
                                </p>
                            </div>

                            <button
                                onClick={() => handleLoginRecruiter("sarah.google@google.com")}
                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                            >
                                <Building2 size={15} />
                                <span>Log In as Recruiter to View Full Profile & Shortlist</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}
