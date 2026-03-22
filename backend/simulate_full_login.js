const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const User = require('./models/User');
const AttendanceLog = require('./models/AttendanceLog');
const attendanceMiddleware = require('./middleware/attendanceMiddleware');

async function simulateLogin() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const email = 'test.student@mmmut.ac.in';
        const user = await User.findOne({ email });
        
        if (!user) {
            console.error("Test user not found in DB!");
            process.exit(1);
        }

        console.log(`\nSimulating login for ${email}...`);
        
        // Mocking req, res, next
        const req = {
            ip: "127.0.0.1",
            headers: {}
        };
        const res = {
            locals: {
                userId: user._id,
                userEmail: user.email,
                userFullName: user.fullName,
                userRollNo: user.rollNo
            }
        };
        const next = async () => {
            console.log("Next middleware called!");
            console.log("Attendance Log ID set:", res.locals.attendance_log_id);
            
            // Check if log exists
            if (res.locals.attendance_log_id) {
                const log = await AttendanceLog.findById(res.locals.attendance_log_id);
                console.log("Saved Log:", JSON.stringify(log, null, 2));
            } else {
                console.error("❌ Attendance log was NOT created!");
            }
        };

        await attendanceMiddleware.onLogin(req, res, next);

        await mongoose.disconnect();
        console.log("\nSimulation Complete.");
    } catch (err) {
        console.error("Simulation failed:", err);
        process.exit(1);
    }
}

simulateLogin();
