import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoSaveFormOptions {
    key: string; // localStorage key
    debounceMs?: number; // Debounce delay (default: 2000ms)
    enabled?: boolean; // Enable/disable auto-save (default: true)
}

interface UseAutoSaveFormReturn<T> {
    formData: T;
    setFormData: (data: T | ((prev: T) => T)) => void;
    updateField: (fieldName: keyof T, value: any) => void;
    clearSaved: () => void;
    isSaving: boolean;
    lastSaved: Date | null;
}

/**
 * Custom hook for auto-saving form data to localStorage
 * 
 * @example
 * const { formData, setFormData, updateField, clearSaved, isSaving, lastSaved } = useAutoSaveForm({
 *   key: 'checkout-form',
 *   debounceMs: 2000,
 * });
 */
export function useAutoSaveForm<T extends Record<string, any>>(
    initialData: T,
    options: UseAutoSaveFormOptions
): UseAutoSaveFormReturn<T> {
    const {
        key,
        debounceMs = 2000,
        enabled = true,
    } = options;

    const [formData, setFormDataState] = useState<T>(() => {
        // Try to restore from localStorage on mount
        if (typeof window === 'undefined' || !enabled) return initialData;

        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log(`📂 Restored form data from localStorage: ${key}`);
                return { ...initialData, ...parsed.data };
            }
        } catch (error) {
            console.error('Failed to restore form data:', error);
        }

        return initialData;
    });

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced save to localStorage
    const saveToLocalStorage = useCallback(
        (data: T) => {
            if (!enabled || typeof window === 'undefined') return;

            // Clear existing timeout
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            setIsSaving(true);

            // Set new timeout
            saveTimeoutRef.current = setTimeout(() => {
                try {
                    const saveData = {
                        data,
                        timestamp: new Date().toISOString(),
                    };
                    localStorage.setItem(key, JSON.stringify(saveData));
                    setLastSaved(new Date());
                    console.log(`💾 Auto-saved form data: ${key}`);
                } catch (error) {
                    console.error('Failed to save form data:', error);
                } finally {
                    setIsSaving(false);
                }
            }, debounceMs);
        },
        [key, debounceMs, enabled]
    );

    // Save whenever formData changes
    useEffect(() => {
        saveToLocalStorage(formData);

        // Cleanup timeout on unmount
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [formData, saveToLocalStorage]);

    // Custom setFormData that triggers save
    const setFormData = useCallback(
        (data: T | ((prev: T) => T)) => {
            setFormDataState(data);
        },
        []
    );

    // Convenience method to update a single field
    const updateField = useCallback(
        (fieldName: keyof T, value: any) => {
            setFormDataState((prev) => ({
                ...prev,
                [fieldName]: value,
            }));
        },
        []
    );

    // Clear saved data from localStorage
    const clearSaved = useCallback(() => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem(key);
            setLastSaved(null);
            console.log(`🗑️ Cleared saved form data: ${key}`);
        } catch (error) {
            console.error('Failed to clear saved form data:', error);
        }
    }, [key]);

    return {
        formData,
        setFormData,
        updateField,
        clearSaved,
        isSaving,
        lastSaved,
    };
}
