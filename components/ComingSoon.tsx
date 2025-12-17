import React from 'react';

const ComingSoon = ({ title }: { title: string }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{title}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    This page is currently under construction. Please check back later!
                </p>
                <a href="/" className="mt-6 inline-block px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition">
                    Return Home
                </a>
            </div>
        </div>
    );
};

export default ComingSoon;
