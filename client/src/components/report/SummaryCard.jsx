import { Award, Target, Star, TrendingUp } from "lucide-react";

export default function SummaryCard({ report }) {
    const score = Number(report.averageScore) || 0;
    const readiness = Number(report.placementReadiness) || 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Average Score */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Average Score
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Star size={20} />
                    </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-600">
                        {score}
                    </h2>
                    <span className="text-sm font-bold text-slate-400">/ 10</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Across {report.totalQuestions} assessed questions
                </p>
            </div>

            {/* Overall Grade */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Evaluated Grade
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Award size={20} />
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-emerald-600">
                        {report.grade}
                    </h2>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Overall technical evaluation rank
                </p>
            </div>

            {/* Placement Readiness */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Placement Readiness
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Target size={20} />
                    </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-purple-600">
                        {readiness}%
                    </h2>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${readiness}%` }}
                    />
                </div>
            </div>
        </div>
    );
}