const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const AttendanceLog = require('./models/AttendanceLog');

const API_BASE = 'http://localhost:5001';

async function verifySpecificUser() {
    try {
        console.log('--- STARTING VERIFICATION FOR teacher@mmmut.ac.in ---');
        
        // 1. LOGIN
        const loginRes = await axios.post(`${API_BASE}/api/auth/login`, {
            email: 'teacher@mmmut.ac.in',
            password: 'test123' 
        });
        
        const token = loginRes.data.token;
        const logId = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).attendance_log_id;
        console.log('Login Success. Log ID:', logId);

        // 2. WAIT
        console.log('Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. LOGOUT
        console.log('Logging out...');
        await axios.post(`${API_BASE}/api/attendance/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 4. VERIFY IN DB
        await mongoose.connect(process.env.MONGO_URI);
        const log = await AttendanceLog.findById(logId);
        
        console.log('\n--- DB VERIFICATION RESULT ---');
        console.log('Log ID:', log._id);
        console.log('Logout Time:', log.logout_time);
        console.log('Session Duration:', log.session_duration);
        
        if (log.logout_time && log.session_duration !== null) {
            console.log('\nCONFIRMED: Logic is working for teacher@mmmut.ac.in');
        } else {
            console.log('\nFAILED: Logout time is still null');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Verification failed:', err.response?.data || err.message);
    }
}

verifySpecificUser();
