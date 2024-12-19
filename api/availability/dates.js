const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('[Vercel:Dates] Environment check:', {
    hasApiKey: !!process.env.ACUITY_API_KEY,
    hasUserId: !!process.env.ACUITY_USER_ID,
    hasAppointmentType: !!process.env.APPOINTMENT_TYPE,
    requestPath: req.url,
    requestMethod: req.method
  });

  const { month, calendarId } = req.query;

  if (!month || !calendarId) {
    console.error('[Vercel:Dates] Missing parameters:', { month, calendarId });
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!process.env.ACUITY_API_KEY || !process.env.ACUITY_USER_ID) {
    console.error('[Vercel:Dates] Missing credentials');
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Vercel:Dates] Making Acuity request:', {
      calendarId,
      month,
      appointmentTypeID: process.env.APPOINTMENT_TYPE
    });

    const response = await axios({
      method: 'GET',
      url: 'https://acuityscheduling.com/api/v1/availability/dates',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        month,
        calendarID: calendarId,
        appointmentTypeID: process.env.APPOINTMENT_TYPE
      }
    });

    console.log('[Vercel:Dates] Success:', {
      status: response.status,
      dataLength: response.data?.length || 0
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('[Vercel:Dates] Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });

    return res.status(error.response?.status || 500).json({
      error: 'Failed to fetch available dates',
      details: error.response?.data || error.message
    });
  }
};