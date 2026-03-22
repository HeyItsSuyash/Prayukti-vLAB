const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    subjectId: {
        type: String, // String or ObjectId depending on how subjects are stored elsewhere
        required: true
    },
    experimentId: {
        type: String, // Similar, could be string identifier or ObjectId
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    durationMinutes: {
        type: Number,
        required: true,
        min: 1
    },
    startTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed'],
        default: 'upcoming'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Exam', ExamSchema);
