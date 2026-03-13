const axios = require('axios');

async function checkOrphans() {
    try {
        console.log("--- SUBJECTS ---");
        const subjectsRes = await axios.get('http://localhost:5000/api/subjects');
        const subjects = subjectsRes.data;
        subjects.forEach(s => console.log(`[${s._id}] ${s.title} (Slug: ${s.slug})`));

        console.log("\n--- EXPERIMENTS ---");
        // Experiment fetching by subject will fail if ID is wrong, so we need a way to get ALL experiments
        // Let's assume there is no "get all experiments" endpoint yet, so I'll create a temporary script 
        // that talks to the DB directly if I could, but I only have API.
        // Wait, did I implement a GET /api/experiments? Let's check experimentRoutes.js.
    } catch (err) {
        console.error(err.message);
    }
}

checkOrphans();
