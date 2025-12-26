const config = {
  apiBaseUrl: process.env.NODE_ENV === 'development'
    ? (typeof window === 'undefined' ? 'http://localhost:3001' : '') // Server: direct to Backend(3001). Client: relative(proxy).
    : (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ecomere-eloco-production.up.railway.app'),
  nextAuthUrl: process.env.NEXTAUTH_URL || 'https://ecomere-eloco-production.up.railway.app',
};

export default config;
