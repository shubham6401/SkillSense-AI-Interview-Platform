import { useState } from "react";
import {
    CheckCircle2,
    AlertCircle,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Filter,
} from "lucide-react";

export default function QuestionAnalysis({ report }) {
    const [filter, setFilter] = useState("all"); // 'all', 'high', 'low'
    const [expandedModelAnswers, setExpandedModelAnswers] = useState({});

    const toggleModelAnswer = (index) => {
        setExpandedModelAnswers((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const answers = report.answers || [];

    const filteredAnswers = answers.filter((item) => {
        const score = Number(item.score) || 0;
        if (filter === "high") return score >= 8;
        if (filter === "low") return score < 8;
        return true;
    });

    return (
        <div className="mt-12">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Question-by-Question Analysis
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Deep dive into AI evaluations and compare against model answers.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 no-print self-start sm:self-auto">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                            filter === "all"
                                ? "bg-white text-blue-600 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        All ({answers.length})
                    </button>
                    <button
                        onClick={() => setFilter("high")}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                            filter === "high"
                                ? "bg-white text-emerald-600 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        High ({answers.filter((a) => (a.score || 0) >= 8).length})
                    </button>
                    <button
                        onClick={() => setFilter("low")}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                            filter === "low"
                                ? "bg-white text-rose-600 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Needs Work ({answers.filter((a) => (a.score || 0) < 8).length})
                    </button>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4 sm:space-y-6">
                {filteredAnswers.map((answer, index) => {
                    const score = Number(answer.score) || 0;
                    const isHigh = score >= 8;
                    const isMid = score >= 5 && score < 8;

                    const scoreColor = isHigh
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : isMid
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-rose-50 text-rose-700 border-rose-200";

                    const strengths = answer.strengths || [];
                    const improvements = answer.improvements || [];
                    const hasModelAnswer = Boolean(answer.modelAnswer);
                    const isModelAnswerOpen = expandedModelAnswers[index];

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-3xl p-4 sm:p-7 md:p-8 border border-slate-200 shadow-sm print-break-inside-avoid"
                        >
                            {/* Card Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                                        Q{index + 1}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                        {answer.skill || "Technical"}
                                    </span>
                                </div>

                                <div
                                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${scoreColor}`}
                                >
                                    Score: {score} / 10
                                </div>
                            </div>

                            {/* Question Title */}
                            <div className="mb-4">
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                    {answer.question}
                                </h3>
                            </div>

                            {/* Candidate's Answer */}
                            <div className="mb-6">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                    Your Submitted Response
                                </span>
                                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                                    {answer.answer ? (
                                        answer.answer
                                    ) : (
                                        <span className="italic text-slate-400">
                                            No answer provided.
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Strengths & Improvements Grid */}
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                {/* Strengths */}
                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                                    <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold mb-2">
                                        <CheckCircle2 size={16} />
                                        <span>Identified Strengths</span>
                                    </div>
                                    {strengths.length === 0 ? (
                                        <p className="text-xs text-slate-500 italic">
                                            No explicit strengths noted.
                                        </p>
                                    ) : (
                                        <ul className="space-y-1.5">
                                            {strengths.map((item, sIdx) => (
                                                <li
                                                    key={sIdx}
                                                    className="text-xs text-emerald-950 flex items-start gap-1.5"
                                                >
                                                    <span className="text-emerald-500 font-bold">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Improvements */}
                                <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4">
                                    <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold mb-2">
                                        <AlertCircle size={16} />
                                        <span>Key Improvements</span>
                                    </div>
                                    {improvements.length === 0 ? (
                                        <p className="text-xs text-slate-500 italic">
                                            No major gaps identified.
                                        </p>
                                    ) : (
                                        <ul className="space-y-1.5">
                                            {improvements.map((item, iIdx) => (
                                                <li
                                                    key={iIdx}
                                                    className="text-xs text-rose-950 flex items-start gap-1.5"
                                                >
                                                    <span className="text-rose-500 font-bold">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Model Answer Accordion */}
                            {hasModelAnswer && (
                                <div className="border border-indigo-100 rounded-2xl overflow-hidden bg-indigo-50/30">
                                    <button
                                        type="button"
                                        onClick={() => toggleModelAnswer(index)}
                                        className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-indigo-700 hover:bg-indigo-50/80 transition"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={15} className="text-indigo-600" />
                                            <span>Ideal Model Answer Reference</span>
                                        </div>
                                        {isModelAnswerOpen ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        )}
                                    </button>

                                    {isModelAnswerOpen && (
                                        <div className="px-4 pb-4 pt-1 text-xs text-indigo-950 leading-relaxed border-t border-indigo-100/60 bg-white/60">
                                            {answer.modelAnswer}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}