const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    experimentId: {
        type: String, // String identifier for the experiment room (e.g., 'oopj-lab-1')
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatUser',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    type: {
        type: String,
        enum: ['doubt', 'reply', 'error', 'message'],
        default: 'message'
    },
    parentMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatMessage', // For threaded replies
        default: null
    },
    isSolved: {
        type: Boolean,
        default: false // Only the original sender of a 'doubt' or 'error' can mark a reply as solved
    },
    reactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatUser' // List of users who clicked "Same Issue"
    }],
    attachments: [{
        url: String, // E.g., screenshot link
        type: String // E.g., 'image/png'
    }],
    isHidden: {
        type: Boolean,
        default: false // Set to true if reported multiple times or administratively hidden
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
