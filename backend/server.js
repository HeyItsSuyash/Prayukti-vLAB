require("dotenv").config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

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

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Prayukti-vLAB Authentication API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
