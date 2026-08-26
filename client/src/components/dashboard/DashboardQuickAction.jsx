import ActionCard from "./ActionCard";
import {
    FileText,
    Mic,
    History,
} from "lucide-react";

export default function DashboardQuickAction() {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Quick Workspaces
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    Jump straight into mock testing or tune your target skills.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard
                    icon={FileText}
                    title="Resume & Skills Setup"
                    description="Upload your latest PDF resume to automatically extract tech stacks and customize target interview topics."
                    path="/resume"
                    badge="Step 1"
                />

                <ActionCard
                    icon={Mic}
                    title="Live AI Mock Interview"
                    description="Practice real-time voice or text interviews generated dynamically by Gemini AI matching your resume."
                    path="/interview"
                    badge="Step 2"
                />

                <ActionCard
                    icon={History}
                    title="Analytics & Past Reports"
                    description="Review detailed score breakdowns, executive feedback, and ideal model answers from previous sessions."
                    path="/history"
                    badge="Step 3"
                />
            </div>
        </section>
    );
}