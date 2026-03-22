const mongoose = require('mongoose');

const ExamSessionSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'submitted', 'time_up'],
        default: 'not_started'
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    timeSpentSeconds: {
        type: Number,
        default: 0
    },
    warnings: {
        type: Number,
        default: 0
    },
    tabSwitches: {
        type: Number,
        default: 0
    },
    activityLog: [{
        type: String
    }],
    completed: {
        type: Boolean,
        default: false
    },
    submissionData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

// Ensure a student can only have one session per exam
ExamSessionSchema.index({ examId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('ExamSession', ExamSessionSchema);
