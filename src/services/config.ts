export const API_CONFIG = {
  BASE_URL: import.meta.env.PROD
    ? 'https://law-calendar.vercel.app'
    : '',
  ACUITY: {
    BASE_URL: 'https://acuityscheduling.com/api/v1',
    API_KEY: import.meta.env.ACUITY_API_KEY,
    USER_ID: import.meta.env.ACUITY_USER_ID,
    APPOINTMENT_TYPE: import.meta.env.APPOINTMENT_TYPE
  }
};