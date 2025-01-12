import React from 'react';
import { SalespeopleSelector } from './SalespeopleSelector';
import { Calendar } from './Calendar';
import { InitialState } from './InitialState';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingDisplay } from './LoadingDisplay';
import { useApp } from '../contexts/AppContext';
import { Calendar as LucideCalendar } from 'lucide-react';

export function AppContent() {
  const { state, availability } = useApp();
  const { slots, loading, error } = availability;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {(state.error || error) && <ErrorDisplay error={state.error || error} />}
      {loading && <LoadingDisplay />}

      {state.selectedPeople.length === 0 && !state.error ? (
        <InitialState />
      ) : (
        <>
          <SalespeopleSelector
            salespeople={state.selectedPeople}
            selectedPeople={state.selectedPeople}
            readOnly={true}
          />

          {state.selectedPeople.length > 0 && (
            <Calendar availableSlots={slots} onTimeSelect={() => {}} />
          )}
          
            {/* <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <LucideCalendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Schedule an Appointment</h2>
              </div>
              <iframe src="https://app.acuityscheduling.com/schedule.php?owner=34196293&calendarID=11211335&timezone=America/New_York&ref=embedded_csp" title="Schedule Appointment" width="100%" height="800" frameBorder="0"></iframe><script src="https://embed.acuityscheduling.com/js/embed.js" type="text/javascript"></script>
            </div> */}
        </>
      )}
    </div>
  );
}