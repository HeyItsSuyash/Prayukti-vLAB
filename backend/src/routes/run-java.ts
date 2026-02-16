import express from "express";
import axios from "axios";

const router = express.Router();

// Judge0 API URL
const JUDGE0_URL = "https://judge0.prayukti.org/submissions?base64_encoded=false&wait=true";

// Your Judge0 Auth Token
const API_TOKEN = "f6583e60-b13b-4228-b554-2eb332ca64e7";

router.post("/run-java", async (req, res) => {

    try {

        const { code } = req.body;

        if (!code) {
            return res.json({
                output: "No code provided"
            });
        }

        const response = await axios.post(
            JUDGE0_URL,
            {
                source_code: code,
                language_id: 62, // Java
                stdin: ""
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Auth-Token": API_TOKEN
                }
            }
        );

        const result = response.data;

        res.json({
            output:
                result.stdout ||
                result.stderr ||
                result.compile_output ||
                "Program executed successfully"
        });

    } catch (error: any) {

        console.error("Judge0 Error:", error.message);

        res.json({
            output: "Judge0 API connection failed"
        });

    }

});

export default router;
