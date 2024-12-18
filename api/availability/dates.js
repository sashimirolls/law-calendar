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
    ACUITY_API_KEY: !!process.env.ACUITY_API_KEY,
    ACUITY_USER_ID: !!process.env.ACUITY_USER_ID,
    APPOINTMENT_TYPE: !!process.env.APPOINTMENT_TYPE
  });

  const { month, calendarId } = req.query;

  if (!month || !calendarId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!process.env.ACUITY_API_KEY || !process.env.ACUITY_USER_ID) {
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Vercel:Availability:Dates] Making Acuity request:', {
      calendarId,
      month,
      appointmentTypeID: process.env.APPOINTMENT_TYPE
    });

    const response = await axios({
      method: 'GET',
      url: 'https://acuityscheduling.com/api/v1/availability/dates',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      params: {
        month,
        calendarID: calendarId,
        appointmentTypeID: process.env.APPOINTMENT_TYPE
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('[Vercel:Availability:Dates] Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return res.status(error.response?.status || 500).json({
      error: 'Failed to fetch available dates',
      details: error.response?.data || error.message
    });
  }
};