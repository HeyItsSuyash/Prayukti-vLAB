const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const email = "admin@mmmut.ac.in";
        const password = "admin123";
        const fullName = "System Administrator";

        let user = await User.findOne({ email });

        if (user) {
            console.log("Admin user already exists. Updating password and role...");
            user.password = await bcrypt.hash(password, 10);
            user.role = "admin";
            user.isVerified = true;
            await user.save();
            console.log("Admin user updated.");
        } else {
            console.log("Creating admin user...");
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({
                fullName,
                email,
                password: hashedPassword,
                role: "admin",
                isVerified: true
            });
            await user.save();
            console.log("Admin user created.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
};

createAdmin();
