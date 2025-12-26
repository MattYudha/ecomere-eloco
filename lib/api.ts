import config from './config';

export const apiClient = {
  baseUrl: config.apiBaseUrl,

  async request(endpoint: string, options: RequestInit = {}, token?: string) {
    let url: string;

    // Determine full URL
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      url = endpoint;
    } else {
      url = `${this.baseUrl}${endpoint}`;
    }

    const isFormData = options.body instanceof FormData;

    const defaultHeaders: Record<string, string> = {
      // Only set JSON content type if it's NOT FormData
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers as Record<string, string> || {}),
    };

    // Token logic:
    // 1. Manually passed token takes precedence
    // 2. Fallback to localStorage 'auth_token' (Browser only)
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        defaultHeaders['Authorization'] = `Bearer ${storedToken}`;
      }
    }

    const defaultOptions: RequestInit = {
      credentials: 'include', // ALWAYS include credentials for CORS
    };

    // Merge headers carefully: Default (Auth) + Custom
    const finalHeaders = { ...defaultHeaders, ...(options.headers || {}) };

    return fetch(url, {
      ...defaultOptions,
      ...options,
      headers: finalHeaders
    });
  },

  // Convenience methods
  get: (endpoint: string, options?: RequestInit, token?: string) =>
    apiClient.request(endpoint, { ...options, method: 'GET' }, token),

  post: (endpoint: string, data?: any, options?: RequestInit, token?: string) => {
    const isFormData = data instanceof FormData;
    return apiClient.request(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
        headers: {
          ...options?.headers,
          // IMPORTANT: Do NOT set Content-Type for FormData (browser sets boundary)
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        }
      },
      token
    );
  },

  put: (endpoint: string, data?: any, options?: RequestInit, token?: string) =>
    apiClient.request(
      endpoint,
      { ...options, method: 'PUT', body: data ? JSON.stringify(data) : undefined },
      token
    ),

  delete: (endpoint: string, options?: RequestInit, token?: string) =>
    apiClient.request(endpoint, { ...options, method: 'DELETE' }, token),
};

export default apiClient;
