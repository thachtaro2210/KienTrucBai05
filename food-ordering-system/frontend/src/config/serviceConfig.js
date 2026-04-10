/**
 * Service endpoint configuration.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  For LOCAL development: keep localhost URLs below                    │
 * │  For LAN deployment: replace localhost with each machine's IP        │
 * │                                                                      │
 * │  Example LAN:                                                        │
 * │    USER_SERVICE_URL   = 'http://192.168.1.101:8081'                  │
 * │    FOOD_SERVICE_URL   = 'http://192.168.1.102:8082'                  │
 * │    ORDER_SERVICE_URL  = 'http://192.168.1.103:8083'                  │
 * │    PAYMENT_SERVICE_URL= 'http://192.168.1.104:8084'                  │
 * │                                                                      │
 * │  Or use environment variables via .env file:                         │
 * │    VITE_USER_SERVICE_URL=http://...                                  │
 * └──────────────────────────────────────────────────────────────────────┘
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
