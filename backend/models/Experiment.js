const mongoose = require('mongoose');

const ExperimentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    theory: {
        type: String
    },
    algorithm: {
        type: String
    },
    codeTemplate: {
        type: String
    },
    language: {
        type: String
    },
    testcases: [
        {
            input: {
                type: String
            },
            output: {
                type: String
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Experiment', ExperimentSchema);
