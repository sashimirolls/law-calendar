import axios from 'axios';
import { TimeSlot } from '../types/acuity';
import { Logger } from '../utils/logger';
import { API_CONFIG } from './config';

export async function getAvailability(calendarId: string, date: string): Promise<TimeSlot[]> {
  try {
    Logger.debug('AcuityAPI', 'Fetching availability', { calendarId, date });

    const response = await axios.get(`${API_CONFIG.BASE_URL}/availability`, {
      params: {
        date,
        calendarId,
        appointmentTypeID: API_CONFIG.ACUITY.APPOINTMENT_TYPE
      },
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!Array.isArray(response.data)) {
      Logger.error('AcuityAPI', 'Invalid response format:', response.data);
      return [];
    }

    return response.data.map((slot: any) => ({
      datetime: slot.time || slot.datetime,
      isAvailable: true
    }));
  } catch (error) {
    Logger.error('AcuityAPI', 'Error in availability flow:', error);
    return [];
  }
}