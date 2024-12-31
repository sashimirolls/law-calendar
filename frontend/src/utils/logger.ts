// Centralized logging utility
export const Logger = {
  debug: (component: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.debug(`[${timestamp}] [${component}] ${message}`, data ? data : '');
  },
  error: (component: string, message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${component}] ${message}`, error ? error : '');
  },
  warn: (component: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [${component}] ${message}`, data ? data : '');
  },
  info: (component: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] [${component}] ${message}`, data ? data : '');
  }
};