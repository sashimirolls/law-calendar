const axios = require('axios');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const { date, calendarID } = event.queryStringParameters || {};

  if (!date || !calendarID) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required parameters' })
    };
  }

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Netlify:Times] Making request:', {
      date,
      calendarID,
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
        calendarID,
        appointmentTypeID: process.env.APPOINTMENT_TYPE
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('[Netlify:Times] Error:', error);
    
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch available times',
        details: error.response?.data || error.message
      })
    };
  }
};