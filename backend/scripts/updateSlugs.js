const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Experiment = require('../models/Experiment');
const Subject = require('../models/Subject');

const mapping = [
    { subject: "Digital Logic", prefix: "dld-exp-" },
    { subject: "Computer Networks", prefix: "cn-exp-" },
    { subject: "Database Management", prefix: "dbms-exp-" },
    { subject: "Object Oriented", prefix: "oops-exp-" },
    { subject: "Microprocessor", prefix: "mpmc-exp-" }
];

async function updateSlugs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const subjects = await Subject.find({});
        
        for (const sub of subjects) {
            const map = mapping.find(m => sub.name.includes(m.subject) || sub.code.includes(m.subject));
            if (!map) {
                console.log(`No mapping found for subject: ${sub.name}`);
                continue;
            }

            // Get experiments for this subject in order of creation/name to match registry
            // The sync script added them in order, so they should be sorted by name or creation
            const experiments = await Experiment.find({ subject: sub._id }).sort({ name: 1 });
            
            console.log(`Updating ${experiments.length} experiments for ${sub.name}...`);
            
            for (let i = 0; i < experiments.length; i++) {
                const oldSlug = experiments[i].slug;
                const newSlug = `${map.prefix}${i + 1}`;
                
                await Experiment.findByIdAndUpdate(experiments[i]._id, { slug: newSlug });
                console.log(`  ${oldSlug} -> ${newSlug}`);
            }
        }

        console.log('Slug update complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateSlugs();
