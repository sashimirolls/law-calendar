import express from 'express';
import cors from 'cors';
import { serverConfig } from './server/config.js';
import { loggingMiddleware } from './server/middleware/logging.js';
import availabilityRoutes from './server/routes/availability.js';
import appointmentRoutes from './server/routes/appointment.js';

const app = express();

app.use(cors({ origin: 'https://chimerical-eclair-1c93b2.netlify.app' }));
app.use(express.json());
app.use(loggingMiddleware);
app.use('/api', availabilityRoutes);
app.use('/appointment', appointmentRoutes);

app.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port}`);
});
