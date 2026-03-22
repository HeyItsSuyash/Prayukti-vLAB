const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    icon: {
        type: String
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    subject_id: {
        type: String,
        unique: true,
        sparse: true
    },
    experimentsCount: {
        type: Number,
        default: 0
    },
    branch: {
        type: String,
        default: "Common"
    },
    semester: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);
