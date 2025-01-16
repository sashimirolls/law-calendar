export const API_CONFIG = {
  BASE_URL: import.meta.env.PROD 
    ? 'https://law-calendar-main-main.onrender.com/api'
    : 'http://localhost:3001/api',
  ACUITY: {
    BASE_URL: import.meta.env.PROD 
      ? 'https://law-calendar-main-main.onrender.com/api'
      : 'http://localhost:3001/api',
    API_KEY: import.meta.env.ACUITY_API_KEY,
    USER_ID: import.meta.env.ACUITY_USER_ID,
    APPOINTMENT_TYPE: import.meta.env.APPOINTMENT_TYPE
  },

  startDate: 30, //startinng date range
  endDate: 181,  // ending date range
};
