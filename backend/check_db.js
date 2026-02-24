const axios = require('axios');

async function checkDatabase() {
    try {
        console.log("Fetching current subjects from database...");
        const response = await axios.get('http://localhost:5000/api/subjects');
        console.log("Total Subjects Found:", response.data.length);
        console.log("Subject Titles:", response.data.map(s => s.title));
    } catch (err) {
        console.error("Error checking database:", err.message);
    }
}

checkDatabase();
