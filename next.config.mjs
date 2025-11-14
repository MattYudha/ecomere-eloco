/** @type {import('next').NextConfig} */
// Ambil hostname dari environment variable
const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL)
  : null;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: backendUrl ? backendUrl.protocol.replace(':', '') : 'http',
        hostname: backendUrl ? backendUrl.hostname : 'localhost',
        port: backendUrl ? backendUrl.port : '3001', // Corrected port
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default nextConfig;