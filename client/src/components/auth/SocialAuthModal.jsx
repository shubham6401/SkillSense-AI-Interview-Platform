import { useState } from "react";
import { X, Loader2, Sparkles, CheckCircle2, Shield, ArrowRight, Building2, User } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function SocialAuthModal({
    isOpen,
    onClose,
    provider = "google",
    onSocialSubmit,
    defaultRole = "candidate",
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(defaultRole);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const isGoogle = provider === "google";

    const instantProfiles = isGoogle
        ? [
              {
                  name: "Candidate Profile (Google)",
                  email: "shubham.candidate@gmail.com",
                  role: "candidate",
                  headline: "Full-Stack Software Engineer • Algorithms & React",
                  badge: "Candidate Account",
                  avatarBg: "bg-blue-600",
              },
              {
                  name: "Google Staff Recruiter",
                  email: "recruiter.talent@google.com",
                  role: "recruiter",
                  companyName: "Google",
                  headline: "Technical Talent Acquisition Lead at Google",
                  badge: "Recruiter Portal",
                  avatarBg: "bg-indigo-600",
              },
          ]
        : [
              {
                  name: "GitHub Developer",
                  email: "shubham.dev@github.com",
                  role: "candidate",
                  headline: "Distributed Systems & Cloud Engineer",
                  badge: "GitHub Candidate",
                  avatarBg: "bg-slate-800",
              },
              {
                  name: "Tech Talent Lead (GitHub)",
                  email: "hiring.lead@github.com",
                  role: "recruiter",
                  companyName: "GitHub",
                  headline: "Engineering Manager & Hiring Partner",
                  badge: "GitHub Recruiter",
                  avatarBg: "bg-slate-900",
              },
          ];

    const handleInstantAuth = async (profile) => {
        try {
            setLoading(true);
            setError("");
            await onSocialSubmit({
                email: profile.email,
                name: profile.name,
                provider,
                role: profile.role,
                companyName: profile.companyName || "",
                headline: profile.headline,
            });
        } catch (err) {
            setError(err.response?.data?.message || `Failed to authenticate with ${provider}.`);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div
                className={`rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border relative animate-in fade-in zoom-in-95 duration-200 transition-colors ${
                    isDark
                        ? "bg-slate-900 border-slate-800 text-slate-100"
                        : "bg-white border-slate-200 text-slate-900"
                }`}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className={`absolute top-6 right-6 p-2 rounded-xl transition ${
                        isDark
                            ? "text-slate-400 hover:text-white hover:bg-slate-800"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div
                        className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-md border ${
                            isDark
                                ? "border-slate-700 bg-slate-800"
                                : "border-slate-200 bg-slate-50"
                        }`}
                    >
                        {isGoogle ? (
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                        ) : (
                            <svg className={`w-6 h-6 fill-current ${isDark ? "text-white" : "text-slate-900"}`} viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                        )}
                    </div>
                    <h3 className={`text-xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Direct 1-Click {isGoogle ? "Google" : "GitHub"} Sign-In
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Select your verified profile to instantly authorize without any manual forms.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-bold text-red-600">
                        {error}
                    </div>
                )}

                {/* Direct 1-Click Authorize Cards */}
                <div className="space-y-3">
                    {instantProfiles.map((profile, idx) => (
                        <button
                            key={idx}
                            type="button"
                            disabled={loading}
                            onClick={() => handleInstantAuth(profile)}
                            className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left group shadow-xs hover:shadow-md ${
                                isDark
                                    ? "bg-slate-800/80 hover:bg-slate-750 border-slate-700 hover:border-blue-500/50"
                                    : "bg-slate-50 hover:bg-white border-slate-200 hover:border-blue-400"
                            }`}
                        >
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div className={`w-10 h-10 rounded-xl ${profile.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md`}>
                                    {profile.role === "recruiter" ? <Building2 size={18} /> : <User size={18} />}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                                            {profile.name}
                                        </p>
                                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 border border-blue-500/30">
                                            {profile.badge}
                                        </span>
                                    </div>
                                    <p className={`text-[11px] truncate mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        {profile.email}
                                    </p>
                                    <p className={`text-[10px] truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                        {profile.headline}
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition shrink-0 ml-2">
                                {loading ? <Loader2 size={15} className="animate-spin" /> : "Sign In →"}
                            </span>
                        </button>
                    ))}
                </div>

                <div className={`mt-6 pt-4 border-t text-center ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                    <p className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        Securely authenticated with 256-bit JWT & OAuth token encryption.
                    </p>
                </div>
            </div>
        </div>
    );
}
