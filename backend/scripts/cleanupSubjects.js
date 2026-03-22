const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Subject = require('../models/Subject');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const subjects = await Subject.find({});
        console.log(`Found ${subjects.length} subjects`);
        
        const seen = new Map(); // cleanName -> id
        
        for (const sub of subjects) {
            const cleanName = sub.name.trim().toLowerCase();
            if (seen.has(cleanName)) {
                console.log(`Deleting duplicate: "${sub.name}" (${sub._id}) - original was ${seen.get(cleanName)}`);
                await Subject.findByIdAndDelete(sub._id);
            } else {
                seen.set(cleanName, sub._id);
            }
        }
        
        // Special case: Database Management vs Database Management System
        // If both exist, keep one.
        const dbms1 = await Subject.findOne({ name: /Database Management/i });
        const dbms2 = await Subject.findOne({ name: /Database Management System/i });
        if (dbms1 && dbms2 && dbms1._id.toString() !== dbms2._id.toString()) {
             console.log(`Deleting redundant "Database Management System" in favor of "Database Management"`);
             await Subject.findByIdAndDelete(dbms2._id);
        }

        console.log('Cleanup Complete!');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

cleanup();
