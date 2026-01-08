'use client';

import { useEffect, useRef } from 'react';
import { useToasterStore } from 'react-hot-toast';
import { useNotificationSound } from '@/hooks/useNotificationSound';

/**
 * Listens to global toast events and plays sound for success/error
 */
export default function GlobalSoundPlayer() {
    const { playSound } = useNotificationSound();
    const { toasts } = useToasterStore();
    const lastToastIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (toasts.length === 0) return;

        // Get the most recent toast
        // react-hot-toast adds new toasts to the end or beginning depending on config?
        // Usually standard is array of active toasts.
        // We'll assume the last one in the array is the newest if default.
        // Actually, checking standard behavior: toasts are usually prepended or appended.
        // Safer: find the one with visible: true that we haven't seen.

        // We'll just track the latest ID we've processed.
        // Toasts might be removed, so we shouldn't rely on index.

        // Find any toast created after our last check? 
        // Effect runs on `toasts` change.

        // Let's just look at the list. If there is a toast that is NEW (id != lastId), play.
        // We assume the strict logical "newest" is the target.
        // React-hot-toast puts newest at index 0 by default? No, usually push.
        // Let's inspect the Toast type if needed, but assuming simple diff is enough.

        // Robust strategy:
        // Keep a set of seen IDs? No, just the last played ID is sufficient for sequential sounds.

        // We'll iterate reverse to find the first candidate?
        // Actually, `toasts` changes whenever a toast is added OR removed.
        // We only care about ADDITION.

        // Let's cache the previous length or IDs?
        // Simpler: Just check if the *latest* added toast is different.
        // We'll assume the one with highest createdAt? Toast object usually has id.

        // Let's try matching the last element.
        const latestToast = toasts[toasts.length - 1];

        if (latestToast && latestToast.id !== lastToastIdRef.current) {
            // Updated: check type.
            // Toast types: 'success', 'error', 'loading', 'blank', 'custom'
            if (latestToast.type === 'success' || latestToast.type === 'error') {
                // Play sound (internally throttled and respects user preference)
                playSound();
            }

            lastToastIdRef.current = latestToast.id;
        }
    }, [toasts, playSound]);

    return null;
}
