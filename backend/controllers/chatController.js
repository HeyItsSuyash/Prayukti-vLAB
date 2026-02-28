const ChatUser = require('../models/ChatUser');
const ChatMessage = require('../models/ChatMessage');
const ChatReport = require('../models/ChatReport');

// Get or create anonymous username for a student
const getAnonymousUser = async (req, res) => {
    try {
        const userId = req.user.id; // from JWT
        let chatUser = await ChatUser.findOne({ userId });

        if (!chatUser) {
            // Generate random anonymous username
            const adjectives = ['Curious', 'Helpful', 'Clever', 'Bright', 'Quick', 'Smart', 'Sharp', 'Brave', 'Calm', 'Eager'];
            const nouns = ['Coder', 'Dev', 'Student', 'Hacker', 'Byte', 'Ninja', 'Guru', 'Geek', 'Scholar', 'Expert'];
            let isUnique = false;
            let anonymousUsername = '';

            while (!isUnique) {
                const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
                const noun = nouns[Math.floor(Math.random() * nouns.length)];
                const randomNum = Math.floor(Math.random() * 9000) + 1000;
                anonymousUsername = `${adj}${noun}${randomNum}`;

                const existing = await ChatUser.findOne({ anonymousUsername });
                if (!existing) isUnique = true;
            }

            chatUser = new ChatUser({
                userId,
                anonymousUsername
            });
            await chatUser.save();
        }

        res.status(200).json(chatUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Fetch message history for a room
const getMessages = async (req, res) => {
    try {
        const { experimentId } = req.params;
        const messages = await ChatMessage.find({ experimentId, isHidden: false })
            .populate('sender', 'anonymousUsername badges solutionsAccepted isMuted')
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Report a message
const reportMessage = async (req, res) => {
    try {
        const { messageId, reason } = req.body;
        const reporterId = req.user.id;

        const chatUser = await ChatUser.findOne({ userId: reporterId });
        if (!chatUser) return res.status(404).json({ message: 'ChatUser not found' });

        const report = new ChatReport({
            messageId,
            reportedBy: chatUser._id,
            reason
        });

        await report.save();

        // Auto-hide logic (if reported >= 3 times)
        const reportCount = await ChatReport.countDocuments({ messageId });
        if (reportCount >= 3) {
            await ChatMessage.findByIdAndUpdate(messageId, { isHidden: true });
        }

        res.status(200).json({ message: 'Message reported successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getAnonymousUser, getMessages, reportMessage };
