const mongoose = require('mongoose');
const User = require('./models/User');
const AttendanceLog = require('./models/AttendanceLog');
require('dotenv').config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const students = await User.find({ role: 'student' });
        console.log(`Found ${students.length} students`);
        students.forEach(s => console.log(`- ${s.fullName} (${s.email}), role: ${s.role}, id: ${s._id}`));

        const logs = await AttendanceLog.find();
        console.log(`Found ${logs.length} attendance logs`);
        logs.forEach(l => console.log(`- Student ID: ${l.student_id}, Date: ${l.login_date}`));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

debug();
