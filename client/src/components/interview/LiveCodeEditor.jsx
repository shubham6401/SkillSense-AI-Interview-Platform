import { useState } from "react";
import {
    Play,
    Sparkles,
    Terminal,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Loader2,
    Code2,
    Clock,
    HardDrive,
    Copy,
    Check,
} from "lucide-react";
import { executeCode, analyzeComplexity } from "../../services/interviewService";
import BigOComplexityModal from "./BigOComplexityModal";

const DEFAULT_TEMPLATES = {
    python: `# Python 3.10 Solution
def solve(arr, target):
    seen = {}
    for i, num in enumerate(arr):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test driver
print(solve([2, 7, 11, 15], 9))
`,
    javascript: `// JavaScript (Node.js) Solution
function solve(arr, target) {
    const seen = new Map();
    for (let i = 0; i < arr.length; i++) {
        const comp = target - arr[i];
        if (seen.has(comp)) {
            return [seen.get(comp), i];
        }
        seen.set(arr[i], i);
    }
    return [];
}

// Test driver
console.log(solve([2, 7, 11, 15], 9));
`,
    cpp: `// C++ (GCC 10.2) Solution
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> solve(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int comp = target - nums[i];
        if (seen.count(comp)) {
            return {seen[comp], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = solve(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}
`,
    java: `// Java (OpenJDK 15) Solution
import java.util.*;

public class Main {
    public static int[] solve(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (seen.containsKey(comp)) {
                return new int[] { seen.get(comp), i };
            }
            seen.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] res = solve(new int[] {2, 7, 11, 15}, 9);
        System.out.println(Arrays.toString(res));
    }
}
`,
    go: `// Go 1.16 Solution
package main
import "fmt"

func solve(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        comp := target - num
        if idx, ok := seen[comp]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}

func main() {
    fmt.Println(solve([]int{2, 7, 11, 15}, 9))
}
`,
};

