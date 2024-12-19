const axios = require('axios');
const { corsHeaders, sendResponse } = require('../utils/response');

const ACUITY_TIMEOUT = 15000; // 15 seconds

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, {});
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
    return sendResponse(res, 400, { error: 'Missing required parameters' });
  }

  if (!process.env.ACUITY_API_KEY || !process.env.ACUITY_USER_ID) {
    console.error('[Vercel:Dates] Missing credentials');
    return sendResponse(res, 500, { error: 'Missing API credentials' });
  }

  const requestStart = Date.now();

  try {
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
    return sendResponse(res, 200, response.data);
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

    return sendResponse(res, error.response?.status || 500, {
      error: 'Failed to fetch available dates',
      details: error.response?.data || error.message
    });
  }