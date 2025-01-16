const axios = require('axios');
const { sendResponse } = require('../utils/response');

const ACUITY_TIMEOUT = 15000; // 15 seconds

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, {});
  }

  console.log('[Vercel:Dates] Environment check:', {
    hasApiKey: !!process.env.ACUITY_API_KEY,
    hasUserId: !!process.env.ACUITY_USER_ID,
    hasAppointmentType: !!process.env.APPOINTMENT_TYPE
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

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Vercel:Dates] Making request:', {
      calendarID,
      month,
      appointmentTypeID: process.env.APPOINTMENT_TYPE
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
      dataLength: response.data?.length || 0
    });

    return sendResponse(res, 200, response.data);
  } catch (error) {
    console.error('[Vercel:Dates] Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return sendResponse(res, error.response?.status || 500, {
      error: 'Failed to fetch available dates',
      details: error.response?.data || error.message
    });
  }
};