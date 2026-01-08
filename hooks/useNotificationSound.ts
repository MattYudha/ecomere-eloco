import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotificationStore } from '@/app/_zustand/notificationStore';

// Removed file dependency to solve "NotSupportedError"
// const SOUND_FILE = '/sounds/notification.mp3';
const THROTTLE_MS = 3000;

// Singleton AudioContext to bypass autoplay restrictions
let globalAudioContext: AudioContext | null = null;

export const useNotificationSound = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const lastPlayedRef = useRef<number>(0);
    const setStoreSoundEnabled = useNotificationStore((state) => state.setSoundEnabled);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem('notificationSound');
        const enabled = stored === 'true';
        setIsEnabled(enabled);
        setStoreSoundEnabled(enabled);
    }, [setStoreSoundEnabled]);

    const getContext = useCallback(() => {
        if (!globalAudioContext) {
            // @ts-ignore - for legacy browsers
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                globalAudioContext = new AudioContext();
            }
        }
        return globalAudioContext;
    }, []);

    const playBeep = useCallback(() => {
        try {
            const ctx = getContext();
            if (!ctx) return;

            // Important: Resume context if suspended (requires user interaction first typically, 
            // but we call this on toggle so it should be unlocked)
            if (ctx.state === 'suspended') {
                ctx.resume().catch(e => console.error('[SOUND] Resume failed', e));
            }

            const now = ctx.currentTime;

            // Oscillator 1 (Fundamental - The body of the bell)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(784, now); // G5 (Standard Desk Bell Pitch)
            osc1.connect(gain1);
            gain1.connect(ctx.destination);

            // Envelope 1 (Sharp metallic strike)
            gain1.gain.setValueAtTime(0, now);
            gain1.gain.linearRampToValueAtTime(0.4, now + 0.005); // Instant attack
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 1.2); // Long metallic decay

            // Oscillator 2 (Overtone - The "Clang")
            // Bells have inharmonic partials. ~2.6x is satisfying for small bells
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'triangle'; // Brighter texture
            osc2.frequency.setValueAtTime(784 * 2.6, now);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            // Envelope 2 (Short ringing)
            gain2.gain.setValueAtTime(0, now);
            gain2.gain.linearRampToValueAtTime(0.1, now + 0.005);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3); // Decays faster than fundamental

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 1.5);
            osc2.stop(now + 1.5);
        } catch (e) {
            console.error('[SOUND] AudioContext error:', e);
        }
    }, [getContext]);

    const toggleSound = useCallback(() => {
        setIsEnabled((prev) => {
            const newValue = !prev;
            localStorage.setItem('notificationSound', String(newValue));
            setStoreSoundEnabled(newValue);

            if (newValue) {
                // This user interaction unlocks the audio context
                playBeep();
            }

            return newValue;
        });
    }, [setStoreSoundEnabled, playBeep]);

    const playSound = useCallback(async () => {
        if (!isEnabled) return;

        // Note: Removed document.hidden check to allow background sounds if browser permits
        // However, browsers usually throttle background tabs.

        const now = Date.now();
        if (now - lastPlayedRef.current < THROTTLE_MS) {
            console.log('[SOUND] Throttled');
            return;
        }

        playBeep();
        lastPlayedRef.current = now;
        console.log('[SOUND] Played (Generated)');
    }, [isEnabled, playBeep]);

    return {
        isSoundEnabled: isEnabled,
        toggleSound,
        playSound
    };
};
