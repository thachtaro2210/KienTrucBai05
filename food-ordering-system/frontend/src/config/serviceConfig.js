/**
 * Service endpoint configuration.
 * Priority:
 * 1) VITE_*_SERVICE_URL per service
 * 2) VITE_API_BASE_URL shared gateway base
 * 3) Auto-detect from current browser host -> "<protocol>//<host>:8080"
 */
const DEFAULT_GATEWAY_BASE = (() => {
  const explicitBase = import.meta.env.VITE_API_BASE_URL;
  if (explicitBase) return explicitBase;

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const protocol = window.location.protocol || 'http:';
    return `${protocol}//${window.location.hostname}:8080`;
  }

  return 'http://localhost:8080';
})();

const resolveServiceBase = (envValue) => envValue || DEFAULT_GATEWAY_BASE;

const SERVICE_CONFIG = {
  USER_SERVICE: resolveServiceBase(import.meta.env.VITE_USER_SERVICE_URL),
  FOOD_SERVICE: resolveServiceBase(import.meta.env.VITE_FOOD_SERVICE_URL),
  ORDER_SERVICE: resolveServiceBase(import.meta.env.VITE_ORDER_SERVICE_URL),
  PAYMENT_SERVICE: resolveServiceBase(import.meta.env.VITE_PAYMENT_SERVICE_URL),
};

export default SERVICE_CONFIG;
