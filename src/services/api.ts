import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add interceptor to prevent caching
api.interceptors.request.use((config) => {
  // Add no-cache headers to all requests
  config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  config.headers['Pragma'] = 'no-cache';
  config.headers['Expires'] = '0';
  
  // Add timestamp to prevent caching
  config.params = config.params || {};
  config.params._t = Date.now();
  
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or invalid
      console.log('Session expired');
    }
    return Promise.reject(error);
  }
);