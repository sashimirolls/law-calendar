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

  // Debug environment variables and request
  console.log('[DEBUG] Environment variables:', {
    ACUITY_API_KEY: process.env.ACUITY_API_KEY ? 'Present' : 'Missing',
    ACUITY_USER_ID: process.env.ACUITY_USER_ID ? 'Present' : 'Missing',
    APPOINTMENT_TYPE: process.env.APPOINTMENT_TYPE ? 'Present' : 'Missing'
  });

  console.log('[DEBUG] Request details:', {
    method: event.httpMethod,
    params: event.queryStringParameters
  });

  const { date, calendarId } = event.queryStringParameters || {};

  if (!date || !calendarId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required parameters' })
    };
  }

  if (!process.env.ACUITY_API_KEY || !process.env.ACUITY_USER_ID) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing API credentials' })
    };
  }

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[DEBUG] Making Acuity request:', {
      url: 'https://acuityscheduling.com/api/v1/availability/times',
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

    console.log('[DEBUG] Acuity response:', {
      status: response.status,
      dataLength: response.data?.length || 0
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('[DEBUG] Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
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