const axios = require('axios');

async function fixExperiments() {
    try {
        console.log("🚀 STARTING EXPERIMENT SYNC...");

        // 1. Get All Subjects
        const subjectsRes = await axios.get('http://localhost:5000/api/subjects');
        const subjects = subjectsRes.data;
        console.log(`Found ${subjects.length} Subjects.`);

        // 2. Get All Experiments
        const experimentsRes = await axios.get('http://localhost:5000/api/experiments');
        const experiments = experimentsRes.data;
        console.log(`Found ${experiments.length} Experiments in total.`);

        // 3. Map Titles to New IDs
        const findId = (titlePart) => subjects.find(s => s.title.toLowerCase().includes(titlePart.toLowerCase()))?._id;

        const dsaId = findId("Data Structures");
        const cId = findId("C Programming");
        const oopsId = findId("Object Oriented");
        const cnId = findId("Computer Networks");
        const dldId = findId("Digital Logic");
        const dbmsId = findId("Database Management");
        const mpmcId = findId("Microprocessor");

        console.log("New Subject IDs:", { dsaId, cId, oopsId, cnId, dldId, dbmsId, mpmcId });

        // 4. Update experiments with new subjectIds
        // Since we don't have a direct "Update Experiment" API, 
        // and we want to avoid duplicates if we just re-seed, 
        // the easiest way is to re-seed experiments based on current subjects.

        // Wait, I can just write a script that CLEARING experiments and re-running the migration logic.
        console.log("\nCleaning up orphaned experiments...");
        // Actually, the simplest is to just re-migrate everything now that IDs are stable.

        const migrationData = [
            // DSA
            { title: "Reverse an Array", sub: "Data Structures", lang: "cpp" },
            // C
            { title: "Sum of Natural Numbers", sub: "C Programming", lang: "c" },
            // JAVA
            { title: "Class and Object Basics", sub: "Object Oriented", lang: "java" },
            // CN
            { title: "OSI vs TCP/IP Reference Models", sub: "Computer Networks", lang: "Universal" },
            { title: "CSMA/CD Protocol Study", sub: "Computer Networks", lang: "python" },
            // DBMS
            { title: "Introduction to DBMS (DDL/DML)", sub: "Database Management", lang: "sql" },
            { title: "SQL Queries: Joins & Subqueries", sub: "Database Management", lang: "sql" },
            // DLD
            { title: "Study and Verification of Logic Gates", sub: "Digital Logic", lang: "Universal" },
            { title: "Half Adder and Full Adder", sub: "Digital Logic", lang: "Universal" },
            // MPMC
            { title: "8-bit Addition & Subtraction", sub: "Microprocessor", lang: "Assembly" }
        ];

        // I'll re-implement the migration logic in a clean script to ensure no orphans.
        console.log("\n✨ Fixing is best done by re-seeding now that slugs/subjects are fixed.");

    } catch (err) {
        console.error(err.message);
    }
}

fixExperiments();
