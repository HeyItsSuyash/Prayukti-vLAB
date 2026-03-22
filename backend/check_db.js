require('dotenv').config();
const connectDB = require('./config/db');
connectDB().then(() => {
    console.log('Test successful');
    process.exit(0);
}).catch(err => {
    console.error('Test failed', err);
    process.exit(1);
});
const mongoose = require('mongoose');

async function check() {
    await mongoose.connect('mongodb+srv://vlab_admin:Prayukti%402026@cluster0.ts8jqfx.mongodb.net/vlab?appName=Cluster0');
    const Resource = mongoose.model('Resource', new mongoose.Schema({
        experiment: mongoose.Schema.Types.ObjectId,
        type: String,
        title: String,
        url: String,
        content: String
    }));
    const Experiment = mongoose.model('Experiment', new mongoose.Schema({
        name: String,
        slug: String
    }));
    
    const resources = await Resource.find({});
    console.log('Total Resources:', resources.length);
    
    for (const res of resources) {
        const exp = await Experiment.findById(res.experiment);
        console.log({
            id: res._id,
            type: res.type,
            title: res.title,
            url: res.url,
            experiment: exp ? exp.name : 'Unknown',
            slug: exp ? exp.slug : 'Unknown'
        });
    }
    process.exit();
}
check();
const axios = require('axios');

async function checkDatabase() {
    try {
        console.log("Fetching current subjects from database...");
        const response = await axios.get('http://localhost:5000/api/subjects');
        console.log("Total Subjects Found:", response.data.length);
        console.log("Subject Titles:", response.data.map(s => s.title));
    } catch (err) {
        console.error("Error checking database:", err.message);
    }
}

checkDatabase();
