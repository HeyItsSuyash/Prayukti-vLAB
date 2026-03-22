const axios = require('axios');

async function initializeDatabase() {
    try {
        console.log("🚀 STARTING DATABASE INITIALIZATION...");

        // 1. Seed Subjects
        console.log("\n- Seeding all subjects...");
        const seedRes = await axios.post('http://localhost:5000/api/subjects/seed');
        console.log("  ✅", seedRes.data.message);

        // 2. Get All Subjects to map IDs
        const subjectsRes = await axios.get('http://localhost:5000/api/subjects');
        const subjects = subjectsRes.data;

        const findId = (title) => subjects.find(s => s.title.includes(title))?._id;

        // 3. Seed Experiments for each subject
        console.log("\n- Seeding experiments...");

        const experimentsToSeed = [
            {
                subjectId: findId("Data Structures"),
                title: "Reverse an Array",
                theory: "An array is a collection of elements. Reversing an array means swapping the first element with the last, the second with the second-to-last, and so on.",
                algorithm: "1. Start\n2. Iterate through half of the array\n3. Swap element i with length-1-i\n4. Stop",
                codeTemplate: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> arr = {1, 2, 3, 4, 5};\n    std::reverse(arr.begin(), arr.end());\n    \n    for(int x : arr) std::cout << x << \" \";\n    return 0;\n}",
                language: "cpp"
            },
            {
                subjectId: findId("C Programming"),
                title: "Sum of Natural Numbers",
                theory: "The sum of first n natural numbers can be calculated using a loop or formula n*(n+1)/2.",
                algorithm: "1. Start\n2. Take input n\n3. Initialize sum = 0\n4. For i from 1 to n, sum += i\n5. Print sum\n6. Stop",
                codeTemplate: "#include <stdio.h>\n\nint main() {\n    int n = 10, sum = 0;\n    for(int i=1; i<=n; i++) {\n        sum += i;\n    }\n    printf(\"Sum: %d\", sum);\n    return 0;\n}",
                language: "c"
            },
            {
                subjectId: findId("Object Oriented"),
                title: "Class and Object Basics",
                theory: "A class is a blueprint for objects. An object is an instance of a class.",
                algorithm: "1. Define class Person\n2. Add name property\n3. Create object p\n4. Set name\n5. Print name",
                codeTemplate: "class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Java OOP Simulation Active\");\n    }\n}",
                language: "java"
            }
        ];

        for (const exp of experimentsToSeed) {
            if (!exp.subjectId) {
                console.log(`  ⚠️ Skipping experiment '${exp.title}' (subject not found)`);
                continue;
            }
            try {
                await axios.post('http://localhost:5000/api/experiments/create', exp);
                console.log(`  ✅ Seeded: ${exp.title}`);
            } catch (err) {
                console.error(`  ❌ Failed to seed ${exp.title}:`, err.response?.data || err.message);
            }
        }

        console.log("\n✨ DATABASE INITIALIZATION COMPLETE.");
    } catch (err) {
        console.error("❌ CRITICAL ERROR during init:", err.response?.data || err.message);
    }
}

initializeDatabase();
