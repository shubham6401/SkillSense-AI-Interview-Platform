import { Award, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, ArrowUpRight } from "lucide-react";

export default function BestWeakPermf({ report }) {
    const keyStrengths = report?.keyStrengths || [];
    const criticalWeaknesses = report?.criticalWeaknesses || [];

    return (
        <div className="space-y-6 mt-8">
            {/* Top Cards: Best vs Weakest Question */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Best Question */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900">
                                        Strongest Response
                                    </h3>
                                    <span className="text-[11px] text-emerald-600 font-semibold">
                                        Peak Technical Performance
                                    </span>
                                </div>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-extrabold border border-emerald-200">
                                {report.bestScore}/10
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 font-medium mb-1">
                            Best Answered Question:
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 leading-relaxed">
                            "{report.bestQuestion}"
                        </p>
                    </div>

                    {/* Key Strengths List */}
                    {keyStrengths.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-emerald-100">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-2">
                                Verified Technical Strengths:
                            </span>
                            <ul className="space-y-1.5">
                                {keyStrengths.map((item, idx) => (
                                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Weakest Question & Areas for Growth */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900">
                                        Key Area for Growth
                                    </h3>
                                    <span className="text-[11px] text-amber-600 font-semibold">
                                        Highest Impact Improvement
                                    </span>
                                </div>
                            </div>
                            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-extrabold border border-amber-200">
                                {report.weakestScore}/10
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 font-medium mb-1">
                            Question with Technical Gaps:
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 bg-amber-50/50 p-4 rounded-2xl border border-amber-100 leading-relaxed">
                            "{report.weakestQuestion}"
                        </p>
                    </div>

                    {/* Critical Weaknesses List */}
                    {criticalWeaknesses.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-amber-100">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block mb-2">
                                Critical Concepts to Master:
                            </span>
                            <ul className="space-y-1.5">
                                {criticalWeaknesses.map((item, idx) => (
                                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                                        <ArrowUpRight size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}