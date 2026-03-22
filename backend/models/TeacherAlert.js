const mongoose = require('mongoose');

const TeacherAlertSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    alert_type: {
        type: String,
        enum: ['MISSED_EXPERIMENTS', 'LOW_ATTENDANCE', 'SHORT_SESSION', 'SUSPICIOUS_ACTIVITY']
    },
    message: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    resolved: {
        type: Boolean,
        default: false
    }
});

// Indexes: { student_id, resolved }
TeacherAlertSchema.index({ student_id: 1, resolved: 1 });

module.exports = mongoose.model('TeacherAlert', TeacherAlertSchema);
