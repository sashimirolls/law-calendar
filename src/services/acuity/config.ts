import { AcuityConfig } from './types';

export const acuityConfig: AcuityConfig = {
  baseUrl: import.meta.env.PROD 
    ? 'https://law-calendar.vercel.app/api'
    : '/api',
  apiKey: import.meta.env.ACUITY_API_KEY || '',
  userId: import.meta.env.ACUITY_USER_ID || '',
  appointmentType: import.meta.env.APPOINTMENT_TYPE || ''
};