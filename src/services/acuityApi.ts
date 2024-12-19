import axios from 'axios';
import { TimeSlot } from '../types/acuity';
import { Logger } from '../utils/logger';
import { API_CONFIG } from './config';
import { formatDate } from '../utils/date';

export async function getAvailability(calendarId: string, date: string): Promise<TimeSlot[]> {
  try {
    Logger.debug('AcuityAPI', 'Fetching availability', { calendarId, date });
    
    // Test API connection first
    const testResponse = await axios.get(`${API_CONFIG.BASE_URL}/test`);
    Logger.debug('AcuityAPI', 'Test response:', testResponse.data);

    const formattedDate = formatDate(date);

    // First get available dates for the month
    const datesResponse = await axios.get(`${API_CONFIG.BASE_URL}/dates`, {
      params: {
        month: formattedDate.slice(0, 7), // YYYY-MM format
        calendarID: calendarId, // Keep this as is since it's internal
        appointmentTypeID: API_CONFIG.ACUITY.APPOINTMENT_TYPE
      },
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    // Check if the requested date is in available dates
    const availableDates = datesResponse.data;
    if (!Array.isArray(availableDates) || !availableDates.some(d => d.date === formattedDate)) {
      Logger.debug('AcuityAPI', 'No availability for date:', formattedDate);
      return [];
    }

    // Get available times for the specific date
    const timesResponse = await axios.get(`${API_CONFIG.BASE_URL}/times`, {
      params: {
        date: formattedDate,
        calendarID: calendarId, // Keep this as is since it's internal
        appointmentTypeID: API_CONFIG.ACUITY.APPOINTMENT_TYPE
      },
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
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