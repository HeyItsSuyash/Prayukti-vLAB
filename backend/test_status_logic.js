const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const AttendanceLog = require('./models/AttendanceLog');
const attendanceMiddleware = require('./middleware/attendanceMiddleware');

async function testLogic() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const student_id = new mongoose.Types.ObjectId();
        const student_email = "test@example.com";

        // 1. Test Login (should be in_progress)
        console.log("\nTesting Login Status...");
        const req = { ip: "127.0.0.1", headers: {} };
        const res = { locals: { userId: student_id, userEmail: student_email } };
        
        await attendanceMiddleware.onLogin(req, res, () => {});
        const logId = res.locals.attendance_log_id;
        let log = await AttendanceLog.findById(logId);
        console.log("Login Status:", log.status); // Should be in_progress

        // 2. Test Logout (Short Duration -> absent)
        console.log("\nTesting Logout Status (Short Duration)...");
        // Manually set login_time to 1 minute ago to simulate short duration
        log.login_time = new Date(Date.now() - 60000); 
        await log.save();

        const logoutReq = { user: { id: student_id.toString(), attendance_log_id: logId.toString() } };
        const logoutRes = { json: (data) => console.log("Logout Response:", data) };
        
        await attendanceMiddleware.onLogout(logoutReq, logoutRes);
        log = await AttendanceLog.findById(logId);
        console.log("Status after short logout:", log.status); // Should be absent

        // 3. Test Logout (Long Duration, Low Activity -> inactive)
        console.log("\nTesting Logout Status (Long Duration, Low Activity)...");
        const log2 = new AttendanceLog({
            student_id,
            student_email,
            login_time: new Date(Date.now() - 300000), // 5 mins ago
            activity_score: 10,
            status: "in_progress"
        });
        await log2.save();
        
        const logoutReq2 = { user: { id: student_id.toString(), attendance_log_id: log2._id.toString() } };
        await attendanceMiddleware.onLogout(logoutReq2, logoutRes);
        const finalLog2 = await AttendanceLog.findById(log2._id);
        console.log("Status after long/low-activity logout:", finalLog2.status); // Should be inactive

        // 4. Test Logout (Long Duration, High Activity -> present)
        console.log("\nTesting Logout Status (Long Duration, High Activity)...");
        const log3 = new AttendanceLog({
            student_id,
            student_email,
            login_time: new Date(Date.now() - 300000), // 5 mins ago
            activity_score: 50,
            status: "in_progress"
        });
        await log3.save();
        
        const logoutReq3 = { user: { id: student_id.toString(), attendance_log_id: log3._id.toString() } };
        await attendanceMiddleware.onLogout(logoutReq3, logoutRes);
        const finalLog3 = await AttendanceLog.findById(log3._id);
        console.log("Status after long/high-activity logout:", finalLog3.status); // Should be present

        // Cleanup
        await AttendanceLog.deleteMany({ student_id });
        console.log("\nCleanup: Test logs deleted.");

        await mongoose.disconnect();
        console.log("\nLogic Verification Complete.");
    } catch (err) {
        console.error("Verification failed:", err);
        process.exit(1);
    }
}

testLogic();
