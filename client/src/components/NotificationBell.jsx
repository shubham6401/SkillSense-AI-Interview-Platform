import { useState, useEffect, useRef } from "react";
import { getNotifications, markAsRead, markAllAsRead } from "../services/notificationService";
import {
    Bell,
    Check,
    CheckCheck,
    Building2,
    Sparkles,
    Calendar,
    Trophy,
    ExternalLink,
    Clock,
    X,
} from "lucide-react";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 15000); // Poll for real-time alerts
        return () => clearInterval(interval);
    }, []);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch (err) {
            // Silently handle if unauthenticated
        }
    };

    const handleMarkOne = async (id, e) => {
        e.stopPropagation();
        try {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Mark read error:", err);
        }
    };

    const handleMarkAll = async () => {
        try {
            setLoading(true);
            await markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Mark all error:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatRelativeTime = (dateStr) => {
        if (!dateStr) return "Recent";
        const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (diffSec < 60) return "Just now";
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr}h ago`;
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const statusBadge = {
        SHORTLISTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        INTERVIEW_INVITE: "bg-purple-50 text-purple-700 border-purple-200",
        OFFER_EXTENDED: "bg-indigo-50 text-indigo-700 border-indigo-200",
        UNDER_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
        STATUS_UPDATE: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                title="Recruiter Notifications"
            >
                <Bell size={19} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 text-white font-extrabold text-[9px] items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl p-3 border border-slate-200 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between p-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-slate-900">Recruiter Activity</h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAll}
                                disabled={loading}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1 transition"
                            >
                                <CheckCheck size={13} />
                                <span>Mark all read</span>
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 py-1">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 mx-auto flex items-center justify-center mb-2">
                                    <Bell size={20} />
                                </div>
                                <p className="text-xs font-bold text-slate-700">No Notifications Yet</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    When recruiters view or shortlist your profile, updates appear here.
                                </p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n._id}
                                    className={`p-3.5 rounded-2xl transition hover:bg-slate-50 relative flex gap-3 ${
                                        !n.isRead ? "bg-blue-50/40" : "bg-white"
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                        <Building2 size={16} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                            <span className="text-xs font-bold text-slate-900 truncate">
                                                {n.companyName}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium shrink-0">
                                                {formatRelativeTime(n.createdAt)}
                                            </span>
                                        </div>

                                        <p className="text-xs font-semibold text-slate-800 leading-snug">
                                            {n.title}
                                        </p>

                                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-3">
                                            {n.message}
                                        </p>

                                        <div className="mt-2 flex items-center justify-between">
                                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${statusBadge[n.type] || statusBadge.STATUS_UPDATE}`}>
                                                {n.status || "Shortlisted"}
                                            </span>

                                            {!n.isRead && (
                                                <button
                                                    onClick={(e) => handleMarkOne(n._id, e)}
                                                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                                                >
                                                    <Check size={12} />
                                                    <span>Mark read</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
