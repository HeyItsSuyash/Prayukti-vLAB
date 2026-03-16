const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const Subject = require('./models/Subject');
    const Experiment = require('./models/Experiment');
    
    const subjects = await Subject.find();
    console.log(`\nFound ${subjects.length} Subjects:`);
    for (const sub of subjects) {
        const count = await Experiment.countDocuments({ subject: sub._id });
        console.log(`- ${sub.name} (${sub.code}): ${count} Experiments`);
        const exps = await Experiment.find({ subject: sub._id });
        exps.forEach(e => console.log(`    * ${e.name} (${e.slug})`));
    }
    process.exit(0);
}

check();
