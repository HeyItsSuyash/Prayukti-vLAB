const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const AttendanceLog = require('./models/AttendanceLog');

async function verifyLogLab() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        // Simulate the logic in the new route
        const student_id = new mongoose.Types.ObjectId();
        const subject = "CN";
        const labId = "cn-exp-1";

        const subjectMap = {
            'DSA': 'BCS-301',
            'CN': 'BCS-502',
            'DLD': 'BCS-303',
            'DBMS': 'BCS-404',
            'OOPS': 'BCS-405',
            'MPMC': 'BCS-506',
            'C': 'BCS-107',
            'DAA': 'BCS-408'
        };

        const subject_id = subjectMap[subject] || 'BCS-000';
        console.log(`Mapping ${subject} -> ${subject_id}`);

        if (subject_id !== 'BCS-502') {
            throw new Error(`Mapping failed: expected BCS-502, got ${subject_id}`);
        }

        const log = new AttendanceLog({
            student_id,
            subject_id,
            lab_id: labId,
            login_time: new Date(),
            date: new Date().toISOString().split('T')[0],
            status: "in_progress"
        });

        await log.save();
        console.log("Successfully saved lab log with subject_id:", log.subject_id);

        await AttendanceLog.deleteOne({ _id: log._id });
        console.log("Cleanup: Test log deleted.");

        await mongoose.disconnect();
        console.log("\nVerification Complete.");
    } catch (err) {
        console.error("Verification failed:", err);
        process.exit(1);
    }
}

verifyLogLab();
