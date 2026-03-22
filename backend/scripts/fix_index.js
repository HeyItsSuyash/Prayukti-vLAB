const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndex() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    try {
        await mongoose.connection.collection('attendancelogs')
            .dropIndex('student_id_1_login_date_1');
        console.log('✅ Bad index "student_id_1_login_date_1" dropped successfully');
    } catch (e) {
        console.log('ℹ️  Index may not exist or already dropped:', e.message);
    }

    // Also try dropping any other old bad indexes
    try {
        await mongoose.connection.collection('attendancelogs')
            .dropIndex('student_id_1_date_1');
        console.log('✅ Old index "student_id_1_date_1" dropped (will be recreated as non-unique)');
    } catch (e) {
        console.log('ℹ️  student_id_1_date_1 not found:', e.message);
    }

    // List remaining indexes
    const indexes = await mongoose.connection.collection('attendancelogs').indexes();
    console.log('\nRemaining indexes on attendancelogs:');
    indexes.forEach(idx => console.log(' -', JSON.stringify(idx.key), idx.unique ? '[UNIQUE]' : ''));

    await mongoose.disconnect();
    console.log('\nDone. Restart the backend server now.');
}

fixIndex().catch(err => {
    console.error('Script failed:', err.message);
    process.exit(1);
});
