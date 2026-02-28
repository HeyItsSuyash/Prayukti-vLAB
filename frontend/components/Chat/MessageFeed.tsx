'use client';

import React, { useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/chatStore';
import MessageItem from './MessageItem';

export default function MessageFeed() {
    const { messages } = useChatStore();
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [messages]);

    // Organizing threaded messages could be done by grouping parent messages and their replies
    const topLevelMessages = messages.filter(m => !m.parentMessageId);

    return (
        <div ref={feedRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50 dark:bg-gray-900/50">
            {topLevelMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-2 p-8">
                    <p>No messages yet.</p>
                    <p className="text-sm">Be the first to ask a doubt or share a tip!</p>
                </div>
            ) : (
                topLevelMessages.map((msg) => {
                    const replies = messages.filter(m => m.parentMessageId === msg._id);
                    return (
                        <div key={msg._id} className="space-y-2">
                            <MessageItem message={msg} />
                            {replies.length > 0 && (
                                <div className="ml-8 pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/50 space-y-2">
                                    {replies.map(reply => (
                                        <MessageItem key={reply._id} message={reply} isReply />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
