import { useState, useEffect } from "react";
import { getProfile, updateProfile, changePassword } from "../services/userService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    User,
    Mail,
    Lock,
    KeyRound,
    Building2,
    Briefcase,
    FileText,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Sparkles,
    ShieldCheck,
    Save,
    Loader2,
    Calendar,
    GraduationCap,
} from "lucide-react";

function Profile() {
    const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'security'
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        role: "candidate",
        companyName: "",
        headline: "",
        bio: "",
        authProvider: "local",
        createdAt: "",
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profileSuccess, setProfileSuccess] = useState("");
    const [profileError, setProfileError] = useState("");

    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoadingProfile(true);
            const res = await getProfile();
            const u = res.data.user;
            setProfileData({
                name: u.name || "",
                email: u.email || "",
                role: u.role || "candidate",
                companyName: u.companyName || "",
                headline: u.headline || "",
                bio: u.bio || "",
                authProvider: u.authProvider || "local",
                createdAt: u.createdAt || "",
            });
        } catch (err) {
            console.error("Failed to load profile:", err);
            setProfileError("Could not load user profile details.");
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileSuccess("");
        setProfileError("");

        try {
            setSavingProfile(true);
            const res = await updateProfile({
                name: profileData.name,
                headline: profileData.headline,
                bio: profileData.bio,
                companyName: profileData.companyName,
            });

            // Update localStorage user copy
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...currentUser, ...res.data.user }));

            setProfileSuccess("Profile information updated successfully!");
        } catch (err) {
            setProfileError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordSuccess("");
        setPasswordError("");

        if (passwordData.newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters long.");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New password and confirm password do not match.");
            return;
        }

        try {
            setChangingPassword(true);
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            setPasswordSuccess("Password updated successfully!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setPasswordError(err.response?.data?.message || "Failed to change password. Please verify current password.");
        } finally {
            setChangingPassword(false);
        }
    };

    // Calculate password strength
    const getPasswordStrength = (pass) => {
        if (!pass) return { label: "None", percent: 0, color: "bg-slate-200" };
        if (pass.length < 6) return { label: "Weak", percent: 30, color: "bg-rose-500" };
        const hasNumbers = /\d/.test(pass);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        const hasUpper = /[A-Z]/.test(pass);

        let score = 50;
        if (hasNumbers) score += 20;
        if (hasSpecial) score += 20;
        if (hasUpper) score += 10;

        if (score >= 80) return { label: "Strong", percent: 100, color: "bg-emerald-500" };
        return { label: "Fair", percent: 65, color: "bg-amber-500" };
    };

    const passStrength = getPasswordStrength(passwordData.newPassword);

    const formattedDate = profileData.createdAt
        ? new Date(profileData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "Recent";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Hero Header */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                                {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                        {profileData.name || "User Account"}
                                    </h1>
                                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                                        profileData.role === "recruiter"
                                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                            : "bg-blue-50 text-blue-700 border-blue-200"
                                    }`}>
                                        {profileData.role === "recruiter" ? "Recruiter Account" : "Candidate"}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                    <Mail size={13} className="text-slate-400" />
                                    {profileData.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end text-xs text-slate-500 font-medium pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                                <Calendar size={14} className="text-blue-600" />
                                <span>Joined {formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-100 mt-8 gap-4 sm:gap-8">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`pb-3 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 ${
                                activeTab === "profile"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <User size={16} />
                            <span>Profile & Identity</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("security")}
                            className={`pb-3 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 ${
                                activeTab === "security"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <ShieldCheck size={16} />
                            <span>Password & Security</span>
                        </button>
                    </div>
                </div>

                {/* Tab 1: Profile & Identity */}
                {activeTab === "profile" && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in duration-200">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900">
                                Personal & Professional Information
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Update your display name, career target, and professional headline.
                            </p>
                        </div>

                        {profileSuccess && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                <span>{profileSuccess}</span>
                            </div>
                        )}

                        {profileError && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-rose-800">
                                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                                <span>{profileError}</span>
                            </div>
                        )}

                        <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-2xl">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Email (Read only) */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    Email Address (Verified)
                                </label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        disabled
                                        value={profileData.email}
                                        className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Company / Organization Name */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    {profileData.role === "recruiter" ? "Company / Hiring Organization" : "Target Company / Current College"}
                                </label>
                                <div className="relative">
                                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Google, Amazon, MMMUT, Microsoft"
                                        value={profileData.companyName}
                                        onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Professional Headline */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    Professional Headline
                                </label>
                                <div className="relative">
                                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Senior Full-Stack Engineer | React & Distributed Systems"
                                        value={profileData.headline}
                                        onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    About / Bio
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Write a brief professional summary about your background and technical interests..."
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                />
                            </div>

                            {/* Save Button */}
                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                            >
                                {savingProfile ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={15} />
                                        <span>Save Profile Changes</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Tab 2: Password & Security */}
                {activeTab === "security" && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in duration-200">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900">
                                Change Password & Security Settings
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Secure your account by setting a strong password.
                            </p>
                        </div>

                        {passwordSuccess && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                <span>{passwordSuccess}</span>
                            </div>
                        )}

                        {passwordError && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-rose-800">
                                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                                <span>{passwordError}</span>
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-2xl">
                            {/* Current Password */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        required
                                        placeholder="Enter your current password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        required
                                        placeholder="At least 6 characters"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Password Strength Meter */}
                                {passwordData.newPassword && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                                            <span>Password Strength: {passStrength.label}</span>
                                            <span>{passStrength.percent}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${passStrength.color}`}
                                                style={{ width: `${passStrength.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        placeholder="Re-enter your new password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                            >
                                {changingPassword ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" />
                                        <span>Updating Password...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={15} />
                                        <span>Update Password</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Profile;
