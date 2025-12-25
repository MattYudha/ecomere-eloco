// *********************
// Role of the component: Highlight search keywords in text
// Name of the component: HighlightText.tsx
// Developer: Eloco E-commerce Team
// Version: 1.0 - Secure with RegExp escaping
// Component call: <HighlightText text={product.title} query={searchQuery} />
// Input parameters: { text: string, query: string }
// Output: Text with highlighted keywords
// *********************

import React from 'react';

interface HighlightTextProps {
    text: string;
    query: string;
}

// ✅ SECURITY: Escape RegExp special characters to prevent crashes
const escapeRegExp = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const HighlightText: React.FC<HighlightTextProps> = ({ text, query }) => {
    // Guard: Don't highlight if query is empty or too short
    if (!query || query.trim().length < 2) {
        return <>{text}</>;
    }

    try {
        // ✅ Safe RegExp with escaped query
        const safeQuery = escapeRegExp(query.trim());
        const parts = text.split(new RegExp(`(${safeQuery})`, 'gi'));

        return (
            <>
                {parts.map((part, index) =>
                    part.toLowerCase() === query.trim().toLowerCase() ? (
                        <mark
                            key={index}
                            className="bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded font-semibold text-gray-900 dark:text-white"
                        >
                            {part}
                        </mark>
                    ) : (
                        <span key={index}>{part}</span>
                    )
                )}
            </>
        );
    } catch (error) {
        // ✅ Fallback if RegExp fails (should never happen with escaping)
        console.error('Highlight error:', error);
        return <>{text}</>;
    }
};

export default HighlightText;
