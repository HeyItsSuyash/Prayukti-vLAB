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
        
        // Inspect token (base64)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        console.log('Token Payload:', JSON.stringify(payload, null, 2));
        
        if (!payload.attendance_log_id) {
            console.error('CRITICAL: attendance_log_id MISSING from token!');
        }

        console.log('Waiting 1 second...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('--- LOGOUT ATTEMPT ---');
        const logoutRes = await axios.post(`${API_BASE}/api/attendance/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Logout response:', JSON.stringify(logoutRes.data, null, 2));
    } catch (err) {
        console.error('Test failed:', err.response?.data || err.message);
    }
}

testAttendance();
