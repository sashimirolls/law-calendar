import React from 'react';
import { Calendar as LucideCalendar } from 'lucide-react';
import { TimeSlot } from '../types/acuity';

interface CalendarProps {
  availableSlots: TimeSlot[];
  onTimeSelect: (time: string) => void;
}

export function Calendar({ availableSlots, onTimeSelect }: CalendarProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <LucideCalendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Available Time Slots</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableSlots.map((slot) => (
          <button
            key={slot.datetime}
            onClick={() => onTimeSelect(slot.datetime)}
            className="p-3 text-sm border rounded-md hover:bg-blue-50 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {new Date(slot.datetime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </button>
        ))}
      </div>
    </div>
  );
}