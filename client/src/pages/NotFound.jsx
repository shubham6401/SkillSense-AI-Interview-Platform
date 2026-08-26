import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, ArrowLeft, Home } from "lucide-react";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

            <div className="max-w-md w-full text-center relative z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 mx-auto flex items-center justify-center mb-6 border border-blue-500/30">
                    <BrainCircuit size={32} />
                </div>

                <h1 className="text-7xl font-extrabold text-blue-500 tracking-tight">
                    404
                </h1>

                <h2 className="text-xl font-bold text-white mt-2">
                    Page Not Found
                </h2>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    The requested interview module or page does not exist or has been moved.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                    >
                        <ArrowLeft size={14} />
                        Go Back
                    </button>

                    <Link
                        to="/dashboard"
                        className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    >
                        <Home size={14} />
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
