import axios from 'axios';

export default async (req, res) => {
  Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('[Vercel:Availability] Request received:', {
    method: req.method,
    query: req.query,
    headers: req.headers,
    env: {
      hasApiKey: !!process.env.ACUITY_API_KEY,
      hasUserId: !!process.env.ACUITY_USER_ID,
      hasAppointmentType: !!process.env.APPOINTMENT_TYPE
    }
  });

  const date = req.query.month;
  const calendarId = req.query.calendarID;

  // Validate environment variables
  if (!process.env.ACUITY_API_KEY || !process.env.ACUITY_USER_ID || !process.env.APPOINTMENT_TYPE) {
    console.error('[Vercel:Availability] Missing environment variables');
    return res.status(500).json({ 
      error: 'Configuration Error',
      details: 'Missing required environment variables'
    });
  }

  if (!date || !calendarId) {
    console.error('[Vercel:Availability] Missing parameters:', { date, calendarId });
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Vercel:Availability] Making Acuity request:', {
      url: 'https://acuityscheduling.com/api/v1/availability/times',
      params: {
        date,
        calendarID: calendarId,
        appointmentTypeID: process.env.APPOINTMENT_TYPE
      }
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

    console.log('[Vercel:Availability] Success:', {
      status: response.status,
      dataLength: response.data?.length || 0
    });

    console.log("response: ",response);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('[Vercel:Availability] Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return res.status(error.response?.status || 500).json({
      error: 'Failed to fetch availability',
      details: error.response?.data || error.message
    });
  }
};
