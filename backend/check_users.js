const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    // Check what roles actually exist
    const users = await mongoose.connection.collection('users').find({}).project({ email: 1, role: 1, isVerified: 1 }).toArray();
    console.log('ALL USERS IN DB:');
    users.forEach(u => console.log('  email:', u.email, '| role:', u.role, '| verified:', u.isVerified));
    
    // Count by role
    const roleCounts = {};
    users.forEach(u => {
        roleCounts[u.role || 'undefined'] = (roleCounts[u.role || 'undefined'] || 0) + 1;
    });
    console.log('\nRole counts:', roleCounts);

    await mongoose.disconnect();
    console.log('Done.');
}).catch(e => { console.error(e.message); process.exit(1); });
