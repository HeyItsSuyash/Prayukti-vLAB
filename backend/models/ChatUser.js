const mongoose = require('mongoose');

const ChatUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    anonymousUsername: {
        type: String,
        required: true,
        unique: true
    },
    badges: {
        type: [String],
        default: [] // e.g., 'Helper', 'Top Problem Solver'
    },
    solutionsAccepted: {
        type: Number,
        default: 0
    },
    isMuted: {
        type: Boolean,
        default: false // For silent read-only mode if reported/abusive
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatUser', ChatUserSchema);
