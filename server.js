import express from 'express';
import cors from 'cors';
import { serverConfig } from './server/config.js';
import { loggingMiddleware } from './server/middleware/logging.js';
import availabilityRoutes from './server/routes/availability.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);
app.use('/api', availabilityRoutes);

app.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port}`);
});