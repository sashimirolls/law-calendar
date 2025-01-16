const { corsHeaders } = require('../utils/headers');
const { acuityRequest } = require('../utils/acuity');

exports.handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers: corsHeaders,
      body: '' 
    };
  }

  const { date, calendarID } = event.queryStringParameters || {};

  if (!date || !calendarID) {
    console.error('[Netlify:Times] Missing parameters:', { date, calendarID });
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing required parameters' })
    };
  }

  try {
    console.log('[Netlify:Times] Making request:', { date, calendarID });
    
    const response = await acuityRequest('/availability/times', {
      date,
      calendarID
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('[Netlify:Times] Error:', error);
    
    return {
      statusCode: error.response?.status || 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to fetch available times',
        details: error.response?.data || error.message
      })
    };
  }
};