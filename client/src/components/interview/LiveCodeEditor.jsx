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
    BookOpen,
    Building2,
} from "lucide-react";
import { executeCode, analyzeComplexity } from "../../services/interviewService";
import BigOComplexityModal from "./BigOComplexityModal";

const FAANG_PROBLEMS = [
    {
        id: "two_sum",
        name: "Meta / Google: Two Sum (Hash Table O(N))",
        templates: {
            python: `# Problem: Two Sum (Meta / Google)
# Find two numbers that add up to target.
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test execution
print(two_sum([2, 7, 11, 15], 9))
`,
            javascript: `// Problem: Two Sum (Meta / Google)
function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            return [seen.get(diff), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
            cpp: `// Problem: Two Sum (Meta / Google)
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (seen.count(diff)) {
            return {seen[diff], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}
`,
            java: `// Problem: Two Sum (Meta / Google)
import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (seen.containsKey(diff)) {
                return new int[] { seen.get(diff), i };
            }
            seen.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] res = twoSum(new int[] {2, 7, 11, 15}, 9);
        System.out.println(Arrays.toString(res));
    }
}
`,
            go: `// Problem: Two Sum (Meta / Google)
package main
import "fmt"

func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        diff := target - num
        if idx, ok := seen[diff]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}

func main() {
    fmt.Println(twoSum([]int{2, 7, 11, 15}, 9))
}
`,
        },
    },
    {
        id: "lru_cache",
        name: "Google: LRU Cache (Hash Map + Doubly Linked List)",
        templates: {
            python: `# Problem: LRU Cache (Google)
# Get and Put in O(1) time complexity.
class Node:
    def __init__(self, key, val):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        self.left, self.right = Node(0, 0), Node(0, 0)
        self.left.next = self.right
        self.right.prev = self.left

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            # Move to most recent
            node.prev.next = node.next
            node.next.prev = node.prev
            prev_tail = self.right.prev
            prev_tail.next = node
            node.prev = prev_tail
            node.next = self.right
            self.right.prev = node
            return node.val
        return -1

# Test driver
lru = LRUCache(2)
print("Initialized LRU Cache with capacity 2")
`,
            javascript: `// Problem: LRU Cache (Google)
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, value);
    }
}

const lru = new LRUCache(2);
lru.put(1, 100);
console.log("LRU Get Key 1:", lru.get(1));
`,
            cpp: `// Problem: LRU Cache (Google)
#include <iostream>
#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
    int cap;
    list<pair<int, int>> lru;
    unordered_map<int, list<pair<int, int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}
    
    int get(int key) {
        if (mp.find(key) == mp.end()) return -1;
        lru.splice(lru.begin(), lru, mp[key]);
        return mp[key]->second;
    }
};

int main() {
    LRUCache cache(2);
    cout << "LRU Cache Initialized with capacity 2" << endl;
    return 0;
}
`,
            java: `// Problem: LRU Cache (Google)
import java.util.*;

public class Main {
    static class LRUCache extends LinkedHashMap<Integer, Integer> {
        private int capacity;
        public LRUCache(int capacity) {
            super(capacity, 0.75f, true);
            this.capacity = capacity;
        }
        public int get(int key) {
            return super.getOrDefault(key, -1);
        }
        protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
            return size() > capacity;
        }
    }

    public static void main(String[] args) {
        LRUCache lru = new LRUCache(2);
        lru.put(1, 100);
        System.out.println("LRU Cache Value: " + lru.get(1));
    }
}
`,
            go: `// Problem: LRU Cache (Google)
package main
import "fmt"

func main() {
    fmt.Println("LRU Cache Structure initialized in Go")
}
`,
        },
    },
    {
        id: "rate_limiter",
        name: "Stripe: Token Bucket Rate Limiter",
        templates: {
            python: `# Problem: Token Bucket Rate Limiter (Stripe / Distributed Systems)
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate
        self.last_refill = time.time()

    def allow_request(self, tokens=1) -> bool:
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False

# Test driver
bucket = TokenBucket(capacity=5, refill_rate=1.0)
print("Request 1 Allowed:", bucket.allow_request())
`,
            javascript: `// Problem: Token Bucket Rate Limiter (Stripe)
class TokenBucket {
    constructor(capacity, refillRate) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRate = refillRate; // tokens per second
        this.lastRefill = Date.now();
    }

    allowRequest(cost = 1) {
        const now = Date.now();
        const elapsed = (now - this.lastRefill) / 1000;
        this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
        this.lastRefill = now;

        if (this.tokens >= cost) {
            this.tokens -= cost;
            return true;
        }
        return false;
    }
}

const limiter = new TokenBucket(5, 1);
console.log("Request 1 Allowed:", limiter.allowRequest());
`,
            cpp: `// Problem: Token Bucket Rate Limiter (Stripe)
#include <iostream>
#include <chrono>
#include <algorithm>
using namespace std;

int main() {
    cout << "Token Bucket Rate Limiter initialized." << endl;
    return 0;
}
`,
            java: `// Problem: Token Bucket Rate Limiter (Stripe)
public class Main {
    public static void main(String[] args) {
        System.out.println("Token Bucket Rate Limiter active.");
    }
}
`,
            go: `// Problem: Token Bucket Rate Limiter (Stripe)
package main
import "fmt"

func main() {
    fmt.Println("Token Bucket Rate Limiter initialized in Go")
}
`,
        },
    },
];

export default function LiveCodeEditor({
    questionText = "Algorithmic Problem",
    onCodeChange,
    codeValue,
}) {
    const [selectedProblemId, setSelectedProblemId] = useState("two_sum");
    const [language, setLanguage] = useState("python");
    
    // Initial code
    const initialTemplate = FAANG_PROBLEMS[0].templates.python;
    const [code, setCode] = useState(codeValue || initialTemplate);
    const [executing, setExecuting] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);
    const [activeConsoleTab, setActiveConsoleTab] = useState("terminal"); // 'terminal' | 'testcases'

    // Big-O Modal state
    const [analyzingComplexity, setAnalyzingComplexity] = useState(false);
    const [complexityData, setComplexityData] = useState(null);
    const [isComplexityModalOpen, setIsComplexityModalOpen] = useState(false);

    const [copied, setCopied] = useState(false);

    const handleProblemChange = (probId) => {
        setSelectedProblemId(probId);
        const prob = FAANG_PROBLEMS.find((p) => p.id === probId);
        if (prob && prob.templates[language]) {
            setCode(prob.templates[language]);
            if (onCodeChange) onCodeChange(prob.templates[language]);
        }
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        const prob = FAANG_PROBLEMS.find((p) => p.id === selectedProblemId) || FAANG_PROBLEMS[0];
        const template = prob.templates[newLang] || prob.templates.python;
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
            <div className="bg-slate-950 px-4 sm:px-6 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>

                    <span className="text-slate-600">|</span>

                    {/* FAANG Problem Template Selector */}
                    <div className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-indigo-400" />
                        <select
                            value={selectedProblemId}
                            onChange={(e) => handleProblemChange(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-indigo-300 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 max-w-[220px] sm:max-w-xs truncate"
                        >
                            {FAANG_PROBLEMS.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
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
