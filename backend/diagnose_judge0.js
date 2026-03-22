const axios = require('axios');

async function checkJudge0() {
    try {
        console.log("Checking Judge0 status...");
        const response = await axios.post(
            'https://ce.judge0.com/submissions/?base64_encoded=false&wait=true',
            {
                source_code: 'print("Hello")',
                language_id: 71,
            },
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
    }
}

checkJudge0();
