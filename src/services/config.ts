export const API_CONFIG = {
  BASE_URL: import.meta.env.PROD 
    ? '/.netlify/functions'
    : '/api',
  ACUITY: {
    BASE_URL: '/.netlify/functions',
    API_KEY: import.meta.env.ACUITY_API_KEY,
    USER_ID: import.meta.env.ACUITY_USER_ID,
    APPOINTMENT_TYPE: import.meta.env.APPOINTMENT_TYPE
  }
};