import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import config from '@/lib/config';

export const useSocket = () => {
    const { data } = useAuth();
    const user = data?.user;
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (user && !socketRef.current) {
            // Determine Socket URL
            let url = process.env.NEXT_PUBLIC_SOCKET_URL;

            // If no explicit socket URL env var, derive from config or defaults
            if (!url) {
                // In production, config.apiBaseUrl is 'https://eloco.up.railway.app' (or similar)
                // In development, it might be empty (relative proxy).
                // We prefer the full backend URL if available.
                if (config.apiBaseUrl && !config.apiBaseUrl.startsWith('/')) {
                    url = config.apiBaseUrl;
                } else {
                    // Fallback for local development or if config is relative
                    // Connect directly to backend port to avoid proxy issues with sockets
                    url = 'http://localhost:3001';
                }
            }

            // Fallback safety for production if config failed somehow
            if (!url && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
                url = 'https://eloco.up.railway.app';
            }

            console.log('[useSocket] Connecting to:', url);

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