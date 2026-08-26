import { Trophy, TrendingDown, Sparkles, Check, AlertTriangle } from "lucide-react";

export default function PerformanceStatistics({ report }) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mt-8">
            <h2 className="text-lg font-bold text-slate-900 mb-5">
                Answer Distribution & Score Range
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="bg-blue-50/60 rounded-2xl p-4 text-center border border-blue-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                        Highest Score
                    </p>
                    <h3 className="text-3xl font-extrabold text-blue-700 mt-1">
                        {report.highestScore}
                    </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Lowest Score
                    </p>
                    <h3 className="text-3xl font-extrabold text-slate-700 mt-1">
                        {report.lowestScore}
                    </h3>
                </div>

                <div className="bg-emerald-50/60 rounded-2xl p-4 text-center border border-emerald-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                        Excellent (8-10)
                    </p>
                    <h3 className="text-3xl font-extrabold text-emerald-700 mt-1">
                        {report.excellentAnswers}
                    </h3>
                </div>

                <div className="bg-amber-50/60 rounded-2xl p-4 text-center border border-amber-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                        Good (5-7)
                    </p>
                    <h3 className="text-3xl font-extrabold text-amber-700 mt-1">
                        {report.goodAnswers}
                    </h3>
                </div>

                <div className="bg-rose-50/60 rounded-2xl p-4 text-center border border-rose-100 col-span-2 sm:col-span-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                        Needs Work (&lt;5)
                    </p>
                    <h3 className="text-3xl font-extrabold text-rose-700 mt-1">
                        {report.poorAnswers}
                    </h3>
                </div>
            </div>
        </div>
    );
}