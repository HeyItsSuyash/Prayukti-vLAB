const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function checkPassword() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'test.student@mmmut.ac.in';
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("User not found");
            return;
        }

        const matchTest = await bcrypt.compare('test123', user.password);
        const matchPassword = await bcrypt.compare('password123', user.password);
        const matchTest123 = await bcrypt.compare('test123', user.password); // redundant but okay

        console.log(`User: ${email}`);
        console.log(`Matches 'test123': ${matchTest}`);
        console.log(`Matches 'password123': ${matchPassword}`);

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkPassword();
