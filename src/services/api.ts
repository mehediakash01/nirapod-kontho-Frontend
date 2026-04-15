import axios from 'axios';

const normalizedApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');
const isLocalFrontendHost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const isVercelProdFrontend =
  typeof window !== 'undefined' &&
  window.location.hostname === 'nirapod-kontho-frontend.vercel.app';
const localFallbackApiUrl = 'http://localhost:5000/api';
const productionFallbackApiUrl = 'https://nirapod-kontho-backend.vercel.app/api';
const resolvedBaseURL =
  normalizedApiUrl ||
  (isVercelProdFrontend
    ? productionFallbackApiUrl
    : isLocalFrontendHost
      ? localFallbackApiUrl
      : '/api');

export const api = axios.create({
  baseURL: resolvedBaseURL,
  withCredentials: true,
});

// Add a timestamp query param to bypass stale intermediary caches
api.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params._t = Date.now();
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error.config?.url || '');
    const isSessionProbe =
      requestUrl.includes('/oauth/session') || requestUrl.includes('/auth/session');

    if (error.response?.status === 401 && !isSessionProbe) {
      // Session expired or invalid
      console.log('Session expired');
    }
    return Promise.reject(error);
  }
);
