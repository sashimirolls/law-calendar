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

  console.log('[Vercel:Times] Environment check:', {
    hasApiKey: !!process.env.ACUITY_API_KEY,
    hasUserId: !!process.env.ACUITY_USER_ID,
    hasAppointmentType: !!process.env.APPOINTMENT_TYPE,
    requestPath: req.url,
    requestMethod: req.method
  });

  const { date, calendarId } = req.query;

  if (!date || !calendarId) {
    console.error('[Vercel:Times] Missing parameters:', { date, calendarId });
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!process.env.ACUITY_API_KEY || !process.env.ACUITY_USER_ID) {
    console.error('[Vercel:Times] Missing credentials');
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Vercel:Times] Making Acuity request:', {
      calendarId,
      date,
      appointmentTypeID: process.env.APPOINTMENT_TYPE
    });

    const response = await axios({
      method: 'GET',
      url: 'https://acuityscheduling.com/api/v1/availability/times',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        date,
        calendarID: calendarId,
        appointmentTypeID: process.env.APPOINTMENT_TYPE
      }
    });

    console.log('[Vercel:Times] Success:', {
      status: response.status,
      dataLength: response.data?.length || 0
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('[Vercel:Times] Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });

    return res.status(error.response?.status || 500).json({
      error: 'Failed to fetch available times',
      details: error.response?.data || error.message
    });
  }
};