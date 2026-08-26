import { useState, useEffect } from "react";
import { getNotifications } from "../../services/notificationService";
import { Building2, Sparkles, Trophy, Calendar, CheckCircle2, ChevronRight } from "lucide-react";

export default function RecruiterActivityCard() {
    const [latestNotifications, setLatestNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getNotifications();
                setLatestNotifications((res.data.notifications || []).slice(0, 3));
            } catch (err) {
                // Ignore
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading || latestNotifications.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-white">
                            Recruiter Shortlist & Activity Alerts
                        </h3>
                        <p className="text-xs text-indigo-200/80">
                            Companies reviewing your verified placement readiness
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
                {latestNotifications.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/10 transition"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    {item.status || "Shortlisted"}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                            </div>
                            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Building2 size={13} className="text-indigo-400 shrink-0" />
                                <span>{item.companyName}</span>
                            </h4>
                            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                                {item.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
