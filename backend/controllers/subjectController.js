const Subject = require('../models/Subject');
const ActivityLog = require('../models/ActivityLog');

exports.createSubject = async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();

        // Log the action
        const log = new ActivityLog({
            action: 'CREATE_SUBJECT',
            userName: req.user?.fullName || 'Admin',
            userRole: req.user?.role || 'admin',
            details: `Created subject: ${subject.name} (${subject.code})`
        });
        await log.save();

        res.status(201).json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const Experiment = require('../models/Experiment');

exports.getSubjects = async (req, res) => {
    try {
        const { branch, semester } = req.query;
        const query = {};
        if (branch) query.branch = branch;
        if (semester) query.semester = parseInt(semester);
        
        // Use aggregation to count experiments for each subject
        const subjects = await Subject.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "experiments",
                    localField: "_id",
                    foreignField: "subject",
                    as: "experiments"
                }
            },
            {
                $addFields: {
                    experimentCount: { $size: "$experiments" }
                }
            },
            {
                $project: {
                    experiments: 0 // Remove the actual experiment documents to keep response light
                }
            }
        ]);

        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: "Subject deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
