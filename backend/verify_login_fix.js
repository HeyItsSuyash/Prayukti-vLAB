const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const AttendanceLog = require('./models/AttendanceLog');

async function testFix() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        console.log("\nSimulating onLogin without subject_id...");
        const log = new AttendanceLog({
            student_id: new mongoose.Types.ObjectId(), // Fake student ID
            student_email: "test.student@mmmut.ac.in",
            login_time: new Date(),
            ip_address: "127.0.0.1",
            date: new Date().toISOString().split('T')[0]
        });

        const savedLog = await log.save();
        console.log("✅ Successfully saved AttendanceLog without explicit subject_id:");
        console.log("- subject_id (default):", savedLog.subject_id);
        console.log("- id:", savedLog._id);

        // Cleanup
        await AttendanceLog.deleteOne({ _id: savedLog._id });
        console.log("\nCleanup: Test log deleted.");

        await mongoose.disconnect();
        console.log("\nFix Verified.");
    } catch (err) {
        console.error("❌ Fix verification failed:", err.message);
        process.exit(1);
    }
}

testFix();
