const fetch = require('node-fetch'); // Needs to be installed or use native fetch in latest node

async function testCreate() {
    try {
        console.log("Testing Exam Creation...");
        // Assuming we need a token, we can mock or use a known one if available.
        // For now, let's just see if the route is reachable without auth or what error it gives
        const res = await fetch("http://localhost:5000/api/exams/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subjectId: "Test",
                experimentId: "TestExp",
                durationMinutes: 30,
                startTime: new Date().toISOString(),
                assignedStudents: []
            })
        });

        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response:", text);
    } catch (e) {
        console.error(e);
    }
}

testCreate();
