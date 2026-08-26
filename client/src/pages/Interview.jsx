import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    getQuestions,
    startInterview,
    submitAnswer,
    endInterview,
    getHint,
} from "../services/interviewService";
import { getCurrentResume } from "../services/resumeService";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InterviewSetupModal from "../components/interview/InterviewSetupModal";
import LiveCodeEditor from "../components/interview/LiveCodeEditor";
import SystemDesignWhiteboard from "../components/interview/SystemDesignWhiteboard";
import {
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Clock,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Loader2,
    BrainCircuit,
    AlertCircle,
    Lightbulb,
    Code2,
    X,
    Building2,
    Gauge,
    Timer,
    Wand2,
    Hourglass,
    Layers,
    FileText,
} from "lucide-react";

function Interview() {
    // Stage state: 'setup' | 'interview'
    const [stage, setStage] = useState("setup");
    const [loadingSetup, setLoadingSetup] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [setupError, setSetupError] = useState("");

    // Workspace mode: 'verbal' | 'code' | 'whiteboard'
    const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("verbal");

    // Live interview states
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState("");
    const [codeContent, setCodeContent] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [interviewConfig, setInterviewConfig] = useState(null);

    // Timers
    const [questionSecondsElapsed, setQuestionSecondsElapsed] = useState(0);
    const [questionSecondsRemaining, setQuestionSecondsRemaining] = useState(0);
    const [totalSecondsRemaining, setTotalSecondsRemaining] = useState(20 * 60);

    // AI Hint
    const [hintData, setHintData] = useState({ text: "", loading: false, isOpen: false });

    // Submission & Audio
    const [submitting, setSubmitting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const questionTimerRef = useRef(null);
    const sessionCountdownRef = useRef(null);
    const navigate = useNavigate();

    const {
        isListening,
        finalTranscript,
        interimTranscript,
        isSupported: isSpeechSupported,
        startListening,
        stopListening,
        resetTranscript,
    } = useSpeechRecognition();

    // Check resume on mount
    useEffect(() => {
        const checkResume = async () => {
            try {
                const res = await getCurrentResume();
                if (res.data && res.data.uploaded) {
                    setResumeData(res.data);
                } else {
                    setSetupError("No resume found. Please upload your resume first to calibrate your interview.");
                }
            } catch (err) {
                console.error("Resume check error:", err);
                setSetupError("Could not connect to server or verify resume.");
            }
        };

        checkResume();

        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (questionTimerRef.current) clearInterval(questionTimerRef.current);
            if (sessionCountdownRef.current) clearInterval(sessionCountdownRef.current);
        };
    }, []);

    // Per-question timer & countdown
    useEffect(() => {
        if (stage !== "interview") return;

        setQuestionSecondsElapsed(0);
        const perQTimer = interviewConfig?.perQuestionTimer || 0;
        setQuestionSecondsRemaining(perQTimer);

        if (questionTimerRef.current) clearInterval(questionTimerRef.current);

        questionTimerRef.current = setInterval(() => {
            setQuestionSecondsElapsed((prev) => prev + 1);
            setQuestionSecondsRemaining((prev) => {
                if (prev <= 1) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        };
    }, [currentQuestion, stage, interviewConfig]);

    // Global session countdown clock
    useEffect(() => {
        if (stage !== "interview") return;

        if (sessionCountdownRef.current) clearInterval(sessionCountdownRef.current);

        sessionCountdownRef.current = setInterval(() => {
            setTotalSecondsRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(sessionCountdownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (sessionCountdownRef.current) clearInterval(sessionCountdownRef.current);
        };
    }, [stage]);

    // Append finalized speech-to-text without duplicating previous words
    useEffect(() => {
        if (finalTranscript) {
            setAnswer((prev) => {
                const cleanPrev = prev.trim();
                return cleanPrev ? `${cleanPrev} ${finalTranscript}` : finalTranscript;
            });
            resetTranscript();
        }
    }, [finalTranscript, resetTranscript]);

    // Start interview with configuration
    const handleStartInterview = async (config) => {
        try {
            setLoadingSetup(true);
            setSetupError("");

            const [qRes, sRes] = await Promise.all([
                getQuestions(config),
                startInterview(config),
            ]);

            if (!qRes.data.questions || qRes.data.questions.length === 0) {
                setSetupError("No questions generated. Please ensure your resume has technical skills.");
                setLoadingSetup(false);
                return;
            }

            setQuestions(qRes.data.questions);
            setSessionId(sRes.data.sessionId);
            setInterviewConfig(config);
            setTotalSecondsRemaining((config.durationMinutes || 20) * 60);
            setStage("interview");
        } catch (err) {
            console.error("Failed to initialize configured interview:", err);
            setSetupError(err.response?.data?.message || "Failed to start interview session. Please try again.");
        } finally {
            setLoadingSetup(false);
        }
    };

    // Request an AI Hint
    const handleRequestHint = async () => {
        const activeQ = questions[currentQuestion];
        if (!activeQ) return;

        setHintData({ text: "", loading: true, isOpen: true });
        try {
            const res = await getHint({
                sessionId,
                question: activeQ.question,
                skill: activeQ.skill,
            });
            setHintData({ text: res.data.hint, loading: false, isOpen: true });
        } catch (err) {
            console.error("Hint error:", err);
            setHintData({ text: "Focus on explaining the underlying mechanism, trade-offs, and practical edge cases.", loading: false, isOpen: true });
        }
    };

    // Text to Speech
    const handleSpeakQuestion = () => {
        if (!("speechSynthesis" in window)) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const currentQ = questions[currentQuestion]?.question;
        if (!currentQ) return;

        const utterance = new SpeechSynthesisUtterance(currentQ);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const toggleVoiceRecording = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // Clean & polish speech formatting
    const handlePolishSpeech = () => {
        if (!answer.trim()) return;
        const cleaned = answer
            .replace(/\s+/g, " ")
            .replace(/\b(um|uh|er|ah|like you know)\b/gi, "")
            .trim();
        const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        setAnswer(capitalized.endsWith(".") ? capitalized : `${capitalized}.`);
    };

    // Submit Answer & Step Forward
    const handleNext = async () => {
        if (!answer.trim() && !codeContent.trim()) {
            alert("Please type, speak, or code your solution before proceeding.");
            return;
        }

        if (isListening) stopListening();
        if (isSpeaking && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }

        try {
            setSubmitting(true);

            const activeQuestion = questions[currentQuestion];
            const fullAnswer = codeContent.trim()
                ? `${answer.trim()}\n\n[Executable Code Solution]:\n${codeContent.trim()}`
                : answer.trim();

            const data = {
                sessionId,
                question: activeQuestion.question,
                skill: activeQuestion.skill,
                answer: fullAnswer,
                codeSnippet: codeContent.trim(),
                timeSpentSeconds: questionSecondsElapsed,
            };

            await submitAnswer(data);

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion((prev) => prev + 1);
                setAnswer("");
                setCodeContent("");
                setActiveWorkspaceTab("verbal");
                setHintData({ text: "", loading: false, isOpen: false });
            } else {
                await endInterview(sessionId);
                navigate(`/report/${sessionId}`);
            }
        } catch (err) {
            console.error("Submission failed:", err);
            alert(err.response?.data?.message || "Failed to submit answer. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTimer = (totalSec) => {
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
    const progressPercent = questions.length > 0
        ? Math.round(((currentQuestion + 1) / questions.length) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
                {/* STAGE 1: PRE-INTERVIEW SETUP */}
                {stage === "setup" && (
                    <div>
                        {setupError ? (
                            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center max-w-lg mx-auto">
                                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-4">
                                    <AlertCircle size={28} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Resume Setup Required
                                </h2>
                                <p className="text-xs text-slate-500 mt-2">
                                    {setupError}
                                </p>
                                <button
                                    onClick={() => navigate("/resume")}
                                    className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                                >
                                    Upload Resume First →
                                </button>
                            </div>
                        ) : (
                            <InterviewSetupModal
                                skills={resumeData?.skills || []}
                                onStart={handleStartInterview}
                                loading={loadingSetup}
                            />
                        )}
                    </div>
                )}

                {/* STAGE 2: LIVE INTERVIEW ROOM */}
                {stage === "interview" && (
                    <div className="space-y-6">
                        {/* Session HUD / Top Navigation */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                        Q{currentQuestion + 1}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Question {currentQuestion + 1} of {questions.length}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                {questions[currentQuestion]?.skill}
                                            </span>
                                            {interviewConfig?.difficulty && (
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                    {interviewConfig.difficulty}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                                            Target: {interviewConfig?.company || "Tech Interview"}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Per-Question Timer (if enabled) */}
                                    {interviewConfig?.perQuestionTimer > 0 && (
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                                            questionSecondsRemaining <= 30
                                                ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse"
                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}>
                                            <Hourglass size={14} className={questionSecondsRemaining <= 30 ? "text-rose-500" : "text-amber-600"} />
                                            <span>Question: {formatTimer(questionSecondsRemaining)}</span>
                                        </div>
                                    )}

                                    {/* Global Session Countdown Clock */}
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                                        totalSecondsRemaining <= 180
                                            ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                                             : "bg-slate-100 text-slate-700 border-slate-200"
                                    }`}>
                                        <Timer size={14} className={totalSecondsRemaining <= 180 ? "text-red-500" : "text-blue-600"} />
                                        <span>Total: {formatTimer(totalSecondsRemaining)}</span>
                                    </div>

                                    {/* Progress percentage */}
                                    <span className="text-xs font-bold text-blue-600">
                                        {progressPercent}%
                                    </span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-100 rounded-full h-2 mt-5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                            {/* Question Keyword Metadata Ribbon */}
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                                    <Building2 size={12} className="text-blue-600" />
                                    <span>Company: {interviewConfig?.company || "Tech Interview"}</span>
                                </span>

                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
                                    <Gauge size={12} className="text-purple-600" />
                                    <span>Tier: {interviewConfig?.difficulty || "Mid-Level"}</span>
                                </span>

                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
                                    <Layers size={12} className="text-indigo-600" />
                                    <span>Track: {interviewConfig?.track || "Full-Stack"}</span>
                                </span>

                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                                    <Code2 size={12} className="text-emerald-600" />
                                    <span>Skill: {questions[currentQuestion]?.skill || "General"}</span>
                                </span>

                                {interviewConfig?.perQuestionTimer > 0 && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                                        <Clock size={12} className="text-amber-600" />
                                        <span>Target: {interviewConfig.perQuestionTimer / 60}m</span>
                                    </span>
                                )}
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-relaxed tracking-tight">
                                        {questions[currentQuestion]?.question}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {/* AI Hint button */}
                                    <button
                                        type="button"
                                        onClick={handleRequestHint}
                                        title="Request a subtle clue"
                                        className="p-3 rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all flex items-center gap-1.5 text-xs font-bold"
                                    >
                                        <Lightbulb size={17} className="text-amber-600" />
                                        <span className="hidden sm:inline">Hint</span>
                                    </button>

                                    {/* Text-to-speech speaker button */}
                                    <button
                                        type="button"
                                        onClick={handleSpeakQuestion}
                                        title={isSpeaking ? "Stop Voice" : "Listen to Question"}
                                        className={`p-3 rounded-2xl border transition-all ${
                                            isSpeaking
                                                ? "bg-blue-600 text-white border-blue-600 animate-pulse"
                                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600"
                                        }`}
                                    >
                                        {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* AI Hint Drawer */}
                            {hintData.isOpen && (
                                <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs animate-in fade-in slide-in-from-top-2 duration-150 relative">
                                    <button
                                        onClick={() => setHintData({ ...hintData, isOpen: false })}
                                        className="absolute top-3 right-3 text-amber-600 hover:text-amber-800"
                                    >
                                        <X size={15} />
                                    </button>
                                    <div className="flex items-center gap-2 font-bold mb-1 text-amber-800">
                                        <Lightbulb size={15} />
                                        <span>AI Interviewer Hint (No Penalty):</span>
                                    </div>
                                    {hintData.loading ? (
                                        <div className="flex items-center gap-2 text-amber-700 py-1">
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Synthesizing tailored hint...</span>
                                        </div>
                                    ) : (
                                        <p className="leading-relaxed">{hintData.text}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Interactive Multi-Modal Workspace Tabs */}
                        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
                            <button
                                type="button"
                                onClick={() => setActiveWorkspaceTab("verbal")}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                                    activeWorkspaceTab === "verbal"
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                <FileText size={15} />
                                <span>Verbal & Written Explanation</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveWorkspaceTab("code")}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                                    activeWorkspaceTab === "code"
                                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                <Code2 size={15} />
                                <span>Live Code Compiler & Big-O</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveWorkspaceTab("whiteboard")}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                                    activeWorkspaceTab === "whiteboard"
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                <Layers size={15} />
                                <span>System Design Whiteboard</span>
                            </button>
                        </div>

                        {/* TAB 1: Verbal & Speech Response */}
                        {activeWorkspaceTab === "verbal" && (
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Your Technical Explanation
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handlePolishSpeech}
                                            disabled={!answer.trim()}
                                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-40 flex items-center gap-1 transition"
                                        >
                                            <Wand2 size={13} />
                                            <span>Polish Speech</span>
                                        </button>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            {wordCount} words
                                        </span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <textarea
                                        rows={6}
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        placeholder="Explain your approach, architectural trade-offs, algorithms, and edge cases clearly..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition leading-relaxed resize-none"
                                    />

                                    {interimTranscript && (
                                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-800 italic mt-2 animate-pulse">
                                            <span className="font-bold">Live voice input:</span> "{interimTranscript}"
                                        </div>
                                    )}
                                </div>

                                {/* Voice Controls & Actions */}
                                <div className="flex items-center justify-between pt-2">
                                    {isSpeechSupported ? (
                                        <button
                                            type="button"
                                            onClick={toggleVoiceRecording}
                                            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                                                isListening
                                                    ? "bg-red-600 text-white animate-pulse shadow-md shadow-red-500/30"
                                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                            }`}
                                        >
                                            {isListening ? (
                                                <>
                                                    <MicOff size={15} />
                                                    <span>Stop Voice</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Mic size={15} />
                                                    <span>Speak Answer (Voice)</span>
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <span className="text-[11px] text-slate-400">
                                            Voice input supported in Chrome / Edge.
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 2: Live Code Compiler & Big-O Analyzer */}
                        {activeWorkspaceTab === "code" && (
                            <LiveCodeEditor
                                questionText={questions[currentQuestion]?.question}
                                onCodeChange={(c) => setCodeContent(c)}
                                codeValue={codeContent}
                            />
                        )}

                        {/* TAB 3: System Design Whiteboard */}
                        {activeWorkspaceTab === "whiteboard" && (
                            <SystemDesignWhiteboard />
                        )}

                        {/* Submit & Next Button */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                                <Clock size={14} />
                                <span>Spent on this question: {formatTimer(questionSecondsElapsed)}</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={submitting}
                                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Evaluating Answer...</span>
                                    </>
                                ) : currentQuestion < questions.length - 1 ? (
                                    <>
                                        <span>Submit & Next Question</span>
                                        <ArrowRight size={16} />
                                    </>
                                ) : (
                                    <>
                                        <span>Finish & Generate Comprehensive Report</span>
                                        <CheckCircle2 size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Interview;