const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('./models/User');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find a teacher user
    const teacher = await User.findOne({ role: 'teacher' });
    if (!teacher) {
        console.log('ERROR: No teacher found in DB. Create one first.');
        await mongoose.disconnect();
        return;
    }
    console.log('Using teacher:', teacher.email, '| role:', teacher.role);

    // Generate a token for them
    const token = jwt.sign(
        { id: teacher._id, email: teacher.email, role: teacher.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1h' }
    );
    console.log('Token generated. Calling /analytics...\n');

    await mongoose.disconnect();

    // Hit the API
    try {
        const res = await axios.get('http://localhost:5001/api/attendance/analytics?range=daily', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('STATUS:', res.status);
        console.log('RESPONSE DATA:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.log('ERROR STATUS:', err.response?.status);
        console.log('ERROR DATA:', err.response?.data);
    }
}

test().catch(e => { console.error(e.message); process.exit(1); });
