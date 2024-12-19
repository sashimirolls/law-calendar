import { TimeSlot } from '../types/acuity';
import { Logger } from '../utils/logger';
import { formatDate } from '../utils/date';
import { acuityClient } from './acuity/client';

export async function getAvailability(calendarID: string, date: string): Promise<TimeSlot[]> {
  try {
    Logger.debug('AcuityAPI', 'Fetching availability', { calendarID, date });
    
    const formattedDate = formatDate(date);
    const month = formattedDate.slice(0, 7); // YYYY-MM format

    // Get available dates from Vercel API
    const datesResponse = await acuityClient.get('/availability/dates', {
      params: {
        month,
        calendarID,
        appointmentTypeID: import.meta.env.APPOINTMENT_TYPE
      }
    });

    // Check if the requested date is in available dates
    const availableDates = datesResponse.data;
    if (!Array.isArray(availableDates)) {
      Logger.debug('AcuityAPI', 'No availability for date:', formattedDate);
      return [];
    }

    // Get available times from Vercel API
    const timesResponse = await acuityClient.get('/availability/times', {
      params: {
        date: formattedDate,
        calendarID,
        appointmentTypeID: import.meta.env.APPOINTMENT_TYPE
      }
    });

    if (!Array.isArray(timesResponse.data)) {
      Logger.error('AcuityAPI', 'Invalid times response format:', timesResponse.data);
      return [];
    }

    return timesResponse.data.map((slot: any) => ({
      datetime: slot.time || slot.datetime,
      isAvailable: true
    }));
  } catch (error) {
    Logger.error('AcuityAPI', 'Error in availability flow:', error);
    return [];
  }
}