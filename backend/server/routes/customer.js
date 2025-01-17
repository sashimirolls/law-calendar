import express from 'express';
import axios from 'axios';
import { serverConfig } from '../config.js';

const router = express.Router();

const WEBHOOK_URL = 'https://prod-97.westus.logic.azure.com/workflows/6b6569e8a2b948dda51057ac126249d2/triggers/manual/paths/invoke?api-version=2016-06-01';
router.post('/submitForm', async (req, res) => {
  // const details = req.body;

  // console.log('Form Submitted:', details);
  // res.status(200).json(details);
 
  const details = req.body;
  try {
    // Forward the form data to the webhook
    // const webhookResponse = await axios.post(WEBHOOK_URL, details);

    console.log('Form Submitted:', details);
    // Respond to the client with a success message
    res.status(200).json({ message: 'Form submitted', data: details });
  } catch (error) {
    console.error('Error sending data to webhook:', error.message);
    res.status(500).json({ message: 'Failed to submit the form', error: error.message });
  }
});

export default router;
