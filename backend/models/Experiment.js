const mongoose = require('mongoose');

const ExperimentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ["learning", "experimental"],
        default: "experimental"
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },
    status: {
        type: String,
        enum: ["Active", "Maintenance", "Draft"],
        default: "Active"
    },
    metadata: {
        description: String,
        estimatedTime: String,
        prerequisites: [String],
        thumbnailUrl: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Experiment', ExperimentSchema);