export default function LiveCodeEditor({
    questionText = "Algorithmic Problem",
    onCodeChange,
    codeValue,
}) {
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState(codeValue || DEFAULT_TEMPLATES.python);
    const [executing, setExecuting] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);
    const [activeConsoleTab, setActiveConsoleTab] = useState("terminal"); // 'terminal' | 'testcases'

    // Big-O Modal state
    const [analyzingComplexity, setAnalyzingComplexity] = useState(false);
    const [complexityData, setComplexityData] = useState(null);
    const [isComplexityModalOpen, setIsComplexityModalOpen] = useState(false);

    const [copied, setCopied] = useState(false);

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        const template = DEFAULT_TEMPLATES[newLang] || DEFAULT_TEMPLATES.python;
        setCode(template);
        if (onCodeChange) onCodeChange(template);
    };

    const handleCodeInput = (e) => {
        const val = e.target.value;
        setCode(val);
        if (onCodeChange) onCodeChange(val);
    };

    const handleRunCode = async () => {
        try {
            setExecuting(true);
            setExecutionResult(null);

            const testCases = [
                { input: "[2, 7, 11, 15], target=9", expected: "[0, 1]" },
                { input: "[3, 2, 4], target=6", expected: "[1, 2]" },
            ];

            const res = await executeCode({
                code,
                language,
                testCases,
            });

            setExecutionResult(res.data);
            setActiveConsoleTab("terminal");
        } catch (err) {
            setExecutionResult({
                status: "Execution Failed",
                stderr: err.response?.data?.message || err.message,
                executionTimeMs: 0,
            });
        } finally {
            setExecuting(false);
        }
    };

    const handleAnalyzeComplexity = async () => {
        try {
            setAnalyzingComplexity(true);
            const res = await analyzeComplexity({
                code,
                language,
                problem: questionText,
            });
            setComplexityData(res.data);
            setIsComplexityModalOpen(true);
        } catch (err) {
            alert("Could not complete Big-O analysis: " + (err.response?.data?.message || err.message));
        } finally {
            setAnalyzingComplexity(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Editor Toolbar */}
            <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>

                    <span className="text-slate-600">|</span>

                    {/* Language Selector */}
                    <select
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                        <option value="python">Python 3.10</option>
                        <option value="javascript">JavaScript (Node.js)</option>
                        <option value="cpp">C++ (GCC 10.2)</option>
                        <option value="java">Java (OpenJDK 15)</option>
                        <option value="go">Go 1.16</option>
                    </select>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy Code"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                        {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleLanguageChange(language)}
                        title="Reset Template"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                        <RotateCcw size={15} />
                    </button>

                    {/* Analyze Big-O Button */}
                    <button
                        type="button"
                        onClick={handleAnalyzeComplexity}
                        disabled={analyzingComplexity || !code.trim()}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 transition flex items-center gap-1.5"
                    >
                        {analyzingComplexity ? (
                            <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Analyzing Big-O...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={13} />
                                <span>Analyze Big-O Complexity</span>
                            </>
                        )}
                    </button>

                    {/* Run Code Button */}
                    <button
                        type="button"
                        onClick={handleRunCode}
                        disabled={executing || !code.trim()}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition flex items-center gap-1.5"
                    >
                        {executing ? (
                            <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Compiling...</span>
                            </>
                        ) : (
                            <>
                                <Play size={13} fill="currentColor" />
                                <span>Run Code</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Textarea with Line Numbers aesthetic */}
            <div className="relative">
                <textarea
                    value={code}
                    onChange={handleCodeInput}
                    rows={13}
                    spellCheck="false"
                    placeholder="// Write your multi-language algorithmic solution here..."
                    className="w-full bg-slate-900 font-mono text-xs sm:text-sm text-blue-300 p-5 focus:outline-none resize-none leading-relaxed border-0"
                />
            </div>

            {/* Execution Console Output Panel */}
            <div className="bg-slate-950 border-t border-slate-800 p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveConsoleTab("terminal")}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                                activeConsoleTab === "terminal"
                                    ? "bg-slate-800 text-slate-100"
                                    : "text-slate-500 hover:text-slate-300"
                            }`}
                        >
                            <Terminal size={13} />
                            <span>Terminal Output</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveConsoleTab("testcases")}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                                activeConsoleTab === "testcases"
                                    ? "bg-slate-800 text-slate-100"
                                    : "text-slate-500 hover:text-slate-300"
                            }`}
                        >
                            <CheckCircle2 size={13} />
                            <span>Test Case Assertions</span>
                        </button>
                    </div>

                    {executionResult && (
                        <div className="flex items-center gap-3 text-[11px] font-mono">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                executionResult.status === "Accepted"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            }`}>
                                {executionResult.status}
                            </span>
                            <span className="text-slate-400 flex items-center gap-1">
                                <Clock size={12} />
                                {executionResult.executionTimeMs}ms
                            </span>
                            <span className="text-slate-400 flex items-center gap-1">
                                <HardDrive size={12} />
                                {executionResult.memoryKb} KB
                            </span>
                        </div>
                    )}
                </div>

                {/* Console Body */}
                {activeConsoleTab === "terminal" && (
                    <div className="bg-slate-900/90 rounded-2xl p-3 font-mono text-xs text-slate-300 min-h-[90px] border border-slate-800/80 overflow-x-auto">
                        {!executionResult ? (
                            <span className="text-slate-500 italic">
                                Click "Run Code" to compile and execute your program in the isolated sandbox...
                            </span>
                        ) : executionResult.stderr ? (
                            <div className="text-rose-400 whitespace-pre-wrap">{executionResult.stderr}</div>
                        ) : (
                            <div className="text-emerald-400 whitespace-pre-wrap">{executionResult.stdout}</div>
                        )}
                    </div>
                )}

                {activeConsoleTab === "testcases" && (
                    <div className="space-y-2">
                        {executionResult?.testResults?.length > 0 ? (
                            executionResult.testResults.map((tc) => (
                                <div
                                    key={tc.id}
                                    className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-slate-400 text-[11px]">Input: <span className="text-slate-200">{tc.input}</span></p>
                                        <p className="text-slate-400 text-[11px]">Expected: <span className="text-emerald-400">{tc.expected}</span></p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                                        tc.passed ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                                    }`}>
                                        {tc.passed ? "Passed ✓" : "Failed ✗"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 bg-slate-900 rounded-xl text-center text-slate-500 text-xs">
                                Click "Run Code" to validate test assertions.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Big-O Complexity Modal */}
            <BigOComplexityModal
                isOpen={isComplexityModalOpen}
                onClose={() => setIsComplexityModalOpen(false)}
                complexityData={complexityData}
            />
        </div>
    );
}
