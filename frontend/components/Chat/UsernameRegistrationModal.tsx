'use client';

import React from 'react';
import { useChatStore } from '@/lib/chatStore';

export default function UsernameRegistrationModal() {
    const { currentUser } = useChatStore();

    if (currentUser) return null;

    return (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-20 flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Welcome to Peer Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    To protect your privacy and encourage open doubt-sharing, you are assigned an anonymous identity:
                </p>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-800">
                    <div className="animate-pulse flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></span>
                        <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">Generating identity...</span>
                    </div>
                </div>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    This identity stays with you across all experiments. Earn badges by helping others!
                </p>
            </div>
        </div>
    );
}
