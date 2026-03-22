const mongoose = require('mongoose');

const SuspiciousActivitySchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        enum: ['NO_EXPERIMENT_RUN', 'SHORT_SESSION', 'CONCURRENT_LOGIN']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ip_address: {
        type: String
    }
});

// Indexes: { student_id, timestamp }
SuspiciousActivitySchema.index({ student_id: 1, timestamp: 1 });

module.exports = mongoose.model('SuspiciousActivity', SuspiciousActivitySchema);
