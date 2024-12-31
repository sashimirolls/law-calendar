export interface Salesperson {
  name: string;
  calendarID: string;
}

export interface TimeSlot {
  datetime: string;
  isAvailable: boolean;
}

export interface AppointmentData {
  datetime: string;
  firstName: string;
  lastName: string;
  email: string;
  calendarID: string;
  appointmentTypeID: string;
}