const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vlab';

async function checkDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const testUser = await User.findOne({ email: 'test.student@mmmut.ac.in' });
        if (testUser) {
            console.log('Test User Found:', {
                email: testUser.email,
                isVerified: testUser.isVerified,
                role: testUser.role
            });
        } else {
            console.log('Test User NOT found in database');
        }

    } catch (err) {
        console.error('DB Connection or Query Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkDB();
