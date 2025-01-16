const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'no-cache'
};

function sendResponse(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json');
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  return res.status(statusCode).json(data);
}

export default {corsHeaders, sendResponse};
