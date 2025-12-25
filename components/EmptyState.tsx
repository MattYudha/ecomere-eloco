import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
    variant?: 'cart' | 'wishlist' | 'search' | 'orders';
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    variant = 'cart',
    title,
    description,
    actionLabel,
    actionHref,
    icon,
}) => {
    // Color themes for each variant
    const variantColors = {
        cart: {
            bg: 'from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20',
            iconBg: 'bg-orange-100 dark:bg-orange-900/30',
            button: 'bg-grilli-gold hover:bg-grilli-gold/90 text-white',
            accent: 'text-orange-500',
        },
        wishlist: {
            bg: 'from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20',
            iconBg: 'bg-pink-100 dark:bg-pink-900/30',
            button: 'bg-grilli-gold hover:bg-grilli-gold/90 text-white',
            accent: 'text-pink-500',
        },
        search: {
            bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            button: 'bg-orange-500 hover:bg-orange-600 text-white',
            accent: 'text-blue-500',
        },
        orders: {
            bg: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
            iconBg: 'bg-purple-100 dark:bg-purple-900/30',
            button: 'bg-pink-500 hover:bg-pink-600 text-white',
            accent: 'text-purple-500',
        },
    };

    const colors = variantColors[variant];

    // Default SVG icons if no custom icon provided
    const defaultIcons = {
        cart: (
            <svg
                className="w-full h-full"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Decorative circles */}
                <circle cx="40" cy="40" r="20" fill="#FCD34D" opacity="0.3" />
                <circle cx="160" cy="50" r="15" fill="#DCCA87" opacity="0.4" />
                <circle cx="150" cy="160" r="18" fill="#FCA5A5" opacity="0.3" />

                {/* Box */}
                <rect x="60" y="80" width="80" height="70" fill="#FFA500" rx="4" />
                <path d="M60 80 L100 50 L140 80" fill="#FFB84D" />
                <rect x="60" y="80" width="80" height="10" fill="#FF8C00" />

                {/* Cute face */}
                <circle cx="85" cy="115" r="4" fill="#FFF" />
                <circle cx="115" cy="115" r="4" fill="#FFF" />
                <path
                    d="M 85 130 Q 100 140 115 130"
                    stroke="#FFF"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>
        ),
        wishlist: (
            <svg
                className="w-full h-full"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Decorative elements */}
                <circle cx="30" cy="30" r="3" fill="#FCD34D" />
                <circle cx="170" cy="40" r="3" fill="#FCA5A5" />
                <path d="M160 150 L170 140" stroke="#DCCA87" strokeWidth="2" />
                <path d="M40 160 L30 170" stroke="#FCA5A5" strokeWidth="2" />

                {/* Document */}
                <rect x="60" y="40" width="80" height="120" fill="#FFF7ED" rx="4" />
                <rect x="60" y="40" width="80" height="15" fill="#FFEDD5" rx="4" />

                {/* Lines on document */}
                <line x1="75" y1="70" x2="125" y2="70" stroke="#D1D5DB" strokeWidth="2" />
                <line x1="75" y1="85" x2="115" y2="85" stroke="#D1D5DB" strokeWidth="2" />
                <line x1="75" y1="100" x2="120" y2="100" stroke="#D1D5DB" strokeWidth="2" />

                {/* Heart */}
                <path
                    d="M100 130 L110 120 Q115 115 115 110 Q115 105 110 105 Q105 105 100 110 Q95 105 90 105 Q85 105 85 110 Q85 115 90 120 Z"
                    fill="#FF6B6B"
                />
            </svg>
        ),
        search: (
            <svg
                className="w-full h-full"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Decorative elements */}
                <circle cx="170" cy="30" r="5" fill="#FCD34D" opacity="0.6" />
                <text x="30" y="40" fontSize="20" fill="#FCA5A5" opacity="0.6">
                    ×
                </text>
                <text x="160" y="170" fontSize="20" fill="#DCCA87" opacity="0.6">
                    +
                </text>

                {/* Large circle background */}
                <circle cx="100" cy="100" r="60" fill="#FCD34D" opacity="0.2" />

                {/* Folder */}
                <path
                    d="M60 80 L60 140 L140 140 L140 90 L120 90 L110 80 Z"
                    fill="#DCCA87"
                />
                <rect x="60" y="90" width="80" height="5" fill="#C9B772" />

                {/* Sad face */}
                <circle cx="90" cy="110" r="3" fill="#8B7335" />
                <circle cx="110" cy="110" r="3" fill="#8B7335" />
                <path
                    d="M 85 125 Q 100 120 115 125"
                    stroke="#8B7335"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>
        ),
        orders: (
            <svg
                className="w-full h-full"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Sparkles */}
                <circle cx="40" cy="60" r="3" fill="#FCD34D" />
                <circle cx="160" cy="70" r="3" fill="#FCA5A5" />
                <circle cx="50" cy="150" r="3" fill="#C4B5FD" />

                {/* Gift box */}
                <rect x="70" y="100" width="60" height="60" fill="#EC4899" rx="4" />

                {/* Ribbon vertical */}
                <rect x="95" y="100" width="10" height="60" fill="#DB2777" />

                {/* Ribbon horizontal */}
                <rect x="70" y="125" width="60" height="10" fill="#DB2777" />

                {/* Bow */}
                <ellipse cx="85" cy="95" rx="15" ry="8" fill="#F472B6" />
                <ellipse cx="115" cy="95" rx="15" ry="8" fill="#F472B6" />
                <circle cx="100" cy="95" r="6" fill="#EC4899" />

                {/* Small hearts */}
                <path
                    d="M140 40 L145 35 Q147 33 147 31 Q147 29 145 29 Q143 29 140 32 Q137 29 135 29 Q133 29 133 31 Q133 33 135 35 Z"
                    fill="#FCA5A5"
                />
            </svg>
        ),
    };

    return (
        <div className={`min-h-[400px] flex items-center justify-center p-8 animate-fadeIn`}>
            <div className="max-w-md w-full text-center relative">
                {/* Decorative background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-30 -z-10 rounded-3xl blur-2xl`}></div>

                {/* Icon container */}
                <div className="relative mb-8 z-10">
                    {/* Decorative floating shapes */}
                    <div className="absolute top-0 left-1/4 w-3 h-3 bg-yellow-300 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-10 right-1/4 w-2 h-2 bg-orange-300 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-0 left-1/3 w-2.5 h-2.5 bg-pink-300 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

                    {/* Main icon */}
                    <div className={`mx-auto w-48 h-48 ${colors.iconBg} rounded-3xl p-6 shadow-lg transform transition-transform hover:scale-105`}>
                        {icon || defaultIcons[variant]}
                    </div>
                </div>

                {/* Content */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 relative z-10">
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg relative z-10">
                    {description}
                </p>

                {/* CTA Button */}
                {actionLabel && actionHref && (
                    <Link href={actionHref}>
                        <button
                            className={`${colors.button} px-8 py-3 rounded-full font-semibold text-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50 relative z-10`}
                        >
                            {actionLabel}
                        </button>
                    </Link>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default EmptyState;
