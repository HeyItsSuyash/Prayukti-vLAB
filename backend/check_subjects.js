const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const Subject = require('./models/Subject');

async function checkSubjects() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const subjects = await Subject.find({});
        console.log(JSON.stringify(subjects.map(s => ({ 
            title: s.title, 
            subject_id: s.subject_id 
        })), null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkSubjects();
