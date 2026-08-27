import { useState, useEffect, useRef } from "react";
import {
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    Plus,
    X,
    Sparkles,
    ArrowRight,
    RefreshCw,
    Award,
    Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { uploadResume, getCurrentResume, updateSkills } from "../services/resumeService";

function Resume() {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [savingSkills, setSavingSkills] = useState(false);
    const [currentResume, setCurrentResume] = useState(null);
    const [skills, setSkills] = useState([]);
    const [newSkillInput, setNewSkillInput] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadCurrentResume();
    }, []);

    const loadCurrentResume = async () => {
        try {
            const res = await getCurrentResume();
            if (res.data && res.data.uploaded) {
                setCurrentResume(res.data);
                setSkills(res.data.skills || []);
            }
        } catch (err) {
            console.error("Could not fetch current resume:", err);
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf")) {
                setFile(droppedFile);
            } else {
                setMessage({ text: "Only PDF files are supported.", type: "error" });
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage({ text: "Please select a PDF resume file first.", type: "error" });
            return;
        }

        try {
            setLoading(true);
            setMessage({ text: "", type: "" });

            const formData = new FormData();
            formData.append("resume", file);

            const response = await uploadResume(formData);

            setSkills(response.data.skills || []);
            setCurrentResume({
                uploaded: true,
                originalName: response.data.originalName || file.name,
                skills: response.data.skills || [],
                uploadedAt: new Date(),
            });
            setMessage({
                text: "Resume analyzed successfully! Skills extracted.",
                type: "success",
            });
            setFile(null);
        } catch (err) {
            console.error(err);
            setMessage({
                text: err.response?.data?.message || "Failed to upload resume. Please try again.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        const trimmed = newSkillInput.trim();
        if (!trimmed) return;
        if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
            setNewSkillInput("");
            return;
        }

        const updated = [...skills, trimmed];
        setSkills(updated);
        setNewSkillInput("");
        await persistSkills(updated);
    };

    const handleRemoveSkill = async (skillToRemove) => {
        const updated = skills.filter((s) => s !== skillToRemove);
        setSkills(updated);
        await persistSkills(updated);
    };

    const persistSkills = async (updatedSkills) => {
        try {
            setSavingSkills(true);
            await updateSkills(updatedSkills);
        } catch (err) {
            console.error("Failed to update skills:", err);
        } finally {
            setSavingSkills(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Header Banner */}
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
                        <Sparkles size={14} />
                        Skill Extraction & AI Tuning
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Upload Your Resume
                    </h1>
                    <p className="mt-2 sm:mt-3 text-slate-600 text-xs sm:text-base leading-relaxed px-2">
                        Upload your PDF resume to automatically extract your tech stack and generate personalized AI mock interview questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                    {/* Left: Upload Dropzone Card */}
                    <div className="lg:col-span-6 flex flex-col">
                        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm flex-1 flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                                    <FileText className="text-blue-600" size={20} />
                                    {currentResume ? "Update Resume" : "Select Resume"}
                                </h2>
                                <p className="text-xs text-slate-500 mb-4 sm:mb-6">
                                    Upload in PDF format (Max 10MB)
                                </p>

                                {/* Drag & Drop Zone */}
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleFileDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                                        isDragging
                                            ? "border-blue-500 bg-blue-50/50 scale-[0.99]"
                                            : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/80"
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <div className="w-16 h-16 rounded-2xl bg-blue-100/70 text-blue-600 mx-auto flex items-center justify-center mb-4">
                                        <Upload size={28} />
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-base">
                                        Click or drag & drop resume PDF
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Supports text-based PDF files
                                    </p>
                                </div>

                                {/* Selected File Preview */}
                                {file && (
                                    <div className="mt-4 flex items-center justify-between p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <FileText className="text-blue-600 shrink-0" size={22} />
                                            <div className="truncate">
                                                <p className="text-xs font-bold text-slate-800 truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="text-slate-400 hover:text-red-500 p-1"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}

                                {/* Feedback Notification */}
                                {message.text && (
                                    <div
                                        className={`mt-4 p-3.5 rounded-xl border flex items-center gap-3 text-xs font-medium ${
                                            message.type === "success"
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                                : "bg-red-50 border-red-200 text-red-800"
                                        }`}
                                    >
                                        {message.type === "success" ? (
                                            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                                        ) : (
                                            <AlertCircle size={18} className="text-red-600 shrink-0" />
                                        )}
                                        <span>{message.text}</span>
                                    </div>
                                )}
                            </div>

                            {/* Upload Button */}
                            <button
                                onClick={handleUpload}
                                disabled={loading || !file}
                                className="mt-6 w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        Extracting Skills with AI...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        {currentResume ? "Upload & Re-Analyze Resume" : "Upload & Analyze Resume"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right: Detected & Custom Skills Tuning */}
                    <div className="lg:col-span-6 flex flex-col">
                        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <Award className="text-blue-600" size={22} />
                                        Extracted Skills
                                    </h2>
                                    {savingSkills && (
                                        <span className="text-[11px] text-blue-600 flex items-center gap-1 font-semibold">
                                            <RefreshCw size={12} className="animate-spin" />
                                            Saving...
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mb-6">
                                    AI will ask questions targeting these skills. Add or remove skills to customize your mock interview.
                                </p>

                                {/* Custom Skill Tag Input */}
                                <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        placeholder="Add custom skill (e.g. Docker, Python, System Design)..."
                                        value={newSkillInput}
                                        onChange={(e) => setNewSkillInput(e.target.value)}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newSkillInput.trim()}
                                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                                    >
                                        <Plus size={15} />
                                        Add
                                    </button>
                                </form>

                                {/* Skill Chips */}
                                {skills.length === 0 ? (
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs">
                                        No skills detected yet. Upload a resume or type skills above to get started.
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2.5 max-h-64 overflow-y-auto pr-1">
                                        {skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold group hover:border-blue-300 transition"
                                            >
                                                {skill}
                                                <button
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="text-blue-400 hover:text-red-500 transition rounded-full p-0.5"
                                                    title={`Remove ${skill}`}
                                                >
                                                    <X size={13} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action CTA */}
                            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-xs text-slate-500 text-center sm:text-left">
                                    <span className="font-bold text-slate-800">{skills.length}</span> skills selected for interview
                                </div>
                                <button
                                    onClick={() => navigate("/interview")}
                                    disabled={skills.length === 0}
                                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
                                >
                                    <span>Start Interview with these Skills</span>
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Resume;