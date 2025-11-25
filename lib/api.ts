import config from './config';

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

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || ({} as Record<string, string>)),
      },
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
