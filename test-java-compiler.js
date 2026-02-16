const axios = require('axios');

const testCode = `
public class Main {
    public static void main(String[] args) {
        System.out.println("Verification Successful: Hello from Java!");
    }
}
`;

async function testCompiler() {
    try {
        console.log("Testing Java Compiler API...");
        const response = await axios.post('http://localhost:5000/api/v1/oopj/run', {
            code: testCode,
            input: ""
        });

        console.log("Response Received:");
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data.success && response.data.output.includes("Verification Successful")) {
            console.log("\n✅ VERIFICATION PASSED: Java execution is working correctly.");
        } else {
            console.log("\n❌ VERIFICATION FAILED: Unexpected response.");
        }
    } catch (error) {
        console.error("\n❌ VERIFICATION FAILED: Could not connect to API.");
        console.error(error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

testCompiler();
