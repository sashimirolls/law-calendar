import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
config({ path: join(__dirname, '../.env') });

export const serverConfig = {
  port: process.env.PORT || 3001,
  acuity: {
    baseUrl: 'https://acuityscheduling.com/api/v1',
    apiKey: process.env.ACUITY_API_KEY,
    userId: process.env.ACUITY_USER_ID,
    appointmentType: process.env.APPOINTMENT_TYPE
  }
};