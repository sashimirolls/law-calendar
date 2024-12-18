import axios from 'axios';
import { TimeSlot } from '../types/acuity';
import { Logger } from '../utils/logger';
import { API_CONFIG } from './config';

async function getAvailableDates(calendarId: string, month: string): Promise<string[]> {
  const apiUrl = `${API_CONFIG.BASE_URL}/dates`;
  
  Logger.debug('AcuityAPI', 'Fetching available dates', { 
    calendarId, 
    month,
    apiUrl
  });

  try {
    const response = await axios.get(apiUrl, {
      params: { 
        calendarId,
        month,
        appointmentTypeID: API_CONFIG.ACUITY.APPOINTMENT_TYPE
      },
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!Array.isArray(response.data)) {
      Logger.error('AcuityAPI', 'Invalid response format:', response.data);
      throw new Error(response.data?.error || 'Invalid API response');
    }

    return response.data.map((date: any) => date.date);
  } catch (error) {
    Logger.error('AcuityAPI', 'Error fetching dates:', error);
    throw error;
  }
}

async function getAvailableTimes(calendarId: string, date: string): Promise<TimeSlot[]> {
  const apiUrl = `${API_CONFIG.BASE_URL}/times`;
  
  Logger.debug('AcuityAPI', 'Fetching available times', { 
    calendarId, 
    date,
    apiUrl
  });

  try {
    const response = await axios.get(apiUrl, {
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
      throw new Error(response.data?.error || 'Invalid API response');
    }

    return response.data.map((slot: any) => ({
      datetime: slot.time || slot.datetime,
      isAvailable: true
    }));
  } catch (error) {
    Logger.error('AcuityAPI', 'Error fetching times:', error);
    throw error;
  }
}

export async function getAvailability(calendarId: string, date: string): Promise<TimeSlot[]> {
  try {
    // First get available dates for the month
    const month = date.substring(0, 7); // Extract YYYY-MM from YYYY-MM-DD
    const availableDates = await getAvailableDates(calendarId, month);
    
    Logger.debug('AcuityAPI', 'Available dates:', availableDates);

    // Ensure availableDates is an array before using includes
    if (!Array.isArray(availableDates) || !availableDates.includes(date)) {
      Logger.warn('AcuityAPI', 'Requested date not available:', date);
      return [];
    }

    // Then get times for the specific date
    const times = await getAvailableTimes(calendarId, date);
    
    // Ensure times is an array
    if (!Array.isArray(times)) {
      Logger.error('AcuityAPI', 'Invalid times format:', times);
      return [];
    }

    Logger.debug('AcuityAPI', 'Available times:', { count: times.length, times });
    return times;
  } catch (error) {
    Logger.error('AcuityAPI', 'Error in availability flow:', error);
    throw error;
  }
}