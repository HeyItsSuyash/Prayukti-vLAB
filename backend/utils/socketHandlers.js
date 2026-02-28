const ChatMessage = require('../models/ChatMessage');
const ChatUser = require('../models/ChatUser');

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Join an experiment-specific room
        socket.on('join-room', (experimentId) => {
            socket.join(experimentId);
            console.log(`Socket ${socket.id} joined room ${experimentId}`);
        });

        // Leave an experiment-specific room
        socket.on('leave-room', (experimentId) => {
            socket.leave(experimentId);
            console.log(`Socket ${socket.id} left room ${experimentId}`);
        });

        // Handle sending a new message or threaded reply
        socket.on('send-message', async (data) => {
            try {
                const { experimentId, senderId, content, type, parentMessageId, attachments } = data;

                // Muted users check should ideally be done here
                const sender = await ChatUser.findById(senderId);
                if (sender && sender.isMuted) {
                    return socket.emit('error', { message: 'You are muted and cannot send messages.' });
                }

                const newMessage = new ChatMessage({
                    experimentId,
                    sender: senderId,
                    content,
                    type: type || 'message',
                    parentMessageId: parentMessageId || null,
                    attachments: attachments || []
                });

                await newMessage.save();

                const populatedMessage = await ChatMessage.findById(newMessage._id).populate('sender', 'anonymousUsername badges solutionsAccepted isMuted');

                // Broadcast securely to peer room
                io.to(experimentId).emit('receive-message', populatedMessage);
            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // "Same Issue" reaction toggle
        socket.on('react-message', async (data) => {
            try {
                const { messageId, userId, experimentId } = data;

                const message = await ChatMessage.findById(messageId);
                if (!message) return;

                const hasReacted = message.reactions.includes(userId);
                if (hasReacted) {
                    message.reactions.pull(userId);
                } else {
                    message.reactions.push(userId);
                }

                await message.save();
                io.to(experimentId).emit('message-reaction-updated', {
                    messageId: message._id,
                    reactions: message.reactions
                });
            } catch (error) {
                console.error('Error updating reaction:', error);
            }
        });

        // Mark a reply as solved by the doubt author
        socket.on('mark-solved', async (data) => {
            try {
                const { messageId, experimentId, solverId } = data;

                const message = await ChatMessage.findById(messageId);
                if (!message) return;

                message.isSolved = true;
                await message.save();

                // Update reputation
                if (solverId) {
                    const solver = await ChatUser.findByIdAndUpdate(solverId, { $inc: { solutionsAccepted: 1 } }, { new: true });

                    // Simple logic to add 'Helper' badge at 5 solutions
                    if (solver && solver.solutionsAccepted === 5 && !solver.badges.includes('Helper')) {
                        solver.badges.push('Helper');
                        await solver.save();
                    }
                }

                io.to(experimentId).emit('message-solved', {
                    messageId: message._id,
                    solverId: solverId
                });
            } catch (error) {
                console.error('Error marking message solved:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
