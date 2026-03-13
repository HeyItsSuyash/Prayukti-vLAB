const axios = require('axios');

async function testComplexity() {
    const API_URL = "http://localhost:5001/api/code/complexity";

    // Test for O(N) complexity
    const pythonCode = `
import sys
n = int(sys.stdin.read().strip())
for i in range(n):
    pass
print("Done")
    `;

    const inputs = [
        { label: "N=1000", size: 1000, input: "1000" },
        { label: "N=10000", size: 10000, input: "10000" },
        { label: "N=100000", size: 100000, input: "100000" }
    ];

    try {
        console.log("Sending complexity analysis request...");
        const response = await axios.post(API_URL, {
            code: pythonCode,
            language: "python",
            inputs: inputs
        });

        console.log("Response Status:", response.status);
        console.log("Estimated Complexity:", response.data.estimatedComplexity);
        console.log("Results:");
        response.data.results.forEach(r => {
            console.log(`- ${r.inputLabel}: ${r.time}s, Status: ${r.status}`);
        });

    } catch (err) {
        console.error("Test failed:", err.response?.data || err.message);
    }
}

testComplexity();
