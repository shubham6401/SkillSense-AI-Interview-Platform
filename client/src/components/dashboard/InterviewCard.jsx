import { Link } from "react-router-dom";
import {
    Calendar,
    CircleHelp,
    Star,
    Award,
    ArrowRight,
} from "lucide-react";

function InterviewCard({ interview }) {
    const gradeColor = {
        "A+": "bg-emerald-50 text-emerald-700 border-emerald-200",
        A: "bg-emerald-50 text-emerald-700 border-emerald-200",
        B: "bg-blue-50 text-blue-700 border-blue-200",
        C: "bg-amber-50 text-amber-700 border-amber-200",
        D: "bg-rose-50 text-rose-700 border-rose-200",
    };

    return (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
            <div>
                {/* Date & Grade badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        <span>
                            {new Date(interview.createdAt).toLocaleDateString("en-US", {
                                dateStyle: "medium",
                            })}
                        </span>
                    </div>

                    <span
                        className={`px-3 py-0.5 rounded-full font-extrabold text-xs border ${
                            gradeColor[interview.grade] || "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                    >
                        Grade: {interview.grade}
                    </span>
                </div>

                {/* Metrics */}
                <div className="py-5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                            <CircleHelp size={14} className="text-slate-400" />
                            Questions Answered
                        </span>
                        <span className="font-bold text-slate-800">
                            {interview.questionCount}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                            <Star size={14} className="text-amber-500" />
                            Average Score
                        </span>
                        <span className="font-bold text-slate-800">
                            {Number(interview.averageScore).toFixed(1)} / 10
                        </span>
                    </div>
                </div>
            </div>

            {/* View Report Link */}
            <Link
                to={`/report/${interview._id}`}
                className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
                <span>View Full Analysis</span>
                <ArrowRight size={14} />
            </Link>
        </div>
    );
}

export default InterviewCard;