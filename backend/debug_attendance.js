const mongoose = require('mongoose');
require('dotenv').config();

const AttendanceLog = require('./models/AttendanceLog');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const now = new Date();
    const queryStart = new Date(now);
    queryStart.setHours(0, 0, 0, 0);
    const queryEnd = new Date(queryStart);
    queryEnd.setDate(queryEnd.getDate() + 1);

    console.log('[TEST] Server local time:', now.toString());
    console.log('[TEST] UTC offset (mins):', now.getTimezoneOffset());
    console.log('[TEST] queryStart (local midnight):', queryStart.toISOString());
    console.log('[TEST] queryEnd   (next midnight):', queryEnd.toISOString());

    const count = await AttendanceLog.countDocuments({
        login_time: { $gte: queryStart, $lt: queryEnd }
    });
    console.log('[TEST] Documents found for today:', count);

    const sample = await AttendanceLog.find({}).sort({ login_time: -1 }).limit(5).select('login_time student_email date');
    console.log('[TEST] Most recent 5 AttendanceLogs:');
    sample.forEach(l => console.log('  login_time:', l.login_time ? l.login_time.toISOString() : 'NULL', '| date:', l.date, '| email:', l.student_email));

    await mongoose.disconnect();
    console.log('Done.');
}).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
