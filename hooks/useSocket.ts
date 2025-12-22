import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = () => {
    const { data } = useAuth();
    const user = data?.user;
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (user && !socketRef.current) {
            // Determine Socket URL
            let url = process.env.NEXT_PUBLIC_SOCKET_URL || '';

            if (!url && typeof window !== 'undefined') {
                if (window.location.hostname === 'localhost') {
                    url = 'http://localhost:3001';
                } else {
                    url = window.location.origin;
                }
            }

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
