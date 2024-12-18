import axios from 'axios';
import { TimeSlot } from '../types/acuity';
import { Logger } from '../utils/logger';
import { API_CONFIG } from './config';

export async function getAvailability(calendarId: string, date: string): Promise<TimeSlot[]> {
  const apiUrl = `${API_CONFIG.BASE_URL}/api/availability`;

  Logger.debug('AcuityAPI', 'Fetching availability', { 
    calendarId, 
    date,
    apiUrl
  });
  
  try {
    const response = await axios.get(apiUrl, {
      params: { date, calendarId },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    Logger.debug('AcuityAPI', 'Raw API response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    if (!response.data || response.data.error) {
      Logger.error('AcuityAPI', 'API returned error:', response.data);
      throw new Error(response.data?.error || 'Invalid API response');
    }
    
    const slots: TimeSlot[] = (response.data || []).map((slot: any) => ({
      datetime: slot.time || slot.datetime,
      isAvailable: true
    }));
    
    Logger.debug('AcuityAPI', 'Transformed slots:', slots);
    return slots;
  } catch (error) {
    Logger.error('AcuityAPI', 'Error fetching availability:', error);
    if (axios.isAxiosError(error)) {
      Logger.error('AcuityAPI', 'API Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          params: error.config?.params
        }
      });
    }
    throw new Error('Failed to fetch availability');
  }
}