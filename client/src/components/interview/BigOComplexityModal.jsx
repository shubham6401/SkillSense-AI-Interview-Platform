import { X, Sparkles, Clock, HardDrive, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

export default function BigOComplexityModal({ isOpen, onClose, complexityData }) {
    if (!isOpen || !complexityData) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            AI Big-O Complexity Analysis
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                            Evaluated against Google & FAANG algorithmic scalability standards
                        </p>
                    </div>
                </div>

                {/* Metrics Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl text-center">
                        <span className="text-[10px] uppercase font-bold text-purple-700 block mb-1">
                            Time Complexity
                        </span>
                        <p className="text-lg font-extrabold text-purple-900 font-mono">
                            {complexityData.timeComplexity || "O(N)"}
                        </p>
                    </div>

                    <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-center">
                        <span className="text-[10px] uppercase font-bold text-blue-700 block mb-1">
                            Space Complexity
                        </span>
                        <p className="text-lg font-extrabold text-blue-900 font-mono">
                            {complexityData.spaceComplexity || "O(1)"}
                        </p>
                    </div>

                    <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-center">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">
                            Optimal Achievable
                        </span>
                        <p className="text-xs font-extrabold text-emerald-900 font-mono mt-1">
                            {complexityData.optimalComplexity || "O(N)"}
                        </p>
                    </div>

                    <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-center">
                        <span className="text-[10px] uppercase font-bold text-indigo-700 block mb-1">
                            Clean Code Rating
                        </span>
                        <p className="text-lg font-extrabold text-indigo-900 mt-0.5">
                            {complexityData.cleanCodeRating ? `${complexityData.cleanCodeRating}/10` : "9.0/10"}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Time Derivation */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                            <Clock size={14} className="text-purple-600" />
                            <span>Time Complexity Derivation</span>
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {complexityData.timeDerivation || "Linear sequence of operations across input data elements."}
                        </p>
                    </div>

                    {/* Space Derivation */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                            <HardDrive size={14} className="text-blue-600" />
                            <span>Auxiliary Space Derivation</span>
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {complexityData.spaceDerivation || "Constant in-place auxiliary memory with no dynamic allocations."}
                        </p>
                    </div>

                    {/* Bottlenecks & Optimization Tips */}
                    {complexityData.bottlenecks?.length > 0 && (
                        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
                            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                                <AlertTriangle size={14} className="text-amber-600" />
                                <span>Bottlenecks & Scalability Considerations</span>
                            </h4>
                            <ul className="space-y-1">
                                {complexityData.bottlenecks.map((item, idx) => (
                                    <li key={idx} className="text-xs text-amber-950 flex items-start gap-2">
                                        <span className="text-amber-500 font-bold">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Executive Summary */}
                    {complexityData.summary && (
                        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                            <h4 className="text-xs font-bold text-indigo-900 mb-1">Architectural Takeaway:</h4>
                            <p className="text-xs text-indigo-950 leading-relaxed italic">
                                "{complexityData.summary}"
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-md"
                    >
                        Got It, Continue Coding
                    </button>
                </div>
            </div>
        </div>
    );
}
