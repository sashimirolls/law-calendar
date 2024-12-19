const { corsHeaders } = require('../utils/headers');
const { acuityRequest } = require('../utils/acuity');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
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
    console.log('[Netlify:Dates] Making request:', { month, calendarID });
    
    const response = await acuityRequest('/availability/dates', {
      month,
      calendarID
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('[Netlify:Dates] Error:', error);
    
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