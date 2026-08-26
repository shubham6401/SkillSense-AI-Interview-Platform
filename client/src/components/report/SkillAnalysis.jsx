import { CheckCircle2, MinusCircle, AlertCircle, BarChart3, Star, Layers } from "lucide-react";

export default function SkillAnalysis({ report }) {
    const strengths = report.strengths || [];
    const averageAreas = report.averageAreas || [];
    const weakAreas = report.weakAreas || [];
    const skillBreakdown = report.skillBreakdown || [];

    return (
        <div className="space-y-6 mt-8">
            {/* Domain Proficiency Score Breakdown Table/Bars */}
            {skillBreakdown.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900">
                                    Domain Skill Proficiency Breakdown
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Performance analytics segmented by evaluated technology domain.
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">
                            {skillBreakdown.length} Domains Assessed
                        </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {skillBreakdown.map((sb, i) => {
                            const pct = Math.round((sb.averageScore / 10) * 100);
                            const isStrong = sb.averageScore >= 8;
                            const isModerate = sb.averageScore >= 6 && sb.averageScore < 8;

                            return (
                                <div
                                    key={i}
                                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-extrabold text-slate-800">
                                                {sb.skill}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-semibold">
                                                ({sb.questionsCount} {sb.questionsCount === 1 ? "question" : "questions"})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                                                    isStrong
                                                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                                        : isModerate
                                                        ? "bg-amber-100 text-amber-800 border-amber-200"
                                                        : "bg-rose-100 text-rose-800 border-rose-200"
                                                }`}
                                            >
                                                {sb.rating}
                                            </span>
                                            <span className="text-xs font-bold text-slate-900">
                                                {sb.averageScore}/10
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-1">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                isStrong
                                                    ? "bg-emerald-500"
                                                    : isModerate
                                                    ? "bg-amber-500"
                                                    : "bg-rose-500"
                                            }`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Categorization Pillars */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Strengths */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-600 mb-4">
                            <CheckCircle2 size={20} />
                            <h3 className="text-sm font-extrabold text-slate-900">
                                Strong Skills (&ge; 8.0/10)
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {strengths.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">
                                    No high-scoring domain identified yet.
                                </p>
                            ) : (
                                strengths.map((item, index) => (
                                    <span
                                        key={index}
                                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold"
                                    >
                                        {item}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Average Areas */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-amber-600 mb-4">
                            <MinusCircle size={20} />
                            <h3 className="text-sm font-extrabold text-slate-900">
                                Developing Skills (5.0 - 7.9)
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {averageAreas.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">
                                    None in intermediate range.
                                </p>
                            ) : (
                                averageAreas.map((item, index) => (
                                    <span
                                        key={index}
                                        className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl text-xs font-bold"
                                    >
                                        {item}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Weak Areas */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-rose-600 mb-4">
                            <AlertCircle size={20} />
                            <h3 className="text-sm font-extrabold text-slate-900">
                                Priority Focus (&lt; 5.0/10)
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {weakAreas.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">
                                    Great job! No weak skill domains detected.
                                </p>
                            ) : (
                                weakAreas.map((item, index) => (
                                    <span
                                        key={index}
                                        className="bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-xl text-xs font-bold"
                                    >
                                        {item}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}