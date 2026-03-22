const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const AttendanceLog = require('./models/AttendanceLog');

async function verifySubjectName() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const student_id = new mongoose.Types.ObjectId();
        
        // 1. Initial Login
        console.log("\nSimulating Initial Login...");
        const log = new AttendanceLog({
            student_id,
            login_time: new Date(),
            date: new Date().toISOString().split('T')[0],
            subject_id: "BCS-000",
            subject_name: "None"
        });
        await log.save();
        console.log("Initial Log created. Subject:", log.subject_name);

        // 2. Simulate log-lab for CN
        console.log("\nSimulating enter lab: CN...");
        const target1 = { id: 'BCS-502', name: 'Computer Networks' };
        
        let currentIds = log.subject_id === 'BCS-000' ? [] : log.subject_id.split(', ');
        let currentNames = log.subject_name === 'None' ? [] : log.subject_name.split(', ');

        if (!currentIds.includes(target1.id)) {
            currentIds.push(target1.id);
            currentNames.push(target1.name);
        }

        log.subject_id = currentIds.join(', ');
        log.subject_name = currentNames.join(', ');
        await log.save();
        console.log("Log updated (CN). Subject Name:", log.subject_name);

        // 3. Simulate log-lab for DBMS
        console.log("\nSimulating enter lab: DBMS...");
        const target2 = { id: 'BCS-404', name: 'Database Management System' };
        
        currentIds = log.subject_id.split(', ');
        currentNames = log.subject_name.split(', ');

        if (!currentIds.includes(target2.id)) {
            currentIds.push(target2.id);
            currentNames.push(target2.name);
        }

        log.subject_id = currentIds.join(', ');
        log.subject_name = currentNames.join(', ');
        await log.save();
        console.log("Log updated (DBMS). Subject Name:", log.subject_name);

        // Final Check
        if (log.subject_name !== "Computer Networks, Database Management System") {
            throw new Error(`Subject name mismatch: ${log.subject_name}`);
        }
        console.log("✅ Subject name appending verified successfully.");

        await AttendanceLog.deleteOne({ _id: log._id });
        await mongoose.disconnect();
        console.log("\nVerification Complete.");
    } catch (err) {
        console.error("Verification failed:", err);
        process.exit(1);
    }
}

verifySubjectName();
