import { TimeSlot } from '../types/acuity';
import { Logger } from '../utils/logger';
import { formatDate } from '../utils/date';
import axios from 'axios';

import { API_CONFIG } from './config';

export async function getAvailability(calendarID: string, date: string): Promise<TimeSlot[]> {
  try {
    Logger.debug('AcuityAPI', 'Fetching availability', { calendarID, date });
    
    const formattedDate = formatDate(date);
    const month = formattedDate.slice(0, 7); // YYYY-MM format

    // Get available dates from Vercel API
    const datesResponse = await axios.get(`${API_CONFIG.BASE_URL}/availability`, {
      params: {
        month,
        calendarID,
        appointmentTypeID: import.meta.env.APPOINTMENT_TYPE
      }
    });

    // Check if the requested date is in available dates
    const availableDates = datesResponse?.data?.data.map((item: { date: any; }) => item.date);
    if (!Array.isArray(availableDates)) {
      Logger.debug('AcuityAPI', 'No availability for date:', formattedDate);
      return [];
    }

    // Get available times from Vercel API
    // const timesResponse = await axios.get(`${API_CONFIG.BASE_URL}/availability/times`, {
    //   params: {
    //     date: formattedDate,
    //     calendarID,
    //     appointmentTypeID: import.meta.env.APPOINTMENT_TYPE
    //   }
    // });

    // if (!Array.isArray(timesResponse.data)) {
    //   Logger.error('AcuityAPI', 'Invalid times response format:', timesResponse.data);
    //   return [];
    // }

    const timesResponse = datesResponse?.data?.data.flatMap((item: { times: any[] }) =>
      item.times.map((timeObj) => timeObj.time)
    );
    return timesResponse.map((slot: any) => ({
      datetime: slot || slot.time || slot.datetime,
      isAvailable: true
    }));
  } catch (error) {
    Logger.error('AcuityAPI', 'Error in availability flow:', error);
    return [];
  }
}
