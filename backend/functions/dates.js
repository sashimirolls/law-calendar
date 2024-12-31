const axios = require('axios');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'no-cache'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers: corsHeaders,
      body: '' 
    };
  }

  const { month, calendarID } = event.queryStringParameters || {};

  if (!month || !calendarID) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing required parameters' })
    };
  }

  try {
    const auth = Buffer.from(
      `${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`
    ).toString('base64');

    const response = await axios({
      method: 'GET',
      url: 'https://acuityscheduling.com/api/v1/availability/dates',
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

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Acuity API Error:', error.response?.data || error.message);
    
    return {
      statusCode: error.response?.status || 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to fetch available dates',
        details: error.response?.data || error.message
      })
    };
  }
};