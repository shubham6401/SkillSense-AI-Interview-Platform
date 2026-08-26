import { ArrowLeft, RotateCcw, Printer, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles size={13} />
                    AI Evaluation Summary
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Interview Performance Report
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Detailed analytics, question-by-question breakdown, and personalized recommendations.
                </p>
            </div>

            <div className="flex flex-wrap gap-2.5 no-print">
                <button
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
                >
                    <ArrowLeft size={16} />
                    All History
                </button>

                <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition"
                >
                    <Printer size={16} />
                    Export / Print PDF
                </button>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition"
                >
                    <RotateCcw size={16} />
                    Dashboard
                </button>
            </div>
        </div>
    );
}