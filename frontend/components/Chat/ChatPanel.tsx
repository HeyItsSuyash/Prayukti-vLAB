'use client';

import React, { useEffect, useState } from 'react';
import { useChatStore, ChatMessage } from '@/lib/chatStore';
import { initSocket, disconnectSocket } from '@/lib/socket';
import MessageFeed from './MessageFeed';
import MessageInput from './MessageInput';
import UsernameRegistrationModal from './UsernameRegistrationModal';
import { X, MessageSquare, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatPanelProps {
    experimentId: string;
}

export default function ChatPanel({ experimentId }: ChatPanelProps) {
    const {
        isConnected, setIsConnected, setExperimentId, addMessage,
        updateMessageReactions, setSolved, currentUser, setMessages
    } = useChatStore();

    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setExperimentId(experimentId);
        const socket = initSocket();

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        socket.on('receive-message', (message: ChatMessage) => {
            addMessage(message);
        });

        socket.on('message-reaction-updated', ({ messageId, reactions }: { messageId: string, reactions: string[] }) => {
            updateMessageReactions(messageId, reactions);
        });

        socket.on('message-solved', ({ messageId, solverId }: { messageId: string, solverId?: string }) => {
            setSolved(messageId, solverId);
        });

        const fetchChatData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                if (!currentUser) {
                    const userRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/user`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        useChatStore.getState().setCurrentUser(userData);
                    }
                }

                const msgRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/${experimentId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (msgRes.ok) {
                    const msgData = await msgRes.json();
                    setMessages(msgData);
                }

                socket.emit('join-room', experimentId);

            } catch (error) {
                console.error('Error fetching chat data', error);
            }
        };

        fetchChatData();

        return () => {
            socket.emit('leave-room', experimentId);
            socket.off('connect');
            socket.off('disconnect');
            socket.off('receive-message');
            socket.off('message-reaction-updated');
            socket.off('message-solved');
        };
    }, [experimentId, isOpen, currentUser, addMessage, updateMessageReactions, setSolved, setIsConnected, setExperimentId, setMessages]);

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 rounded-full shadow-lg h-14 w-14 z-50 bg-indigo-600 hover:bg-indigo-700"
            >
                <MessageSquare className="h-6 w-6 text-white" />
            </Button>
        );
    }

    return (
        <div className={`fixed bottom-0 right-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-t-xl z-50 flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'w-[600px] h-[80vh] max-w-[90vw]' : 'w-[400px] h-[600px] max-w-[90vw]'}`}>

            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-indigo-50 dark:bg-indigo-900/20 rounded-t-xl">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        Experiment Chat <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </h3>
                    {currentUser && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Posting as: <span className="font-medium text-indigo-600 dark:text-indigo-400">{currentUser.anonymousUsername}</span>
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8">
                        {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {!currentUser && <UsernameRegistrationModal />}

            <div className="flex-1 overflow-hidden relative flex flex-col">
                <MessageFeed />
            </div>

            {currentUser && !currentUser.isMuted ? (
                <MessageInput />
            ) : currentUser?.isMuted ? (
                <div className="p-4 text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/10">
                    You are currently muted.
                </div>
            ) : null}
        </div>
    );
}
