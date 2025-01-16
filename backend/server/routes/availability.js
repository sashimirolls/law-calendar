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
    // Fetch available dates
    const datesResponse = await axios.get(
      `${serverConfig.acuity.baseUrl}/availability/dates`,
      {
        auth: {
          username: serverConfig.acuity.userId,
          password: serverConfig.acuity.apiKey
        },
        params: {
          month: date,
          calendarID: calendarId,
          appointmentTypeID: serverConfig.acuity.appointmentType
        }
      }
    );

    const dates = datesResponse.data;

    // Fetch time slots for each date

    const timeSlotPromises = dates.map((dateObj) =>
      axios.get(
        `${serverConfig.acuity.baseUrl}/availability/times`,
        {
          auth: {
            username: serverConfig.acuity.userId,
            password: serverConfig.acuity.apiKey
          },
          params: {
            date: dateObj.date,
            calendarID: calendarId,
            appointmentTypeID: serverConfig.acuity.appointmentType
          }
        }
      ).then(response => ({
        date: dateObj.date,
        times: response.data
      }))
      .catch(error => {
        console.error(`[Acuity] Error fetching times for ${dateObj.date}:`, error.message);
        return { date: dateObj.date, times: [] };
      })
    );

    const timeSlots = await Promise.all(timeSlotPromises);

    res.json({ status: 200, data: timeSlots });
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
