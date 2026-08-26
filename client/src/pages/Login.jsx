import { useState } from "react";
import { login, socialLogin } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, BrainCircuit, Sparkles, CheckCircle2, Building2, User, ArrowRight, Sun, Moon } from "lucide-react";
import SocialAuthModal from "../components/auth/SocialAuthModal";
import { useTheme } from "../context/ThemeContext";

function Login() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Social modal state
    const [socialModal, setSocialModal] = useState({ isOpen: false, provider: "google" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");

            const response = await login(formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            if (response.data.user?.role === "recruiter") {
                navigate("/recruiter/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = async (email, role = "candidate") => {
        try {
            setLoading(true);
            setError("");
            const response = await login({ email, password: "Password123!" });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            if (response.data.user?.role === "recruiter" || role === "recruiter") {
                navigate("/recruiter/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            console.warn("Backend connecting, using local demo session:", err.message);
            const demoUser = role === "recruiter" ? {
                id: "6a8f5bfc8d8ecfa28386e16f",
                name: "Sarah Jenkins",
                email: "sarah.google@google.com",
                role: "recruiter",
                companyName: "Google",
                headline: "Staff Technical Recruiter at Google",
            } : {
                id: "6a8f5bfc8d8ecfa28386e16e",
                name: "Shubham Gupta",
                email: "shubham.architect@gmail.com",
                role: "candidate",
                headline: "Senior Full-Stack Architect • Distributed Systems & React",
                companyName: "",
            };

            localStorage.setItem("token", `demo_token_${Date.now()}`);
            localStorage.setItem("user", JSON.stringify(demoUser));

            if (role === "recruiter") {
                navigate("/recruiter/dashboard");
            } else {
                navigate("/dashboard");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSocialAuth = async (socialData) => {
        const res = await socialLogin(socialData);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setSocialModal({ isOpen: false, provider: "google" });
        if (res.data.user?.role === "recruiter") {
            navigate("/recruiter/dashboard");
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-200 ${
                isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
            }`}
        >
            {/* Top Navigation Bar with Back & Theme Toggle */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-4 z-20">
                <Link
                    to="/"
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                        isDark
                            ? "text-slate-300 hover:text-white bg-slate-900 border-slate-800"
                            : "text-slate-700 hover:text-slate-900 bg-white border-slate-200 shadow-xs"
                    }`}
                >
                    <BrainCircuit size={16} className="text-blue-600" />
                    <span>← Back to SkillSense.AI</span>
                </Link>

                <button
                    type="button"
                    onClick={toggleTheme}
                    title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
                    className={`p-2 rounded-xl border transition ${
                        isDark
                            ? "text-slate-300 hover:text-white bg-slate-900 border-slate-800"
                            : "text-slate-700 hover:text-slate-900 bg-white border-slate-200 shadow-xs"
                    }`}
                >
                    {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-600" />}
                </button>
            </div>

            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

            <div
                className={`w-full max-w-4xl backdrop-blur-xl border rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-12 relative z-10 transition-colors ${
                    isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 text-slate-900"
                }`}
            >
                {/* Left Showcase Banner */}
                <div className="hidden md:flex md:col-span-5 flex-col justify-between bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative">
                    <div>
                        <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center mb-6 shadow-xs border border-white/20">
                            <BrainCircuit size={24} />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                            SkillSense AI Platform
                        </h1>
                        <p className="mt-3 text-xs text-blue-100/90 leading-relaxed">
                            Single sign-on for Candidates practicing mock interviews and Recruiters shortlisting verified top technical talent.
                        </p>
                    </div>

                    <div className="space-y-2.5 pt-6 border-t border-white/15 text-xs text-blue-50 font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-blue-200" />
                            <span>AI Mock Interviews & Compiler Sandbox</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-blue-200" />
                            <span>Company Recruiter Shortlisting Portal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-blue-200" />
                            <span>Verified Big-O Complexity Analytics</span>
                        </div>
                    </div>
                </div>

                {/* Right Form Card */}
                <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
                    <div className="mb-5">
                        <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2 ${
                                isDark
                                    ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                                    : "bg-blue-50 border border-blue-200 text-blue-700"
                            }`}
                        >
                            <Sparkles size={12} />
                            Portal Access
                        </div>
                        <h2 className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            Sign In to SkillSense.AI
                        </h2>
                    </div>

                    {/* 1-Click Fast Access Demo Accounts */}
                    <div
                        className={`mb-5 p-3.5 border rounded-2xl ${
                            isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
                        }`}
                    >
                        <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider block mb-2 ${
                                isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                        >
                            ⚡ Instant 1-Click Demo Profiles:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("shubham.architect@gmail.com", "candidate")}
                                className={`p-2.5 rounded-xl border text-left transition group ${
                                    isDark
                                        ? "bg-blue-950/50 hover:bg-blue-900/60 border-blue-800/40 text-blue-300"
                                        : "bg-blue-50/80 hover:bg-blue-100 border-blue-200 text-blue-900"
                                }`}
                            >
                                <p className="text-xs font-bold flex items-center gap-1">
                                    <User size={12} />
                                    <span>Shubham (Candidate)</span>
                                </p>
                                <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    Grade A+ • 92% Readiness
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickLogin("sarah.google@google.com", "recruiter")}
                                className={`p-2.5 rounded-xl border text-left transition group ${
                                    isDark
                                        ? "bg-indigo-950/50 hover:bg-indigo-900/60 border-indigo-800/40 text-indigo-300"
                                        : "bg-indigo-50/80 hover:bg-indigo-100 border-indigo-200 text-indigo-900"
                                }`}
                            >
                                <p className="text-xs font-bold flex items-center gap-1">
                                    <Building2 size={12} />
                                    <span>Sarah (Recruiter)</span>
                                </p>
                                <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    Google Staff Recruiter
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <button
                            type="button"
                            onClick={() => setSocialModal({ isOpen: true, provider: "google" })}
                            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition shadow-2xs ${
                                isDark
                                    ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200"
                                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                            }`}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            <span>Google 1-Click</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSocialModal({ isOpen: true, provider: "github" })}
                            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition shadow-2xs ${
                                isDark
                                    ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200"
                                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                            }`}
                        >
                            <svg className={`w-4 h-4 fill-current ${isDark ? "text-white" : "text-slate-900"}`} viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                            <span>GitHub 1-Click</span>
                        </button>
                    </div>

                    <div className="relative mb-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className={`w-full border-t ${isDark ? "border-slate-800" : "border-slate-200"}`} />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
                            <span className={`px-3 ${isDark ? "bg-slate-900" : "bg-white"}`}>Or enter email & password</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                                isDark ? "text-slate-300" : "text-slate-700"
                            }`}>
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="yourname@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full border rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition ${
                                        isDark
                                            ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500"
                                            : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white"
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                                isDark ? "text-slate-300" : "text-slate-700"
                            }`}>
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full border rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition ${
                                        isDark
                                            ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500"
                                            : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 font-bold">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            <LogIn size={15} />
                            {loading ? "Signing in..." : "Sign In to Portal"}
                        </button>
                    </form>

                    <p className={`text-center text-xs mt-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 font-bold hover:underline">
                            Register as Candidate or Recruiter
                        </Link>
                    </p>
                </div>
            </div>

            {/* Social Auth Modal */}
            <SocialAuthModal
                isOpen={socialModal.isOpen}
                provider={socialModal.provider}
                onClose={() => setSocialModal({ isOpen: false, provider: "google" })}
                onSocialSubmit={handleSocialAuth}
                defaultRole="candidate"
            />
        </div>
    );
}

export default Login;