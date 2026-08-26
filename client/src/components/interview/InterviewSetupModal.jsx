import { useState, useEffect } from "react";
import {
    Sparkles,
    Building2,
    Gauge,
    Clock,
    Layers,
    ArrowRight,
    Loader2,
    Check,
    Briefcase,
    Zap,
    Trophy,
    Hourglass,
    Plus,
    Minus,
} from "lucide-react";

export default function InterviewSetupModal({
    skills = [],
    onStart,
    loading = false,
}) {
    const [difficulty, setDifficulty] = useState("Mid-Level");
    const [companyCategory, setCompanyCategory] = useState("FAANG / Top Tech (Google, Meta, Amazon)");
    const [customCompany, setCustomCompany] = useState("");
    const [durationMinutes, setDurationMinutes] = useState(20);
    const [perQuestionTimer, setPerQuestionTimer] = useState(120); // seconds per question, 0 for off
    const [questionCount, setQuestionCount] = useState(10);
    const [track, setTrack] = useState("Comprehensive Full-Stack");

    // Dynamically calculate and calibrate question count whenever duration or per-question timer changes
    useEffect(() => {
        const avgTimePerQuestion = perQuestionTimer > 0 ? perQuestionTimer / 60 : 2.5;
        const calculated = Math.max(2, Math.min(20, Math.round(durationMinutes / avgTimePerQuestion)));
        setQuestionCount(calculated);
    }, [durationMinutes, perQuestionTimer]);

    const difficultyOptions = [
        {
            id: "Fresher",
            title: "Fresher / Junior",
            exp: "0 - 2 Yrs Exp",
            desc: "Focus on fundamentals, core syntax, and problem-solving concepts.",
            badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        {
            id: "Mid-Level",
            title: "Mid-Level Engineer",
            exp: "2 - 5 Yrs Exp",
            desc: "Focus on real-world scenarios, debugging, optimization, and APIs.",
            badge: "bg-blue-50 text-blue-700 border-blue-200",
        },
        {
            id: "Senior",
            title: "Senior / Staff Engineer",
            exp: "5+ Yrs Exp",
            desc: "Focus on distributed systems, scalability, trade-offs, and resilience.",
            badge: "bg-purple-50 text-purple-700 border-purple-200",
        },
    ];

    const companyPresets = [
        { name: "FAANG / Top Tech (Google, Meta, Amazon, Microsoft)", icon: Building2, tag: "Algorithmic & Scale" },
        { name: "High-Growth Unicorn (Stripe, Uber, Airbnb, Razorpay)", icon: Zap, tag: "Fast-Paced & Modern" },
        { name: "Enterprise & Consulting (TCS, Infosys, Accenture)", icon: Briefcase, tag: "Core Concepts & Architecture" },
        { name: "FinTech & Banking (Goldman Sachs, Morgan Stanley)", icon: Trophy, tag: "Concurrency & Accuracy" },
        { name: "Custom Company", icon: Building2, tag: "Custom Target" },
    ];

    const durationPresets = [
        { mins: 10, label: "Express Sprint" },
        { mins: 15, label: "Quick Mock" },
        { mins: 20, label: "Standard Round", popular: true },
        { mins: 30, label: "Placement Sim" },
        { mins: 45, label: "Deep Assessment" },
    ];

    const trackOptions = [
        "Comprehensive Full-Stack",
        "Core Algorithms & Data Structures (DSA)",
        "System Design & Backend Scalability",
        "Frontend Architecture & Modern Web",
        "Behavioral & Culture Fit (STAR Method)",
    ];

    const handleStart = (e) => {
        e.preventDefault();
        const selectedCompany = companyCategory === "Custom Company"
            ? (customCompany.trim() || "Target Tech Company")
            : companyCategory;

        onStart({
            difficulty,
            company: selectedCompany,
            durationMinutes,
            questionCount,
            perQuestionTimer,
            track,
        });
    };

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                    <Sparkles size={13} />
                    Interview Calibration Center
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Configure Your AI Mock Interview
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Calibrate question count, timing pressure, target company, and difficulty tier.
                </p>
            </div>

            <form onSubmit={handleStart} className="space-y-8">
                {/* 1. Difficulty Selection */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        <Gauge size={16} className="text-blue-600" />
                        1. Select Experience & Difficulty Level
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        {difficultyOptions.map((opt) => {
                            const isSelected = difficulty === opt.id;
                            return (
                                <div
                                    key={opt.id}
                                    onClick={() => setDifficulty(opt.id)}
                                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${opt.badge}`}>
                                            {opt.exp}
                                        </span>
                                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                                            {isSelected && <Check size={10} className="text-white" />}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm">{opt.title}</h4>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Target Company */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        <Building2 size={16} className="text-blue-600" />
                        2. Target Company / Interview Style
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {companyPresets.map((preset) => {
                            const isSelected = companyCategory === preset.name;
                            const Icon = preset.icon;
                            return (
                                <div
                                    key={preset.name}
                                    onClick={() => setCompanyCategory(preset.name)}
                                    className={`cursor-pointer rounded-2xl p-3.5 border transition-all duration-200 flex items-center justify-between ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-snug">{preset.name}</p>
                                            <span className="text-[10px] text-slate-400 font-medium">{preset.tag}</span>
                                        </div>
                                    </div>
                                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                                        {isSelected && <Check size={10} className="text-white" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {companyCategory === "Custom Company" && (
                        <div className="mt-3">
                            <input
                                type="text"
                                required
                                placeholder="Enter company name (e.g. Netflix, Databricks, Zomato, Atlassian)..."
                                value={customCompany}
                                onChange={(e) => setCustomCompany(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    )}
                </div>

                {/* 3. Duration & Dynamically Calibrated Question Count */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <Clock size={16} className="text-blue-600" />
                            3. Duration & Calibrated Question Count
                        </label>
                        <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            ⚡ Auto-Calibrated: {questionCount} Questions
                        </span>
                    </div>

                    {/* Duration Presets */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                        {durationPresets.map((preset) => {
                            const isSelected = durationMinutes === preset.mins;
                            return (
                                <div
                                    key={preset.mins}
                                    onClick={() => setDurationMinutes(preset.mins)}
                                    className={`cursor-pointer rounded-2xl p-3.5 text-center border transition-all duration-200 relative ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    {preset.popular && (
                                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                                            Popular
                                        </span>
                                    )}
                                    <span className="text-base sm:text-lg font-extrabold text-slate-900 block">
                                        {preset.mins} mins
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                                        {preset.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Per-Question Timer Selector with Dynamic Ratio Feedback */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <Hourglass size={18} className="text-blue-600" />
                            <div>
                                <span className="text-xs font-bold text-slate-800 block">
                                    Per-Question Time Limit
                                </span>
                                <span className="text-[11px] text-slate-500">
                                    Calibrates question count to {perQuestionTimer > 0 ? `${perQuestionTimer / 60}m per question` : "~2.5m standard pace"}.
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                            {[
                                { label: "Off", value: 0 },
                                { label: "1.5m", value: 90 },
                                { label: "2m", value: 120 },
                                { label: "3m", value: 180 },
                                { label: "4m", value: 240 },
                            ].map((btn) => (
                                <button
                                    key={btn.value}
                                    type="button"
                                    onClick={() => setPerQuestionTimer(btn.value)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                        perQuestionTimer === btn.value
                                            ? "bg-blue-600 text-white shadow-xs"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Specialization Track */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        <Layers size={16} className="text-blue-600" />
                        4. Specialization Track
                    </label>

                    <select
                        value={track}
                        onChange={(e) => setTrack(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                        {trackOptions.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Action CTA */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Calibrating & Generating {questionCount} Questions in ~1 second...</span>
                        </>
                    ) : (
                        <>
                            <span>Generate & Start {questionCount}-Question Interview</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
