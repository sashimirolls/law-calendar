import express from 'express';
import axios from 'axios';
import { serverConfig } from '../config.js';

const router = express.Router();

router.post('/book-appointment', async (req, res) => {
    const { appointmentTypeID, datetime, calendarID,clientInfo } = req.body;
  
    console.log('Booking appointment:', req.body)
    if (!appointmentTypeID || !datetime || !clientInfo) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
  
    try {
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
  
      res.status(200).json({ appointment: response.data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to book appointment', details: error.message });
    }
  });
  
  export default router;