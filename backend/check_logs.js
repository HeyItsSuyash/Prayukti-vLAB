const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const AttendanceLog = require('./models/AttendanceLog');

async function checkLogs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const logs = await AttendanceLog.find({ lab_id: { $ne: null } });
        console.log(JSON.stringify(logs.map(l => ({ 
            id: l._id,
            lab_id: l.lab_id, 
            subject_id: l.subject_id 
        })), null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkLogs();
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const logs = await mongoose.connection.collection('attendancelogs').find({}).sort({ login_time: -1 }).limit(10).toArray();
    console.log('RECENT ATTENDANCE LOGS:');
    logs.forEach(l => console.log(`  id: ${l._id} | user: ${l.student_email} | login: ${l.login_time} | logout: ${l.logout_time}`));
    
    const targetUserId = '69b52283b723241a50833aee';
    const userLogs = await mongoose.connection.collection('attendancelogs').find({ 
        student_id: new mongoose.Types.ObjectId(targetUserId) 
    }).sort({ login_time: -1 }).toArray();
    
    console.log(`\nLOGS FOR USER ${targetUserId}:`);
    userLogs.forEach(l => console.log(`  id: ${l._id} | login: ${l.login_time} | logout: ${l.logout_time}`));

    const targetLogId = '69b82f8b30564dde587c0a2e';
    const specificLog = await mongoose.connection.collection('attendancelogs').findOne({ 
        _id: new mongoose.Types.ObjectId(targetLogId) 
    });
    console.log(`\nSPECIFIC LOG ${targetLogId}:`, JSON.stringify(specificLog, null, 2));
    
    await mongoose.disconnect();
    console.log('Done.');
}).catch(e => { console.error(e.message); process.exit(1); });
