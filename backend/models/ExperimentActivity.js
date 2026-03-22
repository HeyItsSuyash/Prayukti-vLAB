const mongoose = require('mongoose');

const ExperimentActivitySchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    experiment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experiment',
        required: true
    },
    experiment_name: {
        type: String
    },
    run_count: {
        type: Number,
        default: 1
    },
    time_spent: {
        type: Number, // (minutes)
        default: 0
    },
    result_generated: {
        type: Boolean,
        default: false
    },
    last_run_at: {
        type: Date,
        default: Date.now
    }
});

// Single index on { student_id }
ExperimentActivitySchema.index({ student_id: 1 });

// Unique compound index on { student_id, experiment_id }
ExperimentActivitySchema.index({ student_id: 1, experiment_id: 1 }, { unique: true });

module.exports = mongoose.model('ExperimentActivity', ExperimentActivitySchema);
