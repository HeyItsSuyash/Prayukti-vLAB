import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
    if (!socket) {
        socket = io(BACKEND_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
    }
    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
