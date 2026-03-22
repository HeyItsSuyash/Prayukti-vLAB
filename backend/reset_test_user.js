const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vlab';

async function resetUser() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'test.student@mmmut.ac.in';
        const hashedPassword = await bcrypt.hash('password123', 10);

        const user = await User.findOneAndUpdate(
            { email },
            {
                email,
                password: hashedPassword,
                isVerified: true,
                role: 'student',
                fullName: 'Test Student'
            },
            { upsert: true, new: true }
        );

        console.log('Test User Reset/Created Success:', user.email);

    } catch (err) {
        console.error('Error resetting user:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

resetUser();
