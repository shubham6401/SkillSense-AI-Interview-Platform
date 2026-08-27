import { X, Sparkles, Clock, HardDrive, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

export default function BigOComplexityModal({ isOpen, onClose, complexityData }) {
    useLockBodyScroll(isOpen);

    if (!isOpen || !complexityData) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-7 md:p-8 shadow-2xl border border-slate-200 relative max-h-[calc(100dvh-1.5rem)] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
                {/* Close button with large touch target */}
                <button
                    onClick={onClose}
                    className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-10 min-w-[40px] min-h-[40px] flex items-center justify-center"
                    aria-label="Close complexity modal"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-5 pr-10 shrink-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            AI Big-O Complexity Analysis
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                            Evaluated against Google & FAANG scalability standards
                        </p>
                    </div>
                </div>

                {/* Scrollable Content Container */}
                <div className="overflow-y-auto space-y-4 pr-1 -mr-1 flex-1">
                    {/* Metrics Summary Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                        <div className="p-3 sm:p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl text-center">
                            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-purple-700 block mb-0.5 sm:mb-1">
                                Time Complexity
                            </span>
                            <p className="text-base sm:text-lg font-extrabold text-purple-900 font-mono">
                                {complexityData.timeComplexity || "O(N)"}
                            </p>
                        </div>

                        <div className="p-3 sm:p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-center">
                            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-blue-700 block mb-0.5 sm:mb-1">
                                Space Complexity
                            </span>
                            <p className="text-base sm:text-lg font-extrabold text-blue-900 font-mono">
                                {complexityData.spaceComplexity || "O(1)"}
                            </p>
                        </div>

                        <div className="p-3 sm:p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-center">
                            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-700 block mb-0.5 sm:mb-1">
                                Optimal Goal
                            </span>
                            <p className="text-xs sm:text-sm font-extrabold text-emerald-900 font-mono mt-0.5 sm:mt-1">
                                {complexityData.optimalComplexity || "O(N)"}
                            </p>
                        </div>

                        <div className="p-3 sm:p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-center">
                            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-indigo-700 block mb-0.5 sm:mb-1">
                                Clean Code
                            </span>
                            <p className="text-base sm:text-lg font-extrabold text-indigo-900 mt-0.5">
                                {complexityData.cleanCodeRating ? `${complexityData.cleanCodeRating}/10` : "9.0/10"}
                            </p>
                        </div>
                    </div>

                    {/* Time Derivation */}
                    <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                            <Clock size={14} className="text-purple-600 shrink-0" />
                            <span>Time Complexity Derivation</span>
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed break-words">
                            {complexityData.timeDerivation || "Linear sequence of operations across input data elements."}
                        </p>
                    </div>

                    {/* Space Derivation */}
                    <div className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                            <HardDrive size={14} className="text-blue-600 shrink-0" />
                            <span>Auxiliary Space Derivation</span>
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed break-words">
                            {complexityData.spaceDerivation || "Constant in-place auxiliary memory with no dynamic allocations."}
                        </p>
                    </div>

                    {/* Bottlenecks & Optimization Tips */}
                    {complexityData.bottlenecks?.length > 0 && (
                        <div className="p-3.5 sm:p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
                            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                                <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                                <span>Bottlenecks & Scalability</span>
                            </h4>
                            <ul className="space-y-1.5">
                                {complexityData.bottlenecks.map((item, idx) => (
                                    <li key={idx} className="text-xs text-amber-950 flex items-start gap-2 leading-relaxed break-words">
                                        <span className="text-amber-500 font-bold shrink-0">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Executive Summary */}
                    {complexityData.summary && (
                        <div className="p-3.5 sm:p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                            <h4 className="text-xs font-bold text-indigo-900 mb-1">Architectural Takeaway:</h4>
                            <p className="text-xs text-indigo-950 leading-relaxed italic break-words">
                                "{complexityData.summary}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer CTA */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center"
                    >
                        Got It, Continue Coding
                    </button>
                </div>
            </div>
        </div>
    );
}
