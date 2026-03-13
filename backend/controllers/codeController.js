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

/**
 * Complexity Analysis Controller
 * Runs code against multiple test inputs to measure growth.
 */
exports.analyzeComplexity = async (req, res) => {
    try {
        const { code, language, inputs, sizes, case_type } = req.body;

        if (!code || !language || (!inputs && !sizes)) {
            return res.status(400).json({ error: "Code, language, and (inputs or sizes) are required" });
        }

        const languageId = languageMap[language.toLowerCase()];
        if (!languageId) {
            return res.status(400).json({ error: `Language '${language}' is not supported.` });
        }

        // Standardize test cases
        let testCases = [];
        if (sizes && Array.isArray(sizes)) {
            testCases = sizes.map(s => ({ size: s, label: `N=${s}` }));
        } else if (inputs && Array.isArray(inputs)) {
            testCases = inputs;
        }

        console.log(`[COMPLEXITY] Analyzing ${language} with ${testCases.length} test cases`);

        const results = [];

                // Execute sequentially to avoid overloading Judge0 free tier or hit rate limits
        for (const testCase of testCases) {
            try {
                // Determine stdin: Use provided input or generate based on case_type
                let finalInput = testCase.input || "";
                let instrumentedCode = code; // Initialize with original code

                if (case_type) {
                    const N = parseInt(testCase.size);
                    const isSnapshotNeeded = N <= 20; // Only capture steps for small sizes to avoid bloat

                    // Set finalInput to ONLY N - move generation to C++ logic
                    finalInput = `${N}`;

                    // 1. Inject case_type into C++ code
                    if (instrumentedCode.includes('case_type =')) {
                        instrumentedCode = instrumentedCode.replace(
                            /string\s+case_type\s*=\s*".*?"\s*;/,
                            `string case_type = "${case_type.toLowerCase()}";`
                        );
                    } else {
                        // Fallback: Inject at the start of main
                        instrumentedCode = instrumentedCode.replace(
                            /int\s+main\s*\(\s*\)\s*\{/,
                            `int main() {\n    string case_type = "${case_type.toLowerCase()}";`
                        );
                    }

                    // 2. Programmatically remove input redundant input reading loops if they exist (Requirement 5)
                    instrumentedCode = instrumentedCode.replace(
                        /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*n\s*;\s*i\s*\+\+\s*\)\s*\{[\s\S]*?cin\s*>>\s*arr\[i\][\s\S]*?\}/g,
                        ""
                    );
                    instrumentedCode = instrumentedCode.replace(
                        /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*n\s*;\s*i\s*\+\+\s*\)\s*cin\s*>>\s*arr\[i\]\s*;/g,
                        ""
                    );

                    // 3. Dynamic code injection for snapshots 
                    // Capture final position (j+1) AND current outer index (i)
                    const snapshotInject = isSnapshotNeeded ? `
                        cout << "__step__ [";
                        for(int k=0; k<n; k++) cout << arr[k] << (k==n-1?"":",");
                        cout << "] " << (j+1) << " " << i << endl;
                    ` : "";

                    const initialSnapshot = isSnapshotNeeded ? `
                        cout << "__step__ [";
                        for(int k=0; k<n; k++) cout << arr[k] << (k==n-1?"":",");
                        cout << "] 0 0" << endl;
                    ` : "";

                    instrumentedCode = instrumentedCode.replace(
                        /void\s+insertionSort\s*\(([^)]+)\)\s*\{/,
                        `void insertionSort($1) {
                            ${initialSnapshot}
                        `
                    );

                    // Inject step recording after the inner while loop
                    instrumentedCode = instrumentedCode.replace(
                        /(arr\[j\s*\+\s*1\]\s*=\s*key;)/,
                        `$1
                        ${snapshotInject}
                        `
                    );
                }

                const response = await axios.post(
                    'https://ce.judge0.com/submissions/?base64_encoded=false&wait=true',
                    {
                        source_code: instrumentedCode, // Use instrumented code
                        language_id: languageId,
                        stdin: finalInput
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const result = response.data;
                const stdout = result.stdout || "";

                // Parse metrics, comparisons, shifts and snapshots
                let comparisons = 0, shifts = 0;
                const steps = [];

                const metricsMatch = stdout.match(/__metrics__ (\d+) (\d+)/);
                if (metricsMatch) {
                    comparisons = parseInt(metricsMatch[1]);
                    shifts = parseInt(metricsMatch[2]);
                }

                const stepLines = stdout.match(/__step__ (.*)/g);
                if (stepLines) {
                    stepLines.forEach(line => {
                        const match = line.match(/__step__ \[(.*)\] (\d+)\s*(\d*)/);
                        if (match) {
                            steps.push({
                                array: match[1].split(',').map(Number),
                                activeIndex: parseInt(match[2]),
                                outerIndex: parseInt(match[3] || match[2]) // Default to activeIndex if missing
                            });
                        }
                    });
                }

                results.push({
                    inputLabel: testCase.label,
                    inputSize: testCase.size,
                    size: parseInt(testCase.size), // Standardized size field
                    time: parseFloat(result.time) || 0,
                    execution_time: parseFloat(result.time) || 0, // Standardized time field
                    memory: result.memory || 0,
                    comparisons,
                    shifts,
                    steps, // Array of snapshots
                    dataset_preview: steps.length > 0 ? steps[0].array : [], // Initial array from step 0
                    case_type: case_type ? case_type.toLowerCase() : "average", // Lowercase mode
                    status: result.status?.description,
                    stdout: stdout.replace(/__metrics__ \d+ \d+/g, "").replace(/__step__ .*/g, "").trim() // Clean up stdout
                });
            } catch (innerErr) {
                console.error(`[COMPLEXITY ERROR] Failed for input ${testCase.label}:`, innerErr.response?.data || innerErr.message);
                results.push({
                    inputLabel: testCase.label,
                    error: "Execution failed",
                    status: "Error"
                });
            }
        }

        // Basic Big O Estimation Logic (Heuristic based on growth)
        // This is a simplified version; in a production app we might use regression
        let complexityLabel = "O(unknown)";
        if (results.length >= 3) {
            const validResults = results.filter(r => r.status === "Accepted");
            if (validResults.length >= 3) {
                const ratios = [];
                for (let i = 1; i < validResults.length; i++) {
                    const dt = validResults[i].time / validResults[i - 1].time;
                    const dn = validResults[i].inputSize / validResults[i - 1].inputSize;
                    ratios.push(Math.log(dt) / Math.log(dn));
                }
                const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

                if (avgRatio < 0.5) complexityLabel = "O(1) or O(log N)";
                else if (avgRatio < 1.3) complexityLabel = "O(N)";
                else if (avgRatio < 1.8) complexityLabel = "O(N log N)";
                else if (avgRatio < 2.5) complexityLabel = "O(N²)";
                else complexityLabel = "O(2^N) or O(N³)";
            }
        }

        // Return plain result array if 'sizes' was used (Phase 4 requirement)
        if (sizes && Array.isArray(sizes)) {
            return res.status(200).json(results);
        }

        // Traditional response for backward compatibility
        res.status(200).json({
            results,
            estimatedComplexity: complexityLabel
        });

    } catch (err) {
        console.error("[COMPLEXITY ERROR]:", err.message);
        res.status(500).json({ error: "Complexity analysis failed", details: err.message });
    }
};
