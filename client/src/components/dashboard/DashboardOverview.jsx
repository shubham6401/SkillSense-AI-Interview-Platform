import StatCard from "./StatCard";
import {
    Mic,
    CheckCircle2,
    Star,
    Target,
    Award,
} from "lucide-react";

function DashboardOverview({ dashboard }) {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Interview Performance Overview
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    Aggregated analytics from your mock interview attempts.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                <StatCard
                    title="Total Interviews"
                    value={dashboard.totalInterviews || 0}
                    subtitle="Initiated sessions"
                    icon={Mic}
                    color="blue"
                />

                <StatCard
                    title="Completed"
                    value={dashboard.completedInterviews || 0}
                    subtitle="With full AI evaluation"
                    icon={CheckCircle2}
                    color="emerald"
                />

                <StatCard
                    title="Average Score"
                    value={`${dashboard.averageScore || 0}`}
                    subtitle="Out of 10 max points"
                    icon={Star}
                    color="amber"
                />

                <StatCard
                    title="Readiness Rate"
                    value={`${dashboard.placementReadiness || 0}%`}
                    subtitle="Placement readiness index"
                    icon={Target}
                    color="purple"
                />

                <StatCard
                    title="Overall Grade"
                    value={dashboard.latestGrade || "N/A"}
                    subtitle="Current mastery tier"
                    icon={Award}
                    color="blue"
                />
            </div>
        </section>
    );
}

export default DashboardOverview;