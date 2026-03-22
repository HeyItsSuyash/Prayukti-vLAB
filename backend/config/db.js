const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS to bypass local network/ISP DNS issues causing querySrv ECONNREFUSED
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (error) {
    console.warn("Failed to set DNS servers:", error.message);
}
const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB with timeout settings...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,
            family: 4 // Force IPv4 to prevent querySrv ECONNREFUSED issues on Windows
        });

        console.log("MongoDB Connected");
    } catch (err) {
        console.error("CRITICAL: MongoDB Connection Failed!");
        console.error("Error Details:", err.message);
        console.log("Tip: Check your internet connection or if your IP is whitelisted in Atlas.");
        // process.exit(1);
    }
};

module.exports = connectDB;
