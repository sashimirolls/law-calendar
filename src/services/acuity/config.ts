import { AcuityConfig } from './types';

export const ACUITY_TIMEOUT = 15000; // 15 seconds

export const acuityConfig: AcuityConfig = {
  baseUrl: import.meta.env.PROD ? '/.netlify/functions' : '/api',
  timeout: ACUITY_TIMEOUT,
  retries: 2,
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  }
};