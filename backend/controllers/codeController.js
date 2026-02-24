const axios = require('axios');

/**
 * Code Execution Controller
 * 
 * Handles logic for running user code using the official Judge0 free API.
 */

// Language mapping to Judge0 IDs
const languageMap = {
    'python': 71,   // Python (3.8.1)
    'cpp': 54,      // C++ (GCC 9.2.0)
    'c': 50,        // C (GCC 9.2.0)
    'java': 62,     // Java (OpenJDK 13.0.1)
    'javascript': 63 // JavaScript (Node.js 12.14.0)
};

exports.runCode = async (req, res) => {
    try {
        const { code, language, input } = req.body;

        // 1. Validation
        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }
        if (!language) {
            return res.status(400).json({ error: "Language is required" });
        }

        const languageId = languageMap[language.toLowerCase()];
        if (!languageId) {
            return res.status(400).json({ error: `Language '${language}' is not supported.` });
        }

        console.log(`[JUDGE0] Running ${language} (ID: ${languageId})`);

        // 2. Request to Judge0 official free API
        // base64_encoded=false means we send raw text
        // wait=true means we wait for the result synchronously
        const response = await axios.post(
            'https://ce.judge0.com/submissions/?base64_encoded=false&wait=true',
            {
                source_code: code,
                language_id: languageId,
                stdin: input || ""
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const result = response.data;

        // Extracting fields as requested by the user
        const responseData = {
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            status: result.status,
            time: result.time,
            memory: result.memory
        };

        res.status(200).json(responseData);

    } catch (err) {
        console.error("[JUDGE0 ERROR]:", err.response?.data || err.message);
        res.status(500).json({
            error: "Judge0 execution failed",
            details: err.response?.data || err.message
        });
    }
};
