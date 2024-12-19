const axios = require('axios');

module.exports = async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Cache-Control': 'no-cache'
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).json({}).set(headers);
  }

  try {
    const auth = Buffer.from(`${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`).toString('base64');
    
    console.log('[Test] Making Acuity request with auth:', auth);

    const response = await axios({
      method: 'GET',
      url: 'https://acuityscheduling.com/api/v1/appointment-types',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    return res.status(200).json({
      success: true,
      data: response.data,
      auth: auth
    }).set(headers);
  } catch (error) {
    console.error('[Test] Error:', {
      message: error.message,
      response: error.response?.data
    });

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data
    }).set(headers);
  }
};