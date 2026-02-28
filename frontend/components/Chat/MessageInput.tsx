'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/lib/chatStore';
import { getSocket } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { Send, Reply, X } from 'lucide-react';

export default function MessageInput() {
    const { currentUser, experimentId } = useChatStore();
    const [content, setContent] = useState('');
    const [type, setType] = useState<'doubt' | 'error' | 'message' | 'reply'>('doubt');
    const [replyingTo, setReplyingTo] = useState<{ id: string, content: string } | null>(null);

    // Expose a way for MessageItem to set this globally or pass via event
    // For simplicity, we can listen to a custom event
    React.useEffect(() => {
        const handleReplyEvent = (e: CustomEvent) => {
            setReplyingTo({ id: e.detail.id, content: e.detail.content });
            setType('reply'); // auto set to reply type
        };
        window.addEventListener('set-reply', handleReplyEvent as EventListener);
        return () => window.removeEventListener('set-reply', handleReplyEvent as EventListener);
    }, []);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !currentUser || !experimentId) return;

        const socket = getSocket();
        if (socket) {
            socket.emit('send-message', {
                experimentId,
                senderId: currentUser._id,
                content: content.trim(),
                type: replyingTo ? 'reply' : type,
                parentMessageId: replyingTo?.id || null
            });
            setContent('');
            setReplyingTo(null);
            // Reset type to default after sending a reply
            if (replyingTo) setType('doubt');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            {replyingTo && (
                <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-md mb-2 text-sm border border-indigo-100 dark:border-indigo-800">
                    <div className="flex items-center gap-2 truncate">
                        <Reply className="h-4 w-4 text-indigo-500" />
                        <span className="truncate text-gray-600 dark:text-gray-300">
                            Replying to: <span className="font-medium">{replyingTo.content.substring(0, 30)}...</span>
                        </span>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="text-gray-500 hover:text-gray-700">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSend} className="flex flex-col gap-2">
                {!replyingTo && (
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setType('doubt')} className={`text-xs px-3 py-1 rounded-full border ${type === 'doubt' ? 'bg-orange-100 border-orange-200 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>Doubt/Question</button>
                        <button type="button" onClick={() => setType('error')} className={`text-xs px-3 py-1 rounded-full border ${type === 'error' ? 'bg-red-100 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>Error/Bug</button>
                        <button type="button" onClick={() => setType('message')} className={`text-xs px-3 py-1 rounded-full border ${type === 'message' ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>General</button>
                    </div>
                )}
                <div className="flex gap-2">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={replyingTo ? 'Write a helpful reply...' : 'Type your doubt or issue here...'}
                        className="flex-1 resize-none rounded-md border border-gray-300 dark:border-gray-700 bg-transparent p-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 min-h-[40px] max-h-[120px]"
                        rows={replyingTo ? 1 : 2}
                    />
                    <Button type="submit" size="icon" disabled={!content.trim()} className="bg-indigo-600 hover:bg-indigo-700 self-end">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
