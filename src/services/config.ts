export const API_CONFIG = {
  BASE_URL: '/.netlify/functions',
  ACUITY: {
    BASE_URL: 'https://acuityscheduling.com/api/v1/availability',
    API_KEY: import.meta.env.ACUITY_API_KEY,
    USER_ID: import.meta.env.ACUITY_USER_ID,
    APPOINTMENT_TYPE: import.meta.env.APPOINTMENT_TYPE
  }
};