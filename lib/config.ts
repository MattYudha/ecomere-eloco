const config = {
  apiBaseUrl: process.env.NODE_ENV === 'development'
    ? '' // Use relative path in dev to trigger Next.js proxy (rewrites)
    : (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://eloco.up.railway.app'),
  nextAuthUrl: process.env.NEXTAUTH_URL || 'https://eloco.up.railway.app',
};

export default config;
