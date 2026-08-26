import InterviewCard from "./InterviewCard";
import { Mic, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardRecentInterview({ dashboard }) {
    const navigate = useNavigate();
    const recentInterviews = dashboard?.recentInterviews || [];

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Recent Interview Reports
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Performance reports and evaluations from your latest sessions.
                    </p>
                </div>

                {recentInterviews.length > 0 && (
                    <button
                        onClick={() => navigate("/history")}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                    >
                        View All History
                        <ArrowRight size={14} />
                    </button>
                )}
            </div>

            {recentInterviews.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
                        <Mic size={26} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">
                        No Interviews Completed Yet
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Complete your first AI mock interview to unlock detailed performance analysis, grades, and personalized feedback.
                    </p>
                    <button
                        onClick={() => navigate("/interview")}
                        className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                    >
                        Start Your First Interview
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentInterviews.map((interview) => (
                        <InterviewCard key={interview._id} interview={interview} />
                    ))}
                </div>
            )}
        </section>
    );
}