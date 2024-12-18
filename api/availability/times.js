const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { date, calendarId } = req.query;

  if (!date || !calendarId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Vercel:Availability:Times] Making Acuity request:', {
      calendarId,
      date,
      appointmentTypeID: process.env.APPOINTMENT_TYPE
    });

    const response = await axios({
      method: 'GET',
      url: 'https://acuityscheduling.com/api/v1/availability/times',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      params: {
        date,
        calendarID: calendarId,
        appointmentTypeID: process.env.APPOINTMENT_TYPE
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('[Vercel:Availability:Times] Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return res.status(error.response?.status || 500).json({
      error: 'Failed to fetch available times',
      details: error.response?.data || error.message
    });
  }
};