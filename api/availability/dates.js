import axios from 'axios';

const ACUITY_TIMEOUT = 15000; // 15 seconds

export default async function handler(req, res) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-cache'
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  console.log('[Vercel:Dates] Environment check:', {
    hasApiKey: !!process.env.ACUITY_API_KEY,
    hasUserId: !!process.env.ACUITY_USER_ID,
    hasAppointmentType: !!process.env.APPOINTMENT_TYPE,
    requestPath: req.url,
    requestMethod: req.method
  });

  const { month, calendarID } = req.query;

  if (!month || !calendarID) {
    console.error('[Vercel:Dates] Missing parameters:', { month, calendarID });
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!process.env.ACUITY_API_KEY || !process.env.ACUITY_USER_ID) {
    console.error('[Vercel:Dates] Missing credentials');
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  try {
    const requestStart = Date.now();
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Vercel:Dates] Request details:', {
      url: 'https://acuityscheduling.com/api/v1/availability/dates',
      calendarID,
      month,
      appointmentTypeID: process.env.APPOINTMENT_TYPE,
      auth: auth.slice(-10) // Show last 10 chars of auth for debugging
    });

    const response = await axios({
      method: 'GET',
      url: 'https://acuityscheduling.com/api/v1/availability/dates',
      timeout: ACUITY_TIMEOUT,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      params: {
        month,
        calendarID,
        appointmentTypeID: process.env.APPOINTMENT_TYPE
      }
    });

    console.log('[Vercel:Dates] Success:', {
      status: response.status,
      dataLength: response.data?.length || 0,
      responseTime: Date.now() - requestStart
    });
    return res.status(200).json(response.data).set({
      headers
    });
  } catch (error) {
    console.error('[Vercel:Dates] Error:', {
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

    return res.status(error.response?.status || 500).json({
      error: 'Failed to fetch available dates',
      details: error.response?.data || error.message
    }).set({
      headers
    });
  }
}