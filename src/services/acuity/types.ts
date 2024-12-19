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
  timeout: number;
  retries: number;
  headers: {
    Accept: string;
    'Cache-Control': string;
  };
}