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
