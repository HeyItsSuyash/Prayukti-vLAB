const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function fixTestAccounts() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Fix test student password
    const studentHash = await bcrypt.hash('test123', 10);
    const student = await User.findOneAndUpdate(
        { email: 'test.student@mmmut.ac.in' },
        {
            fullName: 'Test Student',
            password: studentHash,
            isVerified: true,
            role: 'student',
            rollNo: '2022021001'
        },
        { upsert: true, new: true }
    );
    console.log('✅ Test student fixed:', student.email, '| role:', student.role, '| verified:', student.isVerified);

    // Create teacher account
    const teacherHash = await bcrypt.hash('teacher123', 10);
    const teacher = await User.findOneAndUpdate(
        { email: 'teacher@mmmut.ac.in' },
        {
            fullName: 'Test Teacher',
            password: teacherHash,
            role: 'teacher',
            isVerified: true
        },
        { upsert: true, new: true }
    );
    console.log('✅ Teacher account fixed:', teacher.email, '| role:', teacher.role, '| verified:', teacher.isVerified);

    // Show all users
    const allUsers = await User.find({}, 'fullName email role isVerified rollNo');
    console.log('\n📋 All users in DB:');
    allUsers.forEach(u => console.log(`  [${u.role}] ${u.email} | name: ${u.fullName} | verified: ${u.isVerified}`));

    await mongoose.disconnect();
    console.log('\nDone. Both accounts ready.');
}

fixTestAccounts().catch(err => {
    console.error('Script failed:', err.message);
    process.exit(1);
});
