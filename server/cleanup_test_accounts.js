require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Resume = require("./models/resume.js");
const InterviewSession = require("./models/InterviewSession.js");
const Shortlist = require("./models/shortlist.js");
const Notification = require("./models/notification.js");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/interview_platform";

async function cleanup() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // Find all test accounts created with test patterns
    const testPattern = /(candidate_|social_|notif_|test_cand|google_rec_|temp_|test_)/i;
    const testUsers = await User.find({
        $or: [
            { email: { $regex: testPattern } },
            { name: { $regex: /Test /i } },
        ]
    });

    console.log(`Found ${testUsers.length} test accounts to remove.`);

    for (const u of testUsers) {
        console.log(`- Deleting test user: ${u.name} (${u.email}) [${u._id}]`);
        await Resume.deleteMany({ userId: u._id });
        await InterviewSession.deleteMany({ userId: u._id });
        await Shortlist.deleteMany({ $or: [{ candidateId: u._id }, { recruiterId: u._id }] });
        await Notification.deleteMany({ $or: [{ recipientId: u._id }, { senderId: u._id }] });
        await User.findByIdAndDelete(u._id);
    }

    const remainingUsers = await User.find({}).select("name email role companyName");
    console.log(`\nRemaining Clean Accounts in Database (${remainingUsers.length}):`);
    remainingUsers.forEach(u => console.log(`✓ [${u.role}] ${u.name} (${u.email})${u.companyName ? ` - ${u.companyName}` : ''}`));

    console.log("\nCleanup completed successfully!");
    process.exit(0);
}

cleanup().catch((err) => {
    console.error("Cleanup error:", err);
    process.exit(1);
});
