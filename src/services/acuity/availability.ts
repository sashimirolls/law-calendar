import axios from 'axios';
import { AcuityTimeSlot } from './types';
import { acuityConfig } from './config';
import { Logger } from '../../utils/logger';

export async function fetchAvailability(calendarId: string, date: string): Promise<AcuityTimeSlot[]> {
  Logger.debug('AcuityAPI:Availability', 'Fetching slots', { calendarId, date });

  try {
    const response = await axios.get(`${acuityConfig.baseUrl}/availability`, {
      params: { date, calendarId }
    });

    Logger.debug('AcuityAPI:Availability', 'Response received', response.data);
    return response.data;
  } catch (error) {
    Logger.error('AcuityAPI:Availability', 'Failed to fetch', error);
    throw error;
  }
}