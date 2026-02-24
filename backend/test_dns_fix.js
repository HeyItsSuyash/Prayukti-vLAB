const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function testConnection() {
    try {
        console.log("Testing connection with process-level DNS override...");
        await mongoose.connect(MONGO_URI);
        console.log("SUCCESS: Connected to MongoDB Atlas!");
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("FAILURE:", err.message);
        process.exit(1);
    }
}

testConnection();
