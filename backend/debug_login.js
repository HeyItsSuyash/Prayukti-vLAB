const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vlab";

async function checkUser() {
    try {
        await mongoose.connect(MONGO_URI);
        const email = process.argv[2] || "2023021260@mmmut.ac.in";
        const user = await User.findOne({ email });

        if (user) {
            console.log("USER_FOUND:", JSON.stringify({
                id: user._id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }, null, 2));
        } else {
            console.log("USER_NOT_FOUND:", email);
            const allUsers = await User.find().limit(5);
            console.log("EXISTING_USERS_SAMPLE:", allUsers.map(u => u.email));
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error("DEBUG_ERROR:", err);
    }
}

checkUser();
