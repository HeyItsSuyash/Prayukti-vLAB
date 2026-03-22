const axios = require('axios');
const API_BASE = 'http://localhost:5001';

async function testAttendance() {
    try {
        console.log('--- LOGIN ATTEMPT ---');
        const loginRes = await axios.post(`${API_BASE}/api/auth/login`, {
            email: 'test.student@mmmut.ac.in',
            password: 'test123'
        });
        
        const token = loginRes.data.token;
        console.log('Login successful, token received.');

        // Wait a bit to simulate session duration
        console.log('Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('--- LOGOUT ATTEMPT ---');
        const logoutRes = await axios.post(`${API_BASE}/api/attendance/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Logout response:', logoutRes.data);

        // Verification check
        const mongoose = require('mongoose');
        const AttendanceLog = require('./models/AttendanceLog');
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }
        const updatedLog = await AttendanceLog.findOne({ student_email: 'test.student@mmmut.ac.in' }).sort({ login_time: -1 });
        console.log('\nVERIFICATION AFTER LOGOUT:');
        console.log(`  id: ${updatedLog._id}`);
        console.log(`  logout_time: ${updatedLog.logout_time}`);
        console.log(`  session_duration: ${updatedLog.session_duration}`);
        
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err.response?.data || err.message);
        process.exit(1);
    }
}

testAttendance();
