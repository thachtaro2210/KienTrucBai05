import axios from 'axios';
import SERVICE_CONFIG from './serviceConfig';

/**
 * Factory that creates a pre-configured Axios instance for a given service.
 * - Sets base URL
 * - Attaches Authorization header if JWT token is in localStorage
 * - Normalises error responses
 */
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10_000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /* ── Request Interceptor ─────────────────────────────────────── */
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  /* ── Response Interceptor ────────────────────────────────────── */
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid — clear storage and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

/* ── Named Axios instances per service ──────────────────────────── */
export const userAxios    = createAxiosInstance(`${SERVICE_CONFIG.USER_SERVICE}/api/v1`);
export const foodAxios    = createAxiosInstance(`${SERVICE_CONFIG.FOOD_SERVICE}/api/v1`);
export const orderAxios   = createAxiosInstance(`${SERVICE_CONFIG.ORDER_SERVICE}/api/v1`);
export const paymentAxios = createAxiosInstance(`${SERVICE_CONFIG.PAYMENT_SERVICE}/api/v1`);
