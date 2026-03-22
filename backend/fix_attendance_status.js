const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const AttendanceLog = require('./models/AttendanceLog');

async function fixStatus() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        // 1. Fix "in_progress" for records with no logout_time
        console.log("\nFixing records with no logout_time -> 'in_progress'...");
        const inProgressRes = await AttendanceLog.updateMany(
            { logout_time: null, status: { $ne: "in_progress" } },
            { $set: { status: "in_progress" } }
        );
        console.log(`- Updated ${inProgressRes.modifiedCount} records to 'in_progress'.`);

        // 2. Fix status for finished sessions based on new logic
        console.log("\nRecalculating status for completed sessions...");
        const finishedLogs = await AttendanceLog.find({ logout_time: { $ne: null } });
        let updatedCount = 0;

        for (const log of finishedLogs) {
            const duration = log.session_duration || 0;
            const activity = log.activity_score || 0;
            let newStatus = "present";

            if (duration < 2) {
                newStatus = "absent";
            } else if (activity < 20) {
                newStatus = "inactive";
            }

            if (log.status !== newStatus) {
                log.status = newStatus;
                await log.save();
                updatedCount++;
            }
        }
        console.log(`- Updated ${updatedCount} completed records.`);

        await mongoose.disconnect();
        console.log("\nBackward Fix Complete.");
    } catch (err) {
        console.error("Fix failed:", err);
        process.exit(1);
    }
}

fixStatus();
