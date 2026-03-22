const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    experiment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experiment',
        required: true
    },
    type: {
        type: String,
        enum: ["video", "notes", "pdf"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String // Required for video/pdf
    },
    content: {
        type: String // Required for notes
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resource', ResourceSchema);
