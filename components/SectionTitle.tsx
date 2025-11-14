// *********************
// Role of the component: Modern section title with liquid glass effect
// Name of the component: SectionTitle.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 3.0
// Component call: <SectionTitle />
// Input parameters: {title: string; path: string}
// Output: Modern section header with glassmorphism and elegant typography
// *********************

import React from 'react';

const SectionTitle = ({ title, path }: { title: string; path: string }) => {
  // Split path for breadcrumb effect
  const pathParts = path.split('|').map((part) => part.trim());

  return (
    <div className="relative h-[200px] pt-16 mb-8 max-sm:h-[150px] max-sm:pt-12 overflow-hidden">
      {/* Animated gradient background with depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950"></div>

      {/* Animated mesh gradient overlay for dynamic effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Liquid glass overlay - creates the frosted glass effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30"></div>

      {/* Noise texture overlay for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      ></div>

      {/* Elegant top border with gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-700 to-transparent"></div>

      {/* Floating decorative elements */}
      <div className="absolute top-8 left-8 w-32 h-32 border border-indigo-200 dark:border-indigo-700 rounded-full animate-pulse"></div>
      <div
        className="absolute bottom-8 right-8 w-24 h-24 border border-purple-200 dark:border-purple-700 rounded-full animate-pulse"
        style={{ animationDelay: '1s' }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center max-w-7xl mx-auto px-4">
        {/* Breadcrumb Path with glass effect */}
        <div className="flex items-center gap-2 mb-4 max-sm:mb-2">
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 px-4 py-2 rounded-full border border-white/50 dark:border-gray-600/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white/70 dark:hover:bg-gray-700/70 cursor-pointer max-sm:text-[10px] max-sm:px-3 max-sm:py-1.5">
                {part}
              </span>
              {index < pathParts.length - 1 && (
                <svg
                  className="w-4 h-4 text-indigo-400 dark:text-indigo-600 max-sm:w-3 max-sm:h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Title with premium typography */}
        <div className="relative">
          {/* Glow effect behind text */}
          <div className="absolute inset-0 blur-xl opacity-30">
            <h1 className="text-6xl font-bold text-center max-md:text-5xl max-sm:text-3xl text-indigo-600 dark:text-indigo-400">
              {title}
            </h1>
          </div>

          {/* Main title with gradient */}
          <h1 className="relative text-6xl font-bold text-center max-md:text-5xl max-sm:text-3xl tracking-tight leading-tight">
            <span
              className="text-yellow-500 dark:text-yellow-300 drop-shadow-lg"
              style={{
                fontFamily:
                  '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </span>
          </h1>
        </div>

        {/* Decorative underline with animation */}
        <div className="mt-4 flex items-center gap-2 max-sm:mt-2">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-400 dark:to-indigo-600 max-sm:w-6"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-600 animate-pulse"></div>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-indigo-400 dark:to-indigo-600 max-sm:w-6"></div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/50 dark:from-gray-900/50 to-transparent"></div>

      {/* Elegant bottom border with gradient */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-700 to-transparent"></div>
    </div>
  );
};

export default SectionTitle;
