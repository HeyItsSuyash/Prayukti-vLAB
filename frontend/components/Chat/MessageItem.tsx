'use client';

import React from 'react';
import { ChatMessage, useChatStore } from '@/lib/chatStore';
import { getSocket } from '@/lib/socket';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, CheckCircle2, Flag, Reply } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MessageItemProps {
    message: ChatMessage;
    isReply?: boolean;
}

export default function MessageItem({ message, isReply = false }: MessageItemProps) {
    const { currentUser, experimentId } = useChatStore();

    const handleReact = () => {
        if (!currentUser) return;
        const socket = getSocket();
        if (socket) {
            socket.emit('react-message', {
                messageId: message._id,
                userId: currentUser._id,
                experimentId
            });
        }
    };

    const handleMarkSolved = () => {
        if (!currentUser) return;
        const socket = getSocket();
        if (socket) {
            socket.emit('mark-solved', {
                messageId: message._id,
                experimentId,
                solverId: message.sender._id
            });
        }
    };

    const handleReport = () => {
        const reason = prompt("Reason for reporting this message?");
        if (reason && reason.trim()) {
            const token = localStorage.getItem('token');
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ messageId: message._id, reason })
            }).then(res => {
                if (res.ok) alert("Message reported.");
            });
        }
    };

    const handleReplyClick = () => {
        const event = new CustomEvent('set-reply', {
            detail: { id: message._id, content: message.content }
        });
        window.dispatchEvent(event);
    };

    const hasReacted = currentUser && message.reactions.includes(currentUser._id);
    const isAuthor = currentUser && currentUser._id === message.sender._id;

    if (message.isHidden) {
        return (
            <div className="p-3 text-sm text-gray-500 italic bg-gray-100 dark:bg-gray-800 rounded-lg">
                This message has been hidden due to community reports.
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-1 p-3 rounded-lg ${isReply
                ? 'bg-transparent border border-gray-100 dark:border-gray-800'
                : message.type === 'error' ? 'bg-red-50 dark:bg-red-900/10' : message.type === 'doubt' ? 'bg-orange-50 dark:bg-orange-900/10' : 'bg-white dark:bg-gray-800'
            } shadow-sm group`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        {message.sender.anonymousUsername}
                        {message.sender.badges?.includes('Helper') && (
                            <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">Helper</Badge>
                        )}
                        {message.sender.solutionsAccepted >= 10 && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">Top Solver</Badge>
                        )}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </span>
                </div>
                {!isAuthor && (
                    <button onClick={handleReport} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <Flag className="h-3 w-3" />
                    </button>
                )}
            </div>

            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">
                {message.content}
            </p>

            <div className="flex items-center gap-4 mt-2">
                {!isReply && (message.type === 'doubt' || message.type === 'error') && (
                    <button
                        onClick={handleReact}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${hasReacted ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{message.reactions.length} Same Issue</span>
                    </button>
                )}

                {!isReply && (
                    <button
                        onClick={handleReplyClick}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 px-2 py-1 rounded-md transition-colors"
                    >
                        <Reply className="h-3 w-3" />
                        <span>Reply</span>
                    </button>
                )}

                {isReply && message.isSolved && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Accepted Solution</span>
                    </span>
                )}

                {isReply && !message.isSolved && (
                    <button
                        onClick={handleMarkSolved}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 px-2 py-1 rounded-md transition-colors border border-transparent hover:border-green-200 dark:hover:border-green-800"
                        title="Mark as helpful solution"
                    >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Mark Solved</span>
                    </button>
                )}
            </div>
        </div>
    );
}
