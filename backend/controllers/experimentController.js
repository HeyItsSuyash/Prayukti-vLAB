const Experiment = require('../models/Experiment');
const ActivityLog = require('../models/ActivityLog');

exports.createExperiment = async (req, res) => {
    try {
        const experiment = new Experiment(req.body);
        await experiment.save();
        
        // Log action
        await new ActivityLog({
            action: 'CREATE_EXPERIMENT',
            userName: req.user?.fullName || 'Admin',
            userRole: 'admin',
            details: `Created experiment: ${experiment.name}`
        }).save();

        res.status(201).json(experiment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getExperiments = async (req, res) => {
    try {
        const { subjectId } = req.query;
        const query = subjectId ? { subject: subjectId } : {};
        const experiments = await Experiment.find(query).populate('subject');
        res.json(experiments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateExperiment = async (req, res) => {
    try {
        const experiment = await Experiment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(experiment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteExperiment = async (req, res) => {
    try {
        await Experiment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Experiment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
