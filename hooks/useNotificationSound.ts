import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotificationStore } from '@/app/_zustand/notificationStore';

const SOUND_FILE = '/sounds/notification.mp3';
const THROTTLE_MS = 3000;

export const useNotificationSound = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastPlayedRef = useRef<number>(0);
    const setStoreSoundEnabled = useNotificationStore((state) => state.setSoundEnabled);

    useEffect(() => {
        // Safe check for window
        if (typeof window === 'undefined') return;

        const stored = localStorage.getItem('notificationSound');
        const enabled = stored === 'true';
        setIsEnabled(enabled);
        setStoreSoundEnabled(enabled);

        const audio = new Audio(SOUND_FILE);
        audio.volume = 0.5;
        audioRef.current = audio;

        return () => {
            audioRef.current = null;
        };
    }, [setStoreSoundEnabled]);

    const toggleSound = useCallback(() => {
        setIsEnabled((prev) => {
            const newValue = !prev;
            localStorage.setItem('notificationSound', String(newValue));
            setStoreSoundEnabled(newValue);

            // Try to play sound immediately on enable to unlock audio context (autoplay policy)
            if (newValue && audioRef.current) {
                audioRef.current.play().catch(e => {
                    // This is expected if user hasn't interacted with document yet
                    console.warn('[SOUND] Auto-play preventive check failed (normal):', e.message);
                });
            }

            return newValue;
        });
    }, [setStoreSoundEnabled]);

    const playSound = useCallback(async () => {
        if (!isEnabled || !audioRef.current) {
            return;
        }

        // 1. Tab Focus Guard
        if (typeof document !== 'undefined' && document.hidden) {
            console.log('[SOUND] Skipped: Tab hidden');
            return;
        }

        // 2. Throttling
        const now = Date.now();
        if (now - lastPlayedRef.current < THROTTLE_MS) {
            console.log('[SOUND] Throttled');
            return;
        }

        try {
            // Reset to start
            audioRef.current.currentTime = 0;
            // Play
            await audioRef.current.play();
            lastPlayedRef.current = now;
            console.log('[SOUND] Played');
        } catch (error) {
            console.warn('[SOUND] Play failed (likely autoplay policy):', error);
        }
    }, [isEnabled]);

    return {
        isSoundEnabled: isEnabled,
        toggleSound,
        playSound
    };
};
