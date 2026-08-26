require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user.js");
const Resume = require("./models/resume.js");
const InterviewSession = require("./models/InterviewSession.js");
const Shortlist = require("./models/shortlist.js");
const Notification = require("./models/notification.js");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/interview_platform";

async function seedDatabase() {
    console.log("==========================================================");
    console.log("🌱 SEEDING PRODUCTION DEMO ACCOUNTS & INTERVIEW DATA");
    console.log("==========================================================");

    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const hashedPassword = await bcrypt.hash("Password123!", 10);

    // 1. Define Candidates
    const candidateData = [
        {
            name: "Shubham Gupta",
            email: "shubham.architect@gmail.com",
            role: "candidate",
            headline: "Senior Full-Stack Architect • Distributed Systems & React",
            bio: "Ex-Staff Engineer candidate specializing in scalable Node.js microservices, distributed caching with Redis, and React performance optimization.",
            skills: ["React", "Node.js", "Distributed Systems", "MongoDB", "System Design", "Docker", "Redis", "Kafka"],
            interviews: [
                {
                    company: "Google",
                    difficulty: "Senior",
                    track: "System Design & Distributed Scalability",
                    durationMinutes: 20,
                    answers: [
                        {
                            question: "How would you design a distributed rate limiter for Google Search APIs handling 500k RPS?",
                            answer: "I would use a Sliding Window Counter algorithm backed by Redis Cluster. By using Redis Lua scripts, we guarantee atomic read-modify-write operations across sharded Redis nodes. We can also introduce local in-memory token buckets at the Envoy API Gateway layer to absorb micro-bursts and minimize cross-network round-trips.",
                            score: 9.5,
                            skill: "System Design",
                            strengths: ["Atomic Lua scripting in Redis", "Hierarchical local caching at Envoy gateway", "Sliding window mathematical precision"],
                            improvements: ["Discuss clock drift handling across distributed Redis clusters"],
                            modelAnswer: "An optimal Google-level design uses a hierarchical multi-tier rate limiter. Tier 1 uses local token buckets at Envoy proxy with 50ms sync intervals. Tier 2 uses Redis Cluster with sliding window log and consistent hashing partitioned by user/IP keys.",
                            timeSpentSeconds: 95,
                        },
                        {
                            question: "Explain the internal mechanics of the React Reconciliation (Fiber) architecture and how it avoids blocking the main thread.",
                            answer: "React Fiber completely re-architected the stack reconciler into an incremental, interruptible work loop. A Fiber node is a JavaScript object representing a unit of work. React divides rendering into a render/reconciliation phase (asynchronous, interruptible via requestIdleCallback/MessageChannel) and a commit phase (synchronous DOM mutations), preventing UI jank on complex trees.",
                            score: 9.0,
                            skill: "React",
                            strengths: ["Clear distinction between render and commit phases", "Fiber linked-list traversal mechanism", "Time-slicing and priority scheduling"],
                            improvements: ["Mention Concurrent Features like useTransition and useDeferredValue"],
                            modelAnswer: "React Fiber structures the component tree as a singly-linked list of Fiber nodes. Work is prioritized using lane priority. React schedules work in chunks, yielding control to the browser's event loop to handle user input before continuing remaining subtrees.",
                            timeSpentSeconds: 80,
                        },
                        {
                            question: "How would you diagnose and optimize slow MongoDB queries under high concurrency?",
                            answer: "First, inspect the MongoDB profiler and use explain('executionStats') to identify IXSCAN vs COLLSCAN. Ensure all compound queries have matching compound indexes adhering to Equality, Sort, Range (ESR) rule. Check index memory size in WiredTiger cache and evaluate read preference secondaryPreferred for read-heavy reporting.",
                            score: 9.0,
                            skill: "MongoDB",
                            strengths: ["ESR rule adherence", "WiredTiger cache memory profiling", "Read preference replica scaling"],
                            improvements: ["Mention connection pool sizing and collation indexes"],
                            modelAnswer: "Diagnose using db.currentOp() and system.profile. Optimize by creating covering compound indexes (ESR rule), setting projection filters, and leveraging aggregation pipeline stages with $match preceding $sort.",
                            timeSpentSeconds: 70,
                        },
                    ],
                },
            ],
        },
        {
            name: "Priya Sharma",
            email: "priya.sharma@gmail.com",
            role: "candidate",
            headline: "Distributed Systems & Cloud Backend Engineer",
            bio: "Specialist in Go, Apache Kafka, PostgreSQL sharding, and Kubernetes microservices.",
            skills: ["Go", "Python", "Kafka", "PostgreSQL", "Kubernetes", "AWS", "gRPC"],
            interviews: [
                {
                    company: "Stripe",
                    difficulty: "Senior",
                    track: "Distributed Scalability & Financial Reliability",
                    durationMinutes: 15,
                    answers: [
                        {
                            question: "How do you achieve exactly-once message processing semantics in an event-driven payment architecture?",
                            answer: "Exactly-once is achieved using idempotent consumer patterns paired with the Transactional Outbox Pattern and PostgreSQL unique transaction deduplication keys. We generate an Idempotency-Key per payment attempt and store processed event IDs inside an ACID transaction.",
                            score: 9.2,
                            skill: "Kafka",
                            strengths: ["Transactional outbox pattern", "Idempotency key state machine", "Deduplication table in PostgreSQL"],
                            improvements: ["Address Kafka transaction coordinator 2PC protocol details"],
                            modelAnswer: "Combine Kafka producer idempotence (enable.idempotence=true) with consumer-side idempotency tables using PostgreSQL unique constraints and distributed saga transactions.",
                            timeSpentSeconds: 65,
                        },
                        {
                            question: "Explain database connection pooling and how to avoid connection exhaustion in PostgreSQL under peak traffic.",
                            answer: "PostgreSQL forks a process per connection, which consumes memory and creates lock contention. We place PgBouncer in transaction pooling mode in front of Postgres to multiplex thousands of client connections onto a small fixed pool of backend connections.",
                            score: 8.8,
                            skill: "PostgreSQL",
                            strengths: ["Understanding of process-based connection architecture", "PgBouncer transaction pooling"],
                            improvements: ["Discuss max_connections and shared_buffers tuning"],
                            modelAnswer: "Deploy PgBouncer in transaction mode, set appropriate pool reserves, and monitor server-side wait events using pg_stat_activity.",
                            timeSpentSeconds: 60,
                        },
                    ],
                },
            ],
        },
        {
            name: "Alex Rivera",
            email: "alex.rivera@gmail.com",
            role: "candidate",
            headline: "Frontend Tech Lead • React, Next.js & Performance",
            bio: "Passionate UI/UX engineer with deep expertise in Core Web Vitals, SSR, WebGL, and micro-frontends.",
            skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "GraphQL", "Web Performance"],
            interviews: [
                {
                    company: "Meta",
                    difficulty: "Mid-Level",
                    track: "Frontend Architecture & UI Performance",
                    durationMinutes: 10,
                    answers: [
                        {
                            question: "How would you optimize Core Web Vitals (LCP, INP, CLS) for an e-commerce feed?",
                            answer: "For LCP: Preload hero images with fetchpriority='high', use modern AVIF formats, and inline critical CSS. For INP: Break long tasks (>50ms) using scheduler.yield() or requestIdleCallback. For CLS: Reserve explicit width/height dimensions on media and use CSS aspect-ratio.",
                            score: 9.0,
                            skill: "Web Performance",
                            strengths: ["Specific modern browser APIs (fetchpriority, scheduler.yield)", "CLS containment strategies"],
                            improvements: ["Discuss hydration bottlenecks in SSR frameworks"],
                            modelAnswer: "Optimize LCP by prioritizing server-rendered critical assets. Minimize INP via web workers and debounced interactions. Eliminate CLS by reserving slot bounding boxes.",
                            timeSpentSeconds: 55,
                        },
                    ],
                },
            ],
        },
        {
            name: "Rohit Verma",
            email: "rohit.verma@gmail.com",
            role: "candidate",
            headline: "Competitive Programmer & Algorithms Engineer",
            bio: "Candidate with strong DSA background in Dynamic Programming, Graph Theory, and C++ optimization.",
            skills: ["C++", "DSA", "Dynamic Programming", "Graph Theory", "Python", "SQL"],
            interviews: [
                {
                    company: "High-Growth Startups",
                    difficulty: "Mid-Level",
                    track: "Data Structures & Algorithms",
                    durationMinutes: 10,
                    answers: [
                        {
                            question: "Explain the Dijkstra shortest path algorithm and how to implement it with O(E log V) complexity.",
                            answer: "Dijkstra finds the shortest path in a weighted graph with non-negative edges. We use a min-priority queue (binary heap) to track the minimum distance vertex. Each edge relaxation updates the heap, leading to O((V + E) log V) time complexity.",
                            score: 8.5,
                            skill: "DSA",
                            strengths: ["Accurate Big-O analysis", "Binary heap priority queue implementation"],
                            improvements: ["Explain why negative weights cause infinite loops or incorrect results"],
                            modelAnswer: "Dijkstra is a greedy algorithm utilizing a min-heap. For each extracted vertex u, relax all adjacent edges (u, v). If dist[u] + weight(u,v) < dist[v], update distance and push to heap.",
                            timeSpentSeconds: 50,
                        },
                    ],
                },
            ],
        },
    ];

    // 2. Define Recruiters
    const recruiterData = [
        {
            name: "Sarah Jenkins",
            email: "sarah.google@google.com",
            role: "recruiter",
            companyName: "Google",
            headline: "Staff Technical Recruiter at Google (Cloud & Systems)",
            bio: "Hiring L4-L7 software engineers, distributed systems architects, and infrastructure leads for Google Core Systems.",
        },
        {
            name: "David Vance",
            email: "david.stripe@stripe.com",
            role: "recruiter",
            companyName: "Stripe",
            headline: "Lead Technical Talent Partner at Stripe",
            bio: "Building Stripe's next-generation payments infrastructure team.",
        },
        {
            name: "Rachel Green",
            email: "rachel.meta@meta.com",
            role: "recruiter",
            companyName: "Meta",
            headline: "Senior Engineering Recruiting Partner at Meta",
            bio: "Focusing on Meta Ads infrastructure, React core, and AI platform engineering.",
        },
    ];

    // Upsert Candidates
    const candidateUserMap = new Map();
    for (const c of candidateData) {
        let user = await User.findOne({ email: c.email });
        if (!user) {
            user = await User.create({
                name: c.name,
                email: c.email,
                password: hashedPassword,
                role: c.role,
                headline: c.headline,
                bio: c.bio,
            });
        } else {
            user.headline = c.headline;
            user.bio = c.bio;
            user.role = "candidate";
            await user.save();
        }
        candidateUserMap.set(c.email, user);
        console.log(`✓ Candidate: ${user.name} (${user.email})`);

        // Upsert Resume
        await Resume.findOneAndUpdate(
            { userId: user._id },
            {
                originalName: `${c.name.replace(" ", "_")}_Resume.pdf`,
                resumeText: `${c.name} - ${c.headline}. Proven expertise in ${c.skills.join(", ")}.`,
                skills: c.skills,
                uploadedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        // Seed Interview Sessions
        for (const itv of c.interviews) {
            const existingSession = await InterviewSession.findOne({ userId: user._id, company: itv.company });
            if (!existingSession) {
                await InterviewSession.create({
                    userId: user._id,
                    difficulty: itv.difficulty,
                    company: itv.company,
                    track: itv.track,
                    durationMinutes: itv.durationMinutes,
                    answers: itv.answers,
                    createdAt: new Date(Date.now() - Math.random() * 86400000 * 3),
                    endedAt: new Date(),
                });
            }
        }
    }

    // Upsert Recruiters
    const recruiterUserMap = new Map();
    for (const r of recruiterData) {
        let user = await User.findOne({ email: r.email });
        if (!user) {
            user = await User.create({
                name: r.name,
                email: r.email,
                password: hashedPassword,
                role: r.role,
                companyName: r.companyName,
                headline: r.headline,
                bio: r.bio,
            });
        } else {
            user.companyName = r.companyName;
            user.headline = r.headline;
            user.bio = r.bio;
            user.role = "recruiter";
            await user.save();
        }
        recruiterUserMap.set(r.email, user);
        console.log(`✓ Recruiter: ${user.name} (${r.companyName}) -> ${user.email}`);
    }

    // Seed Shortlists & Notifications
    const sarahGoogle = recruiterUserMap.get("sarah.google@google.com");
    const shubhamCand = candidateUserMap.get("shubham.architect@gmail.com");
    const priyaCand = candidateUserMap.get("priya.sharma@gmail.com");
    const alexCand = candidateUserMap.get("alex.rivera@gmail.com");

    if (sarahGoogle && shubhamCand) {
        await Shortlist.findOneAndUpdate(
            { recruiterId: sarahGoogle._id, candidateId: shubhamCand._id },
            {
                status: "Interviewing",
                notes: "Exceptional distributed rate limiter and React Fiber depth. Inviting for Onsite Round 2 with Principal Architect!",
            },
            { upsert: true }
        );

        await Notification.create({
            recipientId: shubhamCand._id,
            senderId: sarahGoogle._id,
            senderName: sarahGoogle.name,
            companyName: sarahGoogle.companyName,
            type: "INTERVIEW_INVITE",
            title: "🎉 Google Interview Invitation (Senior Architect Round)",
            message: 'Sarah Jenkins from Google reviewed your verified mock interview score (92% Placement Readiness). Recruiter Note: "Exceptional distributed rate limiter depth. Scheduling Round 2!"',
            status: "Interviewing",
            isRead: false,
        });
    }

    if (sarahGoogle && priyaCand) {
        await Shortlist.findOneAndUpdate(
            { recruiterId: sarahGoogle._id, candidateId: priyaCand._id },
            {
                status: "Shortlisted",
                notes: "Strong Kafka idempotence and PostgreSQL connection pooling fundamentals.",
            },
            { upsert: true }
        );

        await Notification.create({
            recipientId: priyaCand._id,
            senderId: sarahGoogle._id,
            senderName: sarahGoogle.name,
            companyName: sarahGoogle.companyName,
            type: "SHORTLISTED",
            title: "★ Shortlisted by Google",
            message: "Sarah Jenkins from Google has shortlisted your profile for the Cloud & Distributed Systems team.",
            status: "Shortlisted",
            isRead: false,
        });
    }

    console.log("\n==========================================================");
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY WITH PRODUCTION DATA!");
    console.log("==========================================================");
    process.exit(0);
}

seedDatabase().catch((err) => {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
});
