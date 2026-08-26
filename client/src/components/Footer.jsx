import { BrainCircuit, Sparkles, ShieldCheck } from "lucide-react";

function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-white/70 backdrop-blur-xs py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                            <BrainCircuit size={18} />
                        </div>
                        <div>
                            <span className="font-bold text-slate-800 text-base">
                                SkillSense AI
                            </span>
                            <p className="text-xs text-slate-500">
                                AI-powered placement & interview simulation
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200/60">
                            <Sparkles size={13} />
                            Powered by Google Gemini 2.5 Flash
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                            <ShieldCheck size={13} />
                            Secure JWT Authentication
                        </span>
                    </div>

                    <p className="text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} SkillSense AI. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;