import React from 'react';
import { SalespeopleSelector } from './SalespeopleSelector';
import { Calendar } from './Calendar';
import { InitialState } from './InitialState';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingDisplay } from './LoadingDisplay';
import { useApp } from '../contexts/AppContext';

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
        </>
      )}
    </div>
  );
}