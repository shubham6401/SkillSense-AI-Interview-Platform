import { CheckCircle2, MinusCircle, AlertCircle } from "lucide-react";

export default function SkillAnalysis({ report }) {
    const strengths = report.strengths || [];
    const averageAreas = report.averageAreas || [];
    const weakAreas = report.weakAreas || [];

    return (
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {/* Strengths */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 mb-4">
                    <CheckCircle2 size={20} />
                    <h2 className="text-base font-bold text-slate-900">
                        Demonstrated Strengths
                    </h2>
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
                                className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold"
                            >
                                {item}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* Average Areas */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-amber-600 mb-4">
                    <MinusCircle size={20} />
                    <h2 className="text-base font-bold text-slate-900">
                        Developing Knowledge
                    </h2>
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
                                className="bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold"
                            >
                                {item}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* Weak Areas */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-rose-600 mb-4">
                    <AlertCircle size={20} />
                    <h2 className="text-base font-bold text-slate-900">
                        Priority Focus Areas
                    </h2>
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
                                className="bg-rose-50 text-rose-800 border border-rose-200 px-3.5 py-1.5 rounded-full text-xs font-bold"
                            >
                                {item}
                            </span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}