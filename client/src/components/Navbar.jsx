import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    BrainCircuit,
    LayoutDashboard,
    FileText,
    History,
    PlayCircle,
    LogOut,
    User,
    ShieldCheck,
    Building2,
    Menu,
    X,
    ChevronDown,
    Sparkles,
    Sun,
    Moon,
} from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    const isRecruiter = user?.role === "recruiter";

    const candidateLinks = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Resume & Skills", path: "/resume", icon: FileText },
        { name: "Mock Interview", path: "/interview", icon: PlayCircle },
        { name: "History", path: "/history", icon: History },
    ];

    const recruiterLinks = [
        { name: "Talent Pool Leaderboard", path: "/recruiter/dashboard", icon: Building2 },
    ];

    const navLinks = isRecruiter ? recruiterLinks : candidateLinks;

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to={isRecruiter ? "/recruiter/dashboard" : "/dashboard"} className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                        <BrainCircuit size={22} />
                    </div>
                    <div>
                        <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                            SkillSense<span className="text-blue-600">.AI</span>
                        </span>
                        {isRecruiter && (
                            <span className="ml-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Recruiter
                            </span>
                        )}
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                    isActive
                                        ? "bg-blue-50 text-blue-600 shadow-xs"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                            >
                                <Icon size={16} />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Profile & Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
                    >
                        {theme === "dark" ? <Sun size={17} className="text-amber-500" /> : <Moon size={17} className="text-slate-600" />}
                    </button>

                    {/* Notification Bell (for candidates) */}
                    {!isRecruiter && <NotificationBell />}

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                        >
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-bold text-slate-800 leading-tight max-w-[120px] truncate">
                                    {user?.name || "Account"}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium capitalize">
                                    {user?.role || "Candidate"}
                                </p>
                            </div>
                            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl p-2 border border-slate-200 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                                <div className="p-3 border-b border-slate-100 mb-1">
                                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                                </div>

                                <div className="space-y-0.5">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                    >
                                        <User size={15} />
                                        <span>My Profile & Settings</span>
                                    </Link>

                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                    >
                                        <ShieldCheck size={15} />
                                        <span>Change Password</span>
                                    </Link>

                                    {!isRecruiter && (
                                        <Link
                                            to="/history"
                                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                        >
                                            <History size={15} />
                                            <span>Interview History</span>
                                        </Link>
                                    )}

                                    <div className="border-t border-slate-100 my-1" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition"
                                    >
                                        <LogOut size={15} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                                    isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <Icon size={17} />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}

                    <div className="border-t border-slate-100 pt-2 mt-2 space-y-1">
                        <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                            <User size={17} />
                            <span>My Profile & Password</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition"
                        >
                            <LogOut size={17} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}