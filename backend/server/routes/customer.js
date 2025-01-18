import express from 'express';
import axios from 'axios';
import { serverConfig } from '../config.js';

const router = express.Router();

const WEBHOOK_URL = 'https://prod-97.westus.logic.azure.com/workflows/6b6569e8a2b948dda51057ac126249d2/triggers/manual/paths/invoke/customer/submitForm?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xhfIYkDBFT3rs4meGxuOVubV7WGcKBSMXKgEg_HFbfo';
const WEBHOOK_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type'
};

router.post('/submitForm', async (req, res) => {
 
  const details = req.body;
  try {
    // Forwarding the form data to the webhook
    const webhookResponse = await axios.post(WEBHOOK_URL, details, WEBHOOK_HEADERS);

    res.status(200).json({ message: 'Form submitted', data: details });
  } catch (error) {
    console.error('Error sending data to webhook:', error.message);
    res.status(500).json({ message: 'Failed to submit the form', error: error.message });
  }
});

export default router;
