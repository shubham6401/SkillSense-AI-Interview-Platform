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
} from "lucide-react";
import { login, socialLogin } from "../services/authService";
import SystemDesignWhiteboard from "../components/interview/SystemDesignWhiteboard";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

export default function Landing() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
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

    // Recruiter filter on landing page
    const [landingRecruiterFilter, setLandingRecruiterFilter] = useState("all");

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
            navigate("/login");
        }
    };

    const handleLoginRecruiter = async (email = "sarah.google@google.com") => {
        try {
            const res = await login({ email, password: "Password123!" });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/recruiter/dashboard");
        } catch (err) {
            navigate("/login");
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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200 landing-root">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 landing-header">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <BrainCircuit size={22} />
                        </div>
                        <span className="font-extrabold text-xl text-white tracking-tight">
                            SkillSense<span className="text-blue-500">.AI</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
                        <a href="#features" className="hover:text-white transition">
                            Features
                        </a>
                        <a href="#playground" className="hover:text-white transition">
                            Live Compiler
                        </a>
                        <a href="#system-design" className="hover:text-white transition">
                            System Design
                        </a>
                        <a href="#readiness-calc" className="hover:text-white transition">
                            Readiness Dial
                        </a>
                        <a href="#recruiters" className="hover:text-indigo-400 text-indigo-300 transition font-extrabold flex items-center gap-1">
                            <Building2 size={13} />
                            <span>For Recruiters</span>
                        </a>
                        <a href="#faq" className="hover:text-white transition">
                            FAQ
                        </a>
                    </nav>

                    {/* Auth CTAs & Theme Toggle */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        {/* Theme Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition border border-slate-700/80 landing-theme-toggle"
                        >
                            {theme === "dark" ? (
                                <Sun size={17} className="text-amber-400" />
                            ) : (
                                <Moon size={17} className="text-slate-300" />
                            )}
                        </button>

                        {isAuthenticated ? (
                            <Link
                                to={user?.role === "recruiter" ? "/recruiter/dashboard" : "/dashboard"}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
                            >
                                <span>Go to Dashboard</span>
                                <ArrowRight size={14} />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition"
                                >
                                    Sign In
                                </Link>
                                <button
                                    onClick={() => handleLoginCandidate("shubham.architect@gmail.com")}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
                                >
                                    <span>Demo Candidate</span>
                                    <ArrowRight size={14} />
                                </button>
                                <button
                                    onClick={() => handleLoginRecruiter("sarah.google@google.com")}
                                    className="hidden sm:flex px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-600/30 transition items-center gap-1.5"
                                >
                                    <Building2 size={14} />
                                    <span>Demo Recruiter</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-16 pb-20 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Glow Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in zoom-in-95 duration-200">
                        <Sparkles size={14} className="text-blue-400" />
                        <span>Google & FAANG Tier-1 Interview Architecture</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
                        Master Technical Interviews with{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                            AI & Real Sandboxed Code Execution
                        </span>
                    </h1>

                    <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Simulate real coding rounds, system design architecture, and verbal technical questions calibrated for Google, Meta, and top-tier tech. Featuring multi-language compilation, real-time Big-O analysis, and recruiter shortlisting.
                    </p>

                    {/* CTAs */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={() => handleLoginCandidate("shubham.architect@gmail.com")}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
                        >
                            <span>Start Free Mock Interview</span>
                            <ArrowRight size={16} />
                        </button>

                        <a
                            href="#playground"
                            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-2xl border border-slate-800 transition flex items-center gap-2"
                        >
                            <Play size={15} fill="currentColor" />
                            <span>Try Live Compiler</span>
                        </a>

                        <a
                            href="#recruiters"
                            className="px-6 py-4 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/60 font-bold text-sm rounded-2xl transition flex items-center gap-2"
                        >
                            <Building2 size={16} />
                            <span>Recruiter Talent Suite</span>
                        </a>
                    </div>

                    {/* Audio Question Preview Pill */}
                    <div className="mt-10 inline-flex items-center gap-3 p-2.5 px-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md">
                        <button
                            onClick={handlePlayAudioQuestion}
                            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                                isSpeakingAudio
                                    ? "bg-blue-600 text-white animate-pulse"
                                    : "bg-slate-800 hover:bg-slate-700 text-blue-400"
                            }`}
                        >
                            {isSpeakingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
                            <span>{isSpeakingAudio ? "Stop Speaking" : "Hear AI Interviewer Voice"}</span>
                        </button>
                        <span className="text-xs text-slate-400 italic">
                            "Design a distributed rate-limiter for Google Search..."
                        </span>
                    </div>

                    {/* Verified Company Calibration Marquee */}
                    <div className="mt-14 pt-8 border-t border-slate-900 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        Calibrated for Hiring Standards At
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-8 text-slate-400 font-extrabold text-sm">
                            <span className="hover:text-blue-400 transition">Google</span>
                            <span className="hover:text-blue-400 transition">Meta</span>
                            <span className="hover:text-blue-400 transition">Amazon</span>
                            <span className="hover:text-blue-400 transition">Microsoft</span>
                            <span className="hover:text-blue-400 transition">Netflix</span>
                            <span className="hover:text-blue-400 transition">Stripe</span>
                            <span className="hover:text-blue-400 transition">Uber</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* DEDICATED RECRUITER & HIRING SECTION */}
            <section id="recruiters" className="py-20 bg-gradient-to-b from-indigo-950/40 via-slate-900/50 to-slate-950 border-y border-indigo-900/40 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                                <Building2 size={13} />
                                Company & Talent Acquisition Portal
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                Verified Technical Talent Pipeline
                            </h2>
                            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
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
                                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs rounded-2xl transition flex items-center gap-2"
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
                                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-xl flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            Grade {cand.grade}
                                        </span>
                                        <span className="text-xs font-extrabold text-emerald-400">
                                            {cand.readiness}% Readiness
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-white">{cand.name}</h3>
                                    <p className="text-xs text-indigo-400 font-medium mt-0.5">{cand.headline}</p>

                                    {/* Domain breakdown chips */}
                                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                            Domain Skill Ratings:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {cand.skillBreakdown.map((sb, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-indigo-950/60 text-indigo-300 border border-indigo-800/50 px-2 py-0.5 rounded-md text-[10px] font-bold"
                                                >
                                                    {sb.skill}: <span className="text-white">{sb.score}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-400">
                                        Status: <strong className="text-white">{cand.status}</strong>
                                    </span>
                                    <button
                                        onClick={() => setInspectedCandidate(cand)}
                                        className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1"
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
            <section id="playground" className="py-16 bg-slate-900/50 border-b border-slate-800/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                            Interactive Sandbox Demo
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                            Test the Remote Code Execution & Big-O Engine Live
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 mt-2">
                            Select a language, run test cases, or perform an instant asymptotic complexity analysis.
                        </p>
                    </div>

                    {/* Interactive Code Box */}
                    <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
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
                    <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                        Senior & Staff Rounds
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                        Interactive System Design Architecture Whiteboard
                    </h2>
                    <p className="mt-3 text-slate-400 text-sm">
                        Test your architectural intuition. Drag system nodes (Load Balancers, Redis Caches, Kafka Queues, DBs) and connect them visually right below:
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                    <SystemDesignWhiteboard />
                </div>
            </section>

            {/* DYNAMIC PLACEMENT READINESS CALCULATOR */}
            <section id="readiness-calc" className="py-20 bg-slate-900/40 border-y border-slate-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                            Interactive Metric Dial
                        </span>
                        <h2 className="text-3xl font-extrabold text-white mt-2">
                            Project Your Placement Readiness Score
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 mt-2">
                            Adjust your experience and problem-solving history to view your projected tier rating.
                        </p>
                    </div>

                    <div className="bg-slate-950 rounded-3xl p-8 border border-slate-800 grid md:grid-cols-12 gap-8 items-center shadow-xl">
                        <div className="md:col-span-7 space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                                    <span>Years of Engineering Experience:</span>
                                    <span className="text-blue-400 font-extrabold">{calcYears} Years</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={calcYears}
                                    onChange={(e) => setCalcYears(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                                    <span>DSA & System Design Problems Solved:</span>
                                    <span className="text-blue-400 font-extrabold">{calcProblems} Problems</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="500"
                                    step="10"
                                    value={calcProblems}
                                    onChange={(e) => setCalcProblems(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            <button
                                onClick={() => handleLoginCandidate("shubham.architect@gmail.com")}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                            >
                                <span>Verify with Live AI Mock Interview →</span>
                            </button>
                        </div>

                        <div className="md:col-span-5 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 text-center flex flex-col items-center justify-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Projected Readiness:
                            </span>
                            <p className="text-5xl font-extrabold text-emerald-400 mt-2">
                                {calculatedScore}%
                            </p>
                            <span className="mt-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {calculatedGrade}
                            </span>
                            <p className="text-[11px] text-slate-400 mt-3">
                                Calibrated for Google L4/L5 & Top-Tier Product Engineering Teams.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CORE TECHNICAL PILLARS */}
            <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                        Engineered for Depth
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
                        Six Architectural Pillars for Top Tech Mastery
                    </h2>
                    <p className="mt-3 text-slate-400 text-sm">
                        Everything you need to demonstrate engineering depth, system design intuition, and clean algorithmic problem-solving.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Pillar 1: RCE Compiler */}
                    <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/30">
                            <Code2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Multi-Language Code Sandbox</h3>
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                            Compile and execute Python 3, JavaScript (Node), C++ (GCC), Java (OpenJDK), and Go with real-time test case benchmarks, runtime ms, and memory tracking.
                        </p>
                    </div>

                    {/* Pillar 2: Big-O Complexity */}
                    <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/30">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">AI Big-O Complexity Analyzer</h3>
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                            Mathematical derivation of Time Complexity (e.g. O(N log N)) and Space Complexity (e.g. O(1)) powered by Gemini AI, identifying quadratic bottlenecks before submission.
                        </p>
                    </div>

                    {/* Pillar 3: System Design Whiteboard */}
                    <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/30">
                            <Layers size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Architecture Whiteboard</h3>
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                            Interactive canvas with draggable system design primitives: Nginx Load Balancers, API Gateways, Microservices, Redis Caches, Kafka Queues, and PostgreSQL databases.
                        </p>
                    </div>

                    {/* Pillar 4: Recruiter Hub */}
                    <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/30">
                            <Building2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Recruiter Talent Pipeline</h3>
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                            Company hiring portal with candidate leaderboards, domain skill breakdowns, private recruiter feedback notes, and 1-click talent export to CSV.
                        </p>
                    </div>

                    {/* Pillar 5: Candidate Real-Time Notifications */}
                    <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-5 border border-rose-500/30">
                            <Trophy size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Real-Time In-App Alerts</h3>
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                            Instant notification bell dispatching alerts to candidates whenever a recruiter shortlists their profile, reviews transcripts, or schedules an interview.
                        </p>
                    </div>

                    {/* Pillar 6: Speech & Audio Synthesis */}
                    <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/30">
                            <Mic size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Voice Interview Simulation</h3>
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                            Natural speech-to-text with speech polish that eliminates filler words, paired with text-to-speech audio questions for realistic mock sessions.
                        </p>
                    </div>
                </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                        Got Questions?
                    </span>
                    <h2 className="text-3xl font-extrabold text-white mt-2">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-200 hover:text-white"
                            >
                                <span>{faq.q}</span>
                                {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {openFaq === idx && (
                                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CANDIDATE INSPECT MODAL ON LANDING PAGE */}
            {inspectedCandidate && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 relative animate-in fade-in zoom-in-95 duration-150 text-slate-100">
                        <button
                            onClick={() => setInspectedCandidate(null)}
                            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                            <X size={18} />
                        </button>

                        <div className="mb-4">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block mb-1">
                                Candidate Performance Transcript Preview
                            </span>
                            <h3 className="text-xl font-extrabold text-white">{inspectedCandidate.name}</h3>
                            <p className="text-xs text-indigo-300 mt-0.5">{inspectedCandidate.headline}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400">Target Track:</span>
                                <span className="text-xs font-extrabold text-white">{inspectedCandidate.target}</span>
                            </div>

                            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                                    Sample Verified Interview Response & AI Rating:
                                </span>
                                <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
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
