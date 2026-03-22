const mongoose = require('mongoose');

const AttendanceLogSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    student_email: {
        type: String
    },
    login_time: {
        type: Date,
        required: true
    },
    logout_time: {
        type: Date,
        default: null
    },
    session_duration: {
        type: Number, // (minutes)
        default: 0
    },
    ip_address: {
        type: String
    },
    date: {
        type: String, // (YYYY-MM-DD format)
        default: function() {
            return this.login_time.toISOString().split('T')[0];
        }
    },
    is_suspicious: {
        type: Boolean,
        default: false
    }
});

// Indexes: { student_id, date }
AttendanceLogSchema.index({ student_id: 1, date: 1 });

module.exports = mongoose.model('AttendanceLog', AttendanceLogSchema);
