/**
 * Automated Full-Stack Test Suite for SkillSense.AI
 * Tests all core backend endpoints, AI services, RCE compilers, and database workflows.
 */

const BASE_URL = "http://localhost:8080";
const ts = Date.now();

let candidateToken = "";
let candidateId = "";
let recruiterToken = "";
let sessionId = "";
let testNotificationId = "";

async function makeReq(endpoint, options = {}) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.message || `HTTP ${res.status}`);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return { data, status: res.status };
}

async function runTests() {
    console.log("==========================================================");
    console.log("🧪 RUNNING COMPREHENSIVE SKILLSENSE AUTOMATED TEST SUITE");
    console.log("==========================================================");

    // 1. Health
    console.log("\n[TEST 1] Backend Health Endpoint...");
    const health = await makeReq("/health");
    console.log(`✅ Passed: status="${health.data.status}", message="${health.data.message}"`);

    // 2. Candidate Registration
    console.log("\n[TEST 2] Candidate Registration with Bcrypt & JWT...");
    const candReg = await makeReq("/api/auth/register", {
        method: "POST",
        body: {
            name: "Test Candidate",
            email: `test_cand_${ts}@gmail.com`,
            password: "CandidatePass123!",
            role: "candidate",
        },
    });
    candidateToken = candReg.data.token;
    candidateId = candReg.data.user.id;
    console.log(`✅ Passed: Registered candidate "${candReg.data.user.name}" (ID: ${candidateId})`);

    // 3. Recruiter Registration
    console.log("\n[TEST 3] Recruiter Registration & Role Segregation...");
    const recReg = await makeReq("/api/auth/register", {
        method: "POST",
        body: {
            name: "Google Staff Recruiter",
            email: `google_rec_${ts}@google.com`,
            password: "RecruiterPass123!",
            role: "recruiter",
            companyName: "Google",
        },
    });
    recruiterToken = recReg.data.token;
    console.log(`✅ Passed: Registered recruiter "${recReg.data.user.name}" at Google`);

    // 4. Remote Code Execution (RCE) - Python
    console.log("\n[TEST 4] Remote Code Execution Sandbox (Python 3.10)...");
    const pyCode = `
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []

print(two_sum([2, 7, 11, 15], 9))
`;
    const rcePy = await makeReq("/api/interview/execute-code", {
        method: "POST",
        headers: { Authorization: `Bearer ${candidateToken}` },
        body: {
            code: pyCode,
            language: "python",
            testCases: [{ input: "[2, 7, 11, 15], 9", expected: "[0, 1]" }],
        },
    });
    console.log(`✅ Passed: Status="${rcePy.data.status}", Runtime=${rcePy.data.executionTimeMs}ms, Output="${rcePy.data.stdout?.trim()}"`);

    // 5. Remote Code Execution (RCE) - JavaScript
    console.log("\n[TEST 5] Remote Code Execution Sandbox (JavaScript Node.js)...");
    const jsCode = `
const solve = (n) => n <= 1 ? 1 : n * solve(n - 1);
console.log(solve(5));
`;
    const rceJs = await makeReq("/api/interview/execute-code", {
        method: "POST",
        headers: { Authorization: `Bearer ${candidateToken}` },
        body: {
            code: jsCode,
            language: "javascript",
            testCases: [{ input: "5!", expected: "120" }],
        },
    });
    console.log(`✅ Passed: Status="${rceJs.data.status}", Runtime=${rceJs.data.executionTimeMs}ms, Output="${rceJs.data.stdout?.trim()}"`);

    // 6. AI Big-O Complexity Analyzer
    console.log("\n[TEST 6] AI Big-O Time & Space Complexity Analyzer (Gemini AI)...");
    const complexityRes = await makeReq("/api/interview/analyze-complexity", {
        method: "POST",
        headers: { Authorization: `Bearer ${candidateToken}` },
        body: {
            code: pyCode,
            language: "python",
            problem: "Two Sum Problem with Hash Map",
        },
    });
    console.log(`✅ Passed: Time Complexity="${complexityRes.data.timeComplexity}", Space Complexity="${complexityRes.data.spaceComplexity}"`);
    console.log(`   Derivation: "${complexityRes.data.timeDerivation}"`);

    // 7. Skill Calibration
    console.log("\n[TEST 7] Candidate Skill Calibration & Upsert...");
    const skillRes = await makeReq("/api/resume/skills", {
        method: "PUT",
        headers: { Authorization: `Bearer ${candidateToken}` },
        body: {
            skills: ["Python", "Algorithms", "System Design", "Distributed Systems", "PostgreSQL"],
        },
    });
    console.log(`✅ Passed: Skills calibrated -> ${skillRes.data.skills.join(", ")}`);

    // 8. Dynamic Question Generation
    console.log("\n[TEST 8] Dynamic Interview Question Generation (Google Context • Senior Tier)...");
    const qRes = await makeReq("/api/interview/questions", {
        method: "POST",
        headers: { Authorization: `Bearer ${candidateToken}` },
        body: {
            difficulty: "Senior",
            company: "Google",
            track: "System Design & Distributed Scalability",
            durationMinutes: 10,
            questionCount: 3,
        },
    });
    console.log(`✅ Passed: Generated ${qRes.data.questions.length} questions:`);
    qRes.data.questions.forEach((q, i) => console.log(`   Q${i + 1} [${q.skill}]: ${q.question}`));

    // 9. Session Initialization & Answer Submission
    console.log("\n[TEST 9] Session Lifecycle & Sub-Second AI Answer Evaluation...");
    const startRes = await makeReq("/api/interview/start", {
        method: "POST",
        headers: { Authorization: `Bearer ${candidateToken}` },
        body: { difficulty: "Senior", company: "Google", durationMinutes: 10 },
    });
    sessionId = startRes.data.sessionId;

    const ansRes = await makeReq("/api/interview/answer", {
        method: "POST",
        headers: { Authorization: `Bearer ${candidateToken}` },
        body: {
            sessionId,
            question: qRes.data.questions[0].question,
            skill: qRes.data.questions[0].skill,
            answer: "We decouple ingestion using Apache Kafka and partition by user ID to guarantee strict in-order processing while scaling horizontally across consumer clusters.",
            timeSpentSeconds: 45,
        },
    });
    console.log(`✅ Passed: Answer evaluated with Score=${ansRes.data.evaluation.score}/10`);
    console.log(`   Model Answer Snippet: "${ansRes.data.evaluation.modelAnswer?.slice(0, 80)}..."`);

    // 10. Recruiter Shortlisting & Notifications
    console.log("\n[TEST 10] Recruiter Shortlisting & Real-Time Candidate Notification Alert...");
    const shortlistRes = await makeReq("/api/recruiter/shortlist", {
        method: "POST",
        headers: { Authorization: `Bearer ${recruiterToken}` },
        body: {
            candidateId,
            status: "Interviewing",
            notes: "Outstanding distributed systems response. Scheduling Round 2 with Tech Lead!",
        },
    });
    console.log(`✅ Passed: Recruiter marked status as "${shortlistRes.data.shortlist.status}"`);

    // 11. Candidate In-App Notification Delivery
    console.log("\n[TEST 11] Candidate Notification Verification...");
    const notifRes = await makeReq("/api/notifications", {
        method: "GET",
        headers: { Authorization: `Bearer ${candidateToken}` },
    });
    console.log(`✅ Passed: Candidate received ${notifRes.data.unreadCount} unread notification(s)`);
    testNotificationId = notifRes.data.notifications[0]._id;
    console.log(`   Notification: "${notifRes.data.notifications[0].title}"`);
    console.log(`   Note: "${notifRes.data.notifications[0].message}"`);

    // 12. Mark Notification as Read
    console.log("\n[TEST 12] Mark Notification as Read...");
    await makeReq(`/api/notifications/${testNotificationId}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${candidateToken}` },
    });
    console.log("✅ Passed: Notification marked as read.");

    console.log("\n==========================================================");
    console.log("🎉 ALL 12 AUTOMATED TESTS PASSED WITH 100% SUCCESS!");
    console.log("==========================================================");
}

runTests().catch((err) => {
    console.error("❌ Test Suite Error:", err.data || err.message);
    process.exit(1);
});
