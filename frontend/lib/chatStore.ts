import { create } from 'zustand';

export interface ChatUser {
    _id: string;
    anonymousUsername: string;
    badges: string[];
    solutionsAccepted: number;
    isMuted: boolean;
}

export interface ChatMessage {
    _id: string;
    experimentId: string;
    sender: ChatUser;
    content: string;
    type: 'doubt' | 'reply' | 'error' | 'message';
    parentMessageId?: string | null;
    isSolved: boolean;
    reactions: string[];
    isHidden: boolean;
    createdAt: string;
}

interface ChatState {
    currentUser: ChatUser | null;
    messages: ChatMessage[];
    isConnected: boolean;
    experimentId: string | null;
    setCurrentUser: (user: ChatUser | null) => void;
    setMessages: (messages: ChatMessage[]) => void;
    addMessage: (message: ChatMessage) => void;
    updateMessageReactions: (messageId: string, reactions: string[]) => void;
    setSolved: (messageId: string, solverId?: string) => void;
    setIsConnected: (status: boolean) => void;
    setExperimentId: (id: string | null) => void;
    hideMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    currentUser: null,
    messages: [],
    isConnected: false,
    experimentId: null,
    setCurrentUser: (user) => set({ currentUser: user }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    updateMessageReactions: (messageId, reactions) => set((state) => ({
        messages: state.messages.map(m => m._id === messageId ? { ...m, reactions } : m)
    })),
    setSolved: (messageId, solverId) => set((state) => ({
        messages: state.messages.map(m => m._id === messageId ? { ...m, isSolved: true } : m)
    })),
    setIsConnected: (status) => set({ isConnected: status }),
    setExperimentId: (id) => set({ experimentId: id }),
    hideMessage: (messageId) => set((state) => ({
        messages: state.messages.filter(m => m._id !== messageId)
    }))
}));
