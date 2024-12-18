export interface AcuityTimeSlot {
  time: string;
  datetime: string;
}

export interface AcuityErrorResponse {
  error: string;
  details?: any;
}

export interface AcuityConfig {
  baseUrl: string;
  apiKey: string;
  userId: string;
  appointmentType: string;
}