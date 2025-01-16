import { AcuityConfig } from './types';

export const ACUITY_TIMEOUT = 15000; // 15 seconds
const VERCEL_API_URL = 'https://law-calendar-main-main.onrender.com/api';

export const acuityConfig: AcuityConfig = {
  baseUrl: import.meta.env.PROD ? VERCEL_API_URL : '/api',
  timeout: ACUITY_TIMEOUT,
  retries: 2,
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  }
};
