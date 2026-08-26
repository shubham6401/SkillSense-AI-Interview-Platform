import { Sparkles, ArrowRight, Mic, Award, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DashboardHero({ user, dashboard }) {
    const navigate = useNavigate();
    const readiness = Number(dashboard?.placementReadiness) || 0;

    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-5 sm:p-8 md:p-10 shadow-xl border border-slate-800">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
                {/* Left Text */}
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
                        <Sparkles size={13} />
                        AI Placement Readiness System
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                        Welcome Back, <span className="gradient-text bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">{user?.name || "Candidate"}</span> 👋
                    </h1>

                    <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl">
                        Sharpen your technical interview responses, get instant Gemini AI evaluation, and track your placement readiness with deep analytics.
                    </p>

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => navigate("/interview")}
                            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2"
                        >
                            <Mic size={16} />
                            Start New AI Interview
                            <ArrowRight size={14} />
                        </button>

                        <button
                            onClick={() => navigate("/resume")}
                            className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold rounded-xl backdrop-blur-xs transition flex items-center justify-center"
                        >
                            Manage Resume & Skills
                        </button>
                    </div>
                </div>

                {/* Right Placement Readiness Widget */}
                <div className="w-full lg:w-80 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Placement Readiness
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <Target size={16} />
                        </div>
                    </div>

                    <div className="my-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-extrabold text-blue-400">
                                {readiness}%
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">
                                {readiness >= 80 ? "Placement Ready" : readiness >= 50 ? "Progressing Well" : "Needs Practice"}
                            </span>
                        </div>

                        <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-400 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${readiness}%` }}
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        Evaluated across your completed interview sessions, average accuracy, and question complexity.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default DashboardHero;