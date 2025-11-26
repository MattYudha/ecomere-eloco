import config from './config';
import { getSession } from 'next-auth/react'; // Import getSession

export const apiClient = {
  baseUrl: config.apiBaseUrl,

  async request(endpoint: string, options: RequestInit = {}) {
    let url: string;

    // Determine the full URL for the request
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      // If the endpoint is already an absolute URL, use it directly
      url = endpoint;
    } else {
      // For relative endpoints, prepend the base API URL
      // This ensures all API calls through apiClient go to the configured backend
      url = `${this.baseUrl}${endpoint}`;
    }

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || ({} as Record<string, string>)),
    };

    // Dynamically add Authorization header if session and access token exist
    const session = await getSession();
    if (session && (session as any).accessToken) { // Cast to 'any' to access accessToken
      defaultHeaders['Authorization'] = `Bearer ${(session as any).accessToken}`;
    }

    const defaultOptions: RequestInit = {
      headers: defaultHeaders,
      credentials: 'include', // Ensure cookies are sent with the request
    };

    return fetch(url, { ...defaultOptions, ...options });
  },

  // Convenience methods
  get: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
