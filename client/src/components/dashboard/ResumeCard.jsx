import { FileText, Upload, Mic, Award, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ResumeCard({ resume }) {
    const navigate = useNavigate();
    const isUploaded = Boolean(resume && resume.uploaded);

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <FileText size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-900">
                                Active Resume & Skills
                            </h2>
                            {isUploaded ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                                    <CheckCircle2 size={12} />
                                    Active
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                                    <AlertCircle size={12} />
                                    Upload Needed
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {isUploaded
                                ? "Resume analyzed and currently utilized for AI question generation."
                                : "Upload your resume to unlock tailored AI mock interviews."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => navigate("/resume")}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                        <Upload size={14} />
                        {isUploaded ? "Update Resume" : "Upload Resume"}
                    </button>

                    <button
                        onClick={() => navigate("/interview")}
                        disabled={!isUploaded}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                        <Mic size={14} />
                        Start Interview
                    </button>
                </div>
            </div>

            {isUploaded && (
                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            File Name
                        </span>
                        <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                            {resume.originalName || "Uploaded Resume.pdf"}
                        </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Extracted Skills Count
                        </span>
                        <p className="text-xs font-bold text-blue-600 mt-1">
                            {resume.skillsCount || 0} skills detected
                        </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Last Analyzed
                        </span>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                            {resume.uploadedAt
                                ? new Date(resume.uploadedAt).toLocaleDateString("en-US", { dateStyle: "medium" })
                                : "Recently"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResumeCard;