import express from 'express';
import axios from 'axios';
import { serverConfig } from '../config.js';

const router = express.Router();

router.post('/book-appointment', async (req, res) => {
  const { appointmentTypeID, datetime, calendarID, clientInfo } = req.body;

  if (!appointmentTypeID || !datetime || !clientInfo) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    let appointmentResponses = [];

    // If calendarID is an array, send requests for each calendarID
    if (Array.isArray(calendarID)) {
      // If calendarID array has 2 values, send two requests concurrently
      if (calendarID.length === 2) {
        appointmentResponses = await Promise.all(calendarID.map(id =>
          axios.post(
            `${serverConfig.acuity.baseUrl}/appointments`,
            { appointmentTypeID, datetime, calendarID: id, ...clientInfo },
            {
              auth: {
                username: serverConfig.acuity.userId,
                password: serverConfig.acuity.apiKey,
              },
            }
          )
        ));
      } else {
        // If calendarID array has 1 value, send a single request
        const response = await axios.post(
          `${serverConfig.acuity.baseUrl}/appointments`,
          { appointmentTypeID, datetime, calendarID: calendarID[0], ...clientInfo },
          {
            auth: {
              username: serverConfig.acuity.userId,
              password: serverConfig.acuity.apiKey,
            },
          }
        );
        appointmentResponses.push(response);
      }
    } else {
      // If calendarID is not an array, send a single request
      const response = await axios.post(
        `${serverConfig.acuity.baseUrl}/appointments`,
        { appointmentTypeID, datetime, calendarID, ...clientInfo },
        {
          auth: {
            username: serverConfig.acuity.userId,
            password: serverConfig.acuity.apiKey,
          },
        }
      );
      appointmentResponses.push(response);
    }

    // Combine responses and send them back as a single response
    const combinedResponse = appointmentResponses.map(response => response.data);
    res.status(200).json({ appointments: combinedResponse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment', details: error.message });
  }
});

export default router;
