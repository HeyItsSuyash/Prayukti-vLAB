const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Experiment = require('../models/Experiment');
const fs = require('fs');

const subjectsToSync = [
    {
        name: "Computer Networks",
        slug: "computer-networks",
        code: "KCS-453",
        branch: "CSE",
        semester: 4
    },
    {
        name: "Database Management Systems",
        slug: "dbms",
        code: "KCS-551",
        branch: "CSE",
        semester: 5
    },
    {
        name: "Object Oriented Programming with Java",
        slug: "oopj",
        code: "KCS-352",
        branch: "CSE",
        semester: 3
    }
];

function findExperiments(dir, baseDir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory()) {
            // If it has a page.tsx, it's an experiment (or a sub-page we care about)
            if (fs.existsSync(path.join(filePath, 'page.tsx'))) {
                const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
                if (relativePath && !['experiments', 'simulation', 'api'].includes(file)) {
                    results.push({
                        name: file.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                        slug: relativePath.replace(/\//g, '-'),
                    });
                }
            }
            // Even if it's an experiment folder, it might have children experiments (though unlikely in this structure)
            results = results.concat(findExperiments(filePath, baseDir));
        }
    });
    return results;
}

async function sync() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const subjectBaseDir = path.join(__dirname, '../../frontend/app/subjects');

        for (const subInfo of subjectsToSync) {
            console.log(`\nProcessing Subject: ${subInfo.name}...`);
            
            // 1. Upsert Subject
            let subject = await Subject.findOne({ code: subInfo.code });
            if (!subject) {
                subject = new Subject({
                    name: subInfo.name,
                    code: subInfo.code,
                    branch: subInfo.branch,
                    semester: subInfo.semester
                });
                await subject.save();
                console.log(`Created Subject: ${subInfo.name}`);
            } else {
                console.log(`Subject already exists: ${subInfo.name}`);
            }

            // 2. Scan for experiments recursively
            const subFolderPath = path.join(subjectBaseDir, subInfo.slug);
            const experiments = findExperiments(subFolderPath, subFolderPath);

            for (const exp of experiments) {
                let experiment = await Experiment.findOne({ slug: exp.slug });
                if (!experiment) {
                    experiment = new Experiment({
                        name: exp.name,
                        slug: exp.slug,
                        subject: subject._id,
                        type: "experimental",
                        difficulty: "Medium",
                        status: "Active"
                    });
                    await experiment.save();
                    console.log(`  Added Experiment: ${exp.name} (${exp.slug})`);
                } else {
                    // Update subject reference if it was somehow different
                    experiment.subject = subject._id;
                    await experiment.save();
                    console.log(`  Experiment updated: ${exp.name} (${exp.slug})`);
                }
            }
        }

        console.log("\n✅ Sync Completed Successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Sync Failed:", error);
        process.exit(1);
    }
}

sync();
