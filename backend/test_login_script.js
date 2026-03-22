const mongoose = require('mongoose');
const User = require('./models/User');
const AttendanceLog = require('./models/AttendanceLog');
const axios = require('axios');
const bcrypt = require('bcryptjs');

async function run() {
    require('dotenv').config();
    await mongoose.connect(process.env.MONGO_URI);
    
    const email = 'test_agent@mmmut.ac.in';
    const password = 'Password123!';
    
    // Create or update user
    let user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (!user) {
        user = new User({
            fullName: 'Test Agent',
            rollNo: 'TEST1234',
            email,
            password: hashedPassword,
            isVerified: true
        });
        await user.save();
    }
    
    console.log("User prepared. Doing login request...");
    try {
        const res = await axios.post('http://localhost:5001/api/auth/login', {
            email, password
        });
        console.log("Login HTTP Response Code:", res.status);
    } catch(err) {
        console.error("Login Error:", err.response?.data || err.message);
    }
    
    // Check Mongo db logs
    console.log("Checking MongoDB Atlas AttendanceLog recent entry...");
    const latestLog = await AttendanceLog.findOne({ student_id: user._id }).sort({ _id: -1 });
    console.log(latestLog);
    
    process.exit(0);
}
run();
