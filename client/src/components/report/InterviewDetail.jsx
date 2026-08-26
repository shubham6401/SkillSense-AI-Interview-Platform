import {
    Calendar,
    Clock,
    Award,
    CheckCircle,
    Building2,
    Gauge,
    Layers,
    Lightbulb,
} from "lucide-react";

export default function InterviewDetail({ report }) {
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mt-8">
            <h2 className="text-lg font-bold text-slate-900 mb-5">
                Interview Configuration & Metadata
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Company */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Building2 size={18} />
                    </div>
                    <div className="truncate">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Target Company</p>
                        <p className="text-xs font-bold text-slate-800 truncate" title={report.company || "General Tech"}>
                            {report.company || "General Tech"}
                        </p>
                    </div>
                </div>

                {/* Difficulty */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Gauge size={18} />
                    </div>
                    <div className="truncate">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Difficulty Tier</p>
                        <p className="text-xs font-bold text-purple-700 truncate">
                            {report.difficulty || "Mid-Level"}
                        </p>
                    </div>
                </div>

                {/* Track */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Layers size={18} />
                    </div>
                    <div className="truncate">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Track</p>
                        <p className="text-xs font-bold text-slate-800 truncate" title={report.track || "Comprehensive"}>
                            {report.track || "Comprehensive"}
                        </p>
                    </div>
                </div>

                {/* Hints Used */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Lightbulb size={18} />
                    </div>
                    <div className="truncate">
                        <p className="text-[10px] uppercase font-bold text-slate-400">AI Hints Used</p>
                        <p className="text-xs font-bold text-amber-700 truncate">
                            {report.hintsUsed || 0} Hints
                        </p>
                    </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Calendar size={18} />
                    </div>
                    <div className="truncate">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Date</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{report.interviewDate}</p>
                    </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Clock size={18} />
                    </div>
                    <div className="truncate">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Time Taken</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{report.duration}</p>
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle size={18} />
                    </div>
                    <div className="truncate">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                        <p className="text-xs font-bold text-emerald-600 truncate">{report.interviewStatus}</p>
                    </div>
                </div>

                {/* Completed At */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Award size={18} />
                    </div>
                    <div className="truncate">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Completed At</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{report.completedAt}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}