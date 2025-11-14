import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { TbError404 } from 'react-icons/tb';

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-4">
      <div className="relative w-full max-w-lg p-8 sm:p-12 rounded-3xl backdrop-blur-md bg-white/10 dark:bg-gray-800/30 shadow-2xl border border-white/20 dark:border-gray-700/50 text-center overflow-hidden">
        
        {/* Icon background */}
        <div className="absolute -top-10 -left-10 text-gray-300/10 dark:text-gray-500/10 transform rotate-12">
          <TbError404 size={250} />
        </div>
        <div className="absolute -bottom-12 -right-12 text-gray-300/10 dark:text-gray-500/10 transform -rotate-12">
          <TbError404 size={250} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Main 404 Text */}
          <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-grilli-gold to-yellow-300 dark:from-grilli-gold dark:to-yellow-500 drop-shadow-lg">
            404
          </h1>

          {/* Subtitle */}
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Page Not Found
          </h2>

          {/* Message */}
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
          </p>

          {/* Home Button */}
          <Link href="/" passHref>
            <button className="mt-8 inline-flex items-center gap-2 bg-grilli-gold/80 hover:bg-grilli-gold text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
              <FaHome />
              <span>Go back to Homepage</span>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
