import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = () => {
    const { data } = useAuth();
    const user = data?.user;
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (user && !socketRef.current) {
            // Determine Socket URL (Fallback to same origin for relative paths or specific env var)
            const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || '';
            // In dev: often http://localhost:3001 if separate. If proxied by Next, can be empty string.
            // Given your setup seems to proxy /api, but socket.io typically needs its own port or path unless configured on same server port.
            // Since backend runs on 3001 and frontend on 3000, we should point to backend.
            const url = 'http://localhost:3001';

            socketRef.current = io(url, {
                // path: '/socket.io', // Default
                transports: ['websocket'], // Prefer websocket
            });

            socketRef.current.on('connect', () => {
                console.log('Socket Connected:', socketRef.current?.id);
                // Join user room
                socketRef.current?.emit('join_user_room', user.id);
            });

            socketRef.current.on('disconnect', () => {
                console.log('Socket Disconnected');
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user]);

    return socketRef.current;
};
