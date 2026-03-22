const mongoose = require('mongoose');
const Experiment = require('./models/Experiment');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vlab";

async function check() {
    await mongoose.connect(MONGO_URI);
    const exp = await Experiment.findOne({ title: "Reverse an Array" });
    console.log("Experiment Testcases:", JSON.stringify(exp.testcases, null, 2));
    await mongoose.disconnect();
}

check();
