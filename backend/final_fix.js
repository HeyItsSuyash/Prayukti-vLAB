const axios = require('axios');

async function fixEverything() {
    try {
        console.log("🚀 STARTING FINAL MASTER SYNC...");

        // 1. Seed Subjects
        console.log("Seeding Subjects...");
        await axios.post('http://localhost:5000/api/subjects/seed');

        // 2. Get the new Subject IDs
        const subRes = await axios.get('http://localhost:5000/api/subjects');
        const subjects = subRes.data;
        console.log(`Found ${subjects.length} subjects.`);

        // 3. Seed Experiments using the new IDs
        console.log("Seeding Experiments...");
        const expRes = await axios.post('http://localhost:5000/api/experiments/seed');
        console.log(`Seeded ${expRes.data.count} experiments.`);

        console.log("\n✨ SYNC COMPLETE. Everything is now linked to the latest IDs.");
    } catch (err) {
        console.error("FAILED:", err.message);
    }
}

fixEverything();
