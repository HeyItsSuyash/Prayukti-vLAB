const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const AttendanceLog = require('./models/AttendanceLog');

async function fixSubjectIds() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        console.log("\nUpdating 'GENERAL_LOGIN' -> 'BCS-000'...");
        const res = await AttendanceLog.updateMany(
            { subject_id: "GENERAL_LOGIN" },
            { $set: { subject_id: "BCS-000" } }
        );
        console.log(`- Updated ${res.modifiedCount} records.`);

        await mongoose.disconnect();
        console.log("\nUpdate Complete.");
    } catch (err) {
        console.error("Update failed:", err);
        process.exit(1);
    }
}

fixSubjectIds();
