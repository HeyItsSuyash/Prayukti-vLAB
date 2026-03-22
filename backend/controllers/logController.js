const ActivityLog = require('../models/ActivityLog');

exports.getLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createLog = async (req, res) => {
    try {
        const log = new ActivityLog({
            action: req.body.action,
            userName: req.user?.fullName || 'System',
            userRole: req.user?.role || 'system',
            details: req.body.details
        });
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
