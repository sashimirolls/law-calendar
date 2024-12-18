import { AcuityConfig } from './types';

export const acuityConfig: AcuityConfig = {
  baseUrl: '/api',  // This will work for both development and production
  apiKey: import.meta.env.ACUITY_API_KEY || '',
  userId: import.meta.env.ACUITY_USER_ID || '',
  appointmentType: import.meta.env.APPOINTMENT_TYPE || ''
};