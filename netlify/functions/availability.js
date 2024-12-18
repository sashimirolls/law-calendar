const axios = require('axios');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  console.log('[Netlify:Availability] Request received:', {
    method: event.httpMethod,
    params: event.queryStringParameters,
    env: {
      hasApiKey: !!process.env.ACUITY_API_KEY,
      hasUserId: !!process.env.ACUITY_USER_ID,
      hasAppointmentType: !!process.env.APPOINTMENT_TYPE
    }
  });

  const { date, calendarId } = event.queryStringParameters || {};

  if (!date || !calendarId) {
    console.error('[Netlify:Availability] Missing parameters:', { date, calendarId });
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required parameters' })
    };
  }

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Netlify:Availability] Making Acuity request:', {
      calendarId,
      date,
      appointmentTypeID: process.env.APPOINTMENT_TYPE,
      hasAuth: !!auth
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

    console.log('[Netlify:Availability] Acuity response:', {
      status: response.status,
      dataLength: response.data?.length || 0
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('[Netlify:Availability] Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });

    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch availability',
        details: error.response?.data || error.message
      })
    };
  }
};