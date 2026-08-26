import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup, login, socialLogin } from "../services/authService";
import {
    User,
    Mail,
    Lock,
    UserPlus,
    CheckCircle2,
    Eye,
    EyeOff,
    BrainCircuit,
    Sparkles,
    Building2,
    GraduationCap,
    Sun,
    Moon,
} from "lucide-react";
import SocialAuthModal from "../components/auth/SocialAuthModal";
import { useTheme } from "../context/ThemeContext";

function Signup() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const [role, setRole] = useState("candidate"); // 'candidate' | 'recruiter'
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyName: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Social modal state
    const [socialModal, setSocialModal] = useState({ isOpen: false, provider: "google" });

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name.trim()) {
            setError("Full name is required.");
            return;
        }
        if (!formData.email.trim()) {
            setError("Valid email is required.");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (role === "recruiter" && !formData.companyName.trim()) {
            setError("Company or organization name is required for recruiter accounts.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                role,
            };

            await signup(payload);

            // Auto-login upon registration
            const response = await login({
                email: formData.email,
                password: formData.password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            if (response.data.user?.role === "recruiter") {
                navigate("/recruiter/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            const message = err.response?.data?.message;
            if (message === "User with this email already exists" || message?.includes("already exists")) {
                setError("An account with this email already exists. Please login instead.");
            } else {
                setError(message || "Registration failed. Please try again.");
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

            <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

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
                            {role === "recruiter" ? "Hire Verified Top Technical Talent" : "Master Your Technical Interviews"}
                        </h1>
                        <p className="mt-3 text-xs text-blue-100/90 leading-relaxed">
                            {role === "recruiter"
                                ? "Access candidate placement rankings, verified Gemini mock reports, and shortlist candidates with one click."
                                : "Upload your resume, practice company-tailored mock rounds, and measure placement readiness."}
                        </p>
                    </div>

                    <div className="space-y-2.5 pt-6 border-t border-white/15 text-xs text-blue-50 font-medium">
                        {role === "recruiter" ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-blue-200" />
                                    <span>Access Candidate Talent Leaderboard</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-blue-200" />
                                    <span>Inspect In-Depth Interview Transcripts</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-blue-200" />
                                    <span>One-Click Shortlist & Status Tracking</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-blue-200" />
                                    <span>Dynamic Gemini AI Questioning</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-blue-200" />
                                    <span>Company & Difficulty Calibration</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-blue-200" />
                                    <span>Detailed Placement Readiness Scores</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Form Card */}
                <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
                    <div className="mb-5">
                        {/* Role Switcher Tabs */}
                        <div
                            className={`flex p-1 rounded-2xl border mb-5 ${
                                isDark
                                    ? "bg-slate-800/90 border-slate-700/80"
                                    : "bg-slate-100 border-slate-200"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => setRole("candidate")}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                    role === "candidate"
                                        ? "bg-blue-600 text-white shadow-xs"
                                        : isDark
                                        ? "text-slate-400 hover:text-slate-200"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <GraduationCap size={15} />
                                <span>I am a Candidate</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("recruiter")}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                    role === "recruiter"
                                        ? "bg-indigo-600 text-white shadow-xs"
                                        : isDark
                                        ? "text-slate-400 hover:text-slate-200"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <Building2 size={15} />
                                <span>I am a Recruiter</span>
                            </button>
                        </div>

                        <h2 className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            {role === "recruiter" ? "Create Recruiter Account" : "Create Candidate Account"}
                        </h2>
                        <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {role === "recruiter" ? "Start shortlisting top talent with verified technical analytics." : "Begin your AI mock interview journey."}
                        </p>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
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
                            <span>Google</span>
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
                            <span>GitHub</span>
                        </button>
                    </div>

                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className={`w-full border-t ${isDark ? "border-slate-800" : "border-slate-200"}`} />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
                            <span className={`px-3 ${isDark ? "bg-slate-900" : "bg-white"}`}>Or create password</span>
                        </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-3.5">
                        {/* Name Input */}
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                                isDark ? "text-slate-300" : "text-slate-700"
                            }`}>
                                Full Name
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder={role === "recruiter" ? "Sarah Jenkins" : "Jane Doe"}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition ${
                                        isDark
                                            ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500"
                                            : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white"
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Company Name (For Recruiters) */}
                        {role === "recruiter" && (
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                                    isDark ? "text-slate-300" : "text-slate-700"
                                }`}>
                                    Company / Organization
                                </label>
                                <div className="relative">
                                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Google, Stripe, Microsoft, TechCorp"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition ${
                                            isDark
                                                ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500"
                                                : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white"
                                        }`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                                isDark ? "text-slate-300" : "text-slate-700"
                            }`}>
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder={role === "recruiter" ? "sarah@company.com" : "jane@example.com"}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition ${
                                        isDark
                                            ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500"
                                            : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white"
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                                isDark ? "text-slate-300" : "text-slate-700"
                            }`}>
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition ${
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
                            className={`w-full py-3 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2 text-white ${
                                role === "recruiter"
                                    ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25"
                                    : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/25"
                            }`}
                        >
                            <UserPlus size={15} />
                            {loading ? "Creating Account..." : role === "recruiter" ? "Create Recruiter Account" : "Create Free Account"}
                        </button>
                    </form>

                    <p className={`text-center text-xs mt-5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">
                            Sign In
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
                role={role}
            />
        </div>
    );
}

export default Signup;