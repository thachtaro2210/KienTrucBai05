/**
 * Service endpoint configuration.
 * Default gateway is hardcoded for current deployment and can be overridden
 * by VITE_*_SERVICE_URL build-time environment variables.
 */
const DEFAULT_GATEWAY_BASE = (() => {
  return 'http://52.42.169.250:8080';
})();

const resolveServiceBase = (envValue) => envValue || DEFAULT_GATEWAY_BASE;

const SERVICE_CONFIG = {
  USER_SERVICE: resolveServiceBase(import.meta.env.VITE_USER_SERVICE_URL),
  FOOD_SERVICE: resolveServiceBase(import.meta.env.VITE_FOOD_SERVICE_URL),
  ORDER_SERVICE: resolveServiceBase(import.meta.env.VITE_ORDER_SERVICE_URL),
  PAYMENT_SERVICE: resolveServiceBase(import.meta.env.VITE_PAYMENT_SERVICE_URL),
};

export default SERVICE_CONFIG;
