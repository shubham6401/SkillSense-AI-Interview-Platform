import { Award, AlertCircle } from "lucide-react";

export default function BestWeakPermf({ report }) {
    return (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Best Question */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Award size={18} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                            Strongest Response
                        </h3>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                        Score: {report.bestScore}/10
                    </span>
                </div>

                <p className="text-xs text-slate-500 font-medium mb-1">
                    Best Answered Question:
                </p>
                <p className="text-sm font-semibold text-slate-800 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                    "{report.bestQuestion}"
                </p>
            </div>

            {/* Weakest Question */}
            <div className="bg-white rounded-3xl p-6 border border-rose-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                            <AlertCircle size={18} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                            Key Area for Growth
                        </h3>
                    </div>
                    <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">
                        Score: {report.weakestScore}/10
                    </span>
                </div>

                <p className="text-xs text-slate-500 font-medium mb-1">
                    Question with Biggest Gap:
                </p>
                <p className="text-sm font-semibold text-slate-800 bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                    "{report.weakestQuestion}"
                </p>
            </div>
        </div>
    );
}