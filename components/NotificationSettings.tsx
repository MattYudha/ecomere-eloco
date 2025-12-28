'use client';

import { useNotificationSound } from '@/hooks/useNotificationSound';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export default function NotificationSettings() {
    const { isSoundEnabled, toggleSound, playSound } = useNotificationSound();

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isSoundEnabled ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                    {isSoundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                </div>
                <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Notification Sound</h3>
                    <p className="text-sm text-gray-500">Play a sound when you receive a new notification</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isSoundEnabled && (
                    <button
                        onClick={() => playSound()}
                        className="text-xs text-orange-600 hover:text-orange-700 font-medium underline px-2 transition-colors"
                        title="Test notification sound"
                    >
                        Test Sound
                    </button>
                )}

                <button
                    onClick={toggleSound}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isSoundEnabled ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    role="switch"
                    aria-checked={isSoundEnabled}
                    aria-label="Toggle notification sound"
                >
                    <span
                        className={`${isSoundEnabled ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </button>
            </div>
        </div>
    );
}
