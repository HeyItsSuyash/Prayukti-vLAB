require('dotenv').config();
const connectDB = require('./config/db');
connectDB().then(() => {
    console.log('Test successful');
    process.exit(0);
}).catch(err => {
    console.error('Test failed', err);
    process.exit(1);
});
