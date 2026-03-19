const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '.env') });

// Automatically load and strip BACKEND_ prefix from environment variables
// This allows turborepo deployments (like Render) to pass backend-specific ENV vars
Object.keys(process.env).forEach(key => {
    if (key.startsWith('BACKEND_')) {
        const strippedKey = key.replace(/^BACKEND_/, '');
        process.env[strippedKey] = process.env[key];
        delete process.env[key];
    }
});

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Connect to Database
const startServer = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log(`MONGO_URI is defined: ${!!process.env.MONGO_URI}`);
        if (process.env.MONGO_URI) {
            console.log(`MONGO_URI starts with: ${process.env.MONGO_URI.substring(0, 15)}...`);
        }

        await connectDB();

        // Auto-seed test user for deployments
        try {
            const User = require('./models/User');
            const bcrypt = require('bcryptjs');
            const testEmail = "test.student@mmmut.ac.in";
            let testUser = await User.findOne({ email: testEmail });
            if (!testUser) {
                console.log("Auto-seeding test student for deployment...");
                const hashedPassword = await bcrypt.hash("password123", 10);
                testUser = new User({
                    fullName: "Test Student",
                    email: testEmail,
                    password: hashedPassword,
                    role: "student",
                    isVerified: true
                });
                await testUser.save();
                console.log("Test student seeded.");
            } else if (!testUser.isVerified) {
                testUser.isVerified = true;
                await testUser.save();
            }

            // Seed test faculty
            const facultyEmail = "test.faculty@mmmut.ac.in";
            let testFaculty = await User.findOne({ email: facultyEmail });
            if (!testFaculty) {
                console.log("Auto-seeding test faculty for deployment...");
                const hashedPassword = await bcrypt.hash("password123", 10);
                testFaculty = new User({
                    fullName: "Test Faculty",
                    email: facultyEmail,
                    password: hashedPassword,
                    role: "teacher",
                    isVerified: true
                });
                await testFaculty.save();
                console.log("Test faculty seeded.");
            } else if (!testFaculty.isVerified) {
                testFaculty.isVerified = true;
                await testFaculty.save();
            }
        } catch (seedErr) {
            console.error("Test user auto-seed failed:", seedErr);
        }

        const app = express();

        const authRoutes = require('./routes/auth');
        const userRoutes = require('./routes/userRoutes');
        const examRoutes = require('./routes/examRoutes');

        // Middleware
        // Improved CORS to handle credentials with dynamic origin
        app.use(cors({
            origin: (origin, callback) => {
                // Allowing all origins while maintaining compatibility with credentials: true
                callback(null, true);
            },
            credentials: true
        }));
        app.use(express.json());

        // Routes
        app.use("/api/auth", authRoutes);
        app.use("/api/users", userRoutes);
        app.use("/api/exams", examRoutes);

        // Health check
        app.get("/", (req, res) => {
            res.json({ message: "Prayukti-vLAB Authentication API is running" });
        });

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
