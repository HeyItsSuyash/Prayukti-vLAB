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
const chatRoutes = require('./routes/chat');
const http = require('http');
const { Server } = require('socket.io');
const setupSocketHandlers = require('./utils/socketHandlers');

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
        } catch (seedErr) {
            console.error("Test user auto-seed failed:", seedErr);
        }

        const app = express();
        const server = http.createServer(app);

        // Setup Socket.io
        const io = new Server(server, {
            cors: {
                origin: (origin, callback) => callback(null, true),
                credentials: true,
                methods: ["GET", "POST"]
            }
        });

        // Pass io to handlers
        setupSocketHandlers(io);

        // Middleware
        // Improved CORS to handle credentials with dynamic origin
        app.use(cors({
            origin: (origin, callback) => callback(null, true),
            credentials: true
        }));
        app.use(express.json());

        // Routes
        app.use("/api/auth", authRoutes);
        app.use("/api/chat", chatRoutes);

        // Health check
        app.get("/", (req, res) => {
            res.json({ message: "Prayukti-vLAB Authentication API is running" });
        });

        const PORT = process.env.PORT || 5000;

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
