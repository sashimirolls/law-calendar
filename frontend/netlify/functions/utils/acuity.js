const axios = require('axios');

const ACUITY_BASE_URL = 'https://acuityscheduling.com/api/v1';
const ACUITY_TIMEOUT = 15000;

function getAuthHeader() {
  const auth = Buffer.from(
    `${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`
  ).toString('base64');
  return `Basic ${auth}`;
}

async function acuityRequest(endpoint, params) {
  return axios({
    method: 'GET',
    url: `${ACUITY_BASE_URL}${endpoint}`,
    timeout: ACUITY_TIMEOUT,
    headers: {
      'Authorization': getAuthHeader(),
      'Accept': 'application/json'
    },
    params: {
      ...params,
      appointmentTypeID: process.env.APPOINTMENT_TYPE
    }
  });
}

module.exports = { acuityRequest };