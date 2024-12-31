import express from 'express';
import axios from 'axios';
import { serverConfig } from '../config.js';

const router = express.Router();

router.get('/availability', async (req, res) => {
  const date = req.query.month;
  const calendarId = req.query.calendarID;

  console.log('[Acuity] Fetching availability:', {
    date,
    calendarId,
    appointmentType: serverConfig.acuity.appointmentType
  });

  if (!date || !calendarId) {
    console.error('[Acuity] Missing required parameters');
    return res.status(400).json({ 
      error: 'Missing required parameters',
      details: { date, calendarId }
    });
  }

  try {
    const response = await axios.get(
      `${serverConfig.acuity.baseUrl}/availability/times`,
      {
        auth: {
          username: serverConfig.acuity.userId,
          password: serverConfig.acuity.apiKey
        },
        params: {
          date,
          calendarID: calendarId,
          appointmentTypeID: serverConfig.acuity.appointmentType
        }
      }
    );

    console.log('[Acuity] Successful response:', {
      status: response.status,
      slots: response.data?.length || 0
    });

    res.json(response.data);
  } catch (error) {
    console.error('[Acuity] API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch availability',
      details: error.response?.data || error.message
    });
  }
});

export default router;