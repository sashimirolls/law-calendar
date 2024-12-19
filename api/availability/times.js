import axios from 'axios';
import { corsHeaders, sendResponse } from '../utils/response';

const ACUITY_TIMEOUT = 15000; // 15 seconds

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, {});
  }

  console.log('[Vercel:Times] Environment check:', {
    hasApiKey: !!process.env.ACUITY_API_KEY,
    hasUserId: !!process.env.ACUITY_USER_ID,
    hasAppointmentType: !!process.env.APPOINTMENT_TYPE,
    requestPath: req.url,
    requestMethod: req.method
  });

  const { date, calendarID } = req.query;

  if (!date || !calendarID) {
    console.error('[Vercel:Times] Missing parameters:', { date, calendarID });
    return sendResponse(res, 400, { error: 'Missing required parameters' });
  }

  if (!process.env.ACUITY_API_KEY || !process.env.ACUITY_USER_ID) {
    console.error('[Vercel:Times] Missing credentials');
    return sendResponse(res, 500, { error: 'Missing API credentials' });
  }

  const requestStart = Date.now();

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Vercel:Times] Request details:', {
      url: 'https://acuityscheduling.com/api/v1/availability/times',
      calendarID,
      date,
      appointmentTypeID: process.env.APPOINTMENT_TYPE,
      auth: auth.slice(-10) // Show last 10 chars of auth for debugging
    });

    const response = await axios({
      method: 'GET',
      url: 'https://acuityscheduling.com/api/v1/availability/times',
      timeout: ACUITY_TIMEOUT,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      params: {
        date,
        calendarID,
        appointmentTypeID: process.env.APPOINTMENT_TYPE
      }
    });

    console.log('[Vercel:Times] Success:', {
      status: response.status,
      dataLength: response.data?.length || 0,
      responseTime: Date.now() - requestStart
    });
    return sendResponse(res, 200, response.data);
  } catch (error) {
    console.error('[Vercel:Times] Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data || error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        headers: error.config?.headers,
        params: error.config?.params
      },
      responseTime: Date.now() - requestStart
    });

    return sendResponse(res, error.response?.status || 500, {
      error: 'Failed to fetch available times',
      details: error.response?.data || error.message
    });
  }
}