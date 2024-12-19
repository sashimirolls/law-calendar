const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'no-cache'
};

function sendResponse(res, statusCode, data) {
  return res.status(statusCode)
    .setHeader('Content-Type', 'application/json')
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    .setHeader('Access-Control-Max-Age', '86400')
    .setHeader('Cache-Control', 'no-cache')
    .json(data);
}

module.exports = {
  corsHeaders,
  sendResponse
};