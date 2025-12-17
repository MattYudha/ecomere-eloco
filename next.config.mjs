/** @type {import('next').NextConfig} */
// Ambil hostname dari environment variable
const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL)
  : null;

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eloco.up.railway.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: backendUrl ? backendUrl.protocol.replace(':', '') : 'http',
        hostname: backendUrl ? backendUrl.hostname : 'localhost',
        port: backendUrl ? backendUrl.port : '3001', // Corrected port
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001/api/:path*' // Proxy to Backend in Dev
          : 'https://eloco.up.railway.app/api/:path*', // Default fallback (or keep relative if deployed together)
      },
    ];
  },
};

export default nextConfig;
