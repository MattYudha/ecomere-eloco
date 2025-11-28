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

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Token ONLY applied if passed manually
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const defaultOptions: RequestInit = {
      headers: defaultHeaders,
      credentials: 'include',
    };

    return fetch(url, { ...defaultOptions, ...options });
  },

  // Convenience methods
  get: (endpoint: string, options?: RequestInit, token?: string) =>
    apiClient.request(endpoint, { ...options, method: 'GET' }, token),

  post: (endpoint: string, data?: any, options?: RequestInit, token?: string) =>
    apiClient.request(
      endpoint,
      { ...options, method: 'POST', body: data ? JSON.stringify(data) : undefined },
      token
    ),

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
