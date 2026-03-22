const Resource = require('../models/Resource');
const Experiment = require('../models/Experiment');

exports.createResource = async (req, res) => {
    try {
        const resource = new Resource(req.body);
        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getResources = async (req, res) => {
    try {
        const { experimentId, slug } = req.query;
        let query = {};
        
        if (experimentId) {
            query.experiment = experimentId;
        } else if (slug) {
            const experiment = await Experiment.findOne({ slug });
            if (!experiment) return res.json([]);
            query.experiment = experiment._id;
        }

        const resources = await Resource.find(query);
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: 'Resource deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
