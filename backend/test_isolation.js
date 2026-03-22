const mongoose = require('mongoose');
const AttendanceLog = require('./models/AttendanceLog');
const attendanceMiddleware = require('./middleware/attendanceMiddleware');
require('dotenv').config();

async function runIsolationTest() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected');

        const testEmail = 'isolation.test@mmmut.ac.in';
        const student_id = new mongoose.Types.ObjectId(); // New random ID

        // 1. Create a dummy log
        const log = new AttendanceLog({
            student_id,
            student_email: testEmail,
            login_time: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
            logout_time: null,
            session_duration: 0,
            date: new Date().toISOString().split('T')[0]
        });
        await log.save();
        console.log('Created dummy log:', log._id);

        // 2. Mock req/res for onLogout
        const req = {
            user: { id: student_id.toString() }
        };
        const res = {
            json: (data) => {
                console.log('Middleware response:', data);
            }
        };

        // 3. Run middleware
        console.log('\n--- EXECUTING onLogout ---');
        await attendanceMiddleware.onLogout(req, res);

        // 4. Verify result in DB
        const updatedLog = await AttendanceLog.findById(log._id);
        console.log('\nVERIFICATION:');
        console.log('  logout_time:', updatedLog.logout_time);
        console.log('  session_duration:', updatedLog.session_duration);

        if (updatedLog.logout_time) {
            console.log('\nPASSED: Middleware updated the log correctly in isolation.');
        } else {
            console.log('\nFAILED: Middleware did NOT update the log.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Isolation test CRASHED:', err);
    }
}

runIsolationTest();
